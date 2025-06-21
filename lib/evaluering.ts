import { getSession } from './neo4j';

/**
 * Evaluering service for å sjekke om søkere oppfyller opptakskrav
 * Bygger på eksisterende LogicalNode struktur fra /app/api/opptaksveier/[id]/krav/route.ts
 */

export interface SokerProfile {
  id: string;
  fornavn: string;
  etternavn: string;
  fodselsdato: string;
  alder: number;
  dokumentasjon: {
    id: string;
    type: string;
    fagkoder: {
      kode: string;
      navn: string;
      karakter: string;
      karaktersystem: string;
      dato: string;
    }[];
  }[];
}

export interface EvalueringsResultat {
  oppfylt: boolean;
  detaljer: string;
  manglendeFagkoder?: string[];
  oppfylteKrav?: string[];
}

export interface OpptaksVeiEvaluering {
  opptaksVei: {
    id: string;
    navn: string;
    beskrivelse: string;
  };
  oppfylt: boolean;
  regeluttrykk: string;
  evaluering: EvalueringsResultat;
}

/**
 * Henter komplett søker-profil med dokumentasjon og fagkoder
 */
export async function getSokerProfile(sokerId: string): Promise<SokerProfile | null> {
  const session = getSession();

  try {
    // Først hent person info
    const personQuery = `
      MATCH (p:Person {id: $sokerId})
      RETURN p
    `;

    const personResult = await session.run(personQuery, { sokerId });
    if (personResult.records.length === 0) {
      return null;
    }

    const person = personResult.records[0].get('p').properties;

    // Så hent dokumentasjon separat for å unngå komplekse joins
    const dokQuery = `
      MATCH (p:Person {id: $sokerId})-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)
      OPTIONAL MATCH (d)-[r:INNEHOLDER]->(fk:Fagkode)
      WITH d, collect({
        kode: fk.kode,
        navn: fk.navn,
        karakter: r.karakter,
        karaktersystem: r.karaktersystem,
        dato: toString(r.dato)
      }) as fagkoder
      RETURN d.id as dokId, d.type as dokType, fagkoder
    `;

    const dokResult = await session.run(dokQuery, { sokerId });

    const dokumentasjon = dokResult.records.map((record) => ({
      id: record.get('dokId'),
      type: record.get('dokType'),
      fagkoder: record.get('fagkoder').filter((f: any) => f.kode),
    }));

    // Beregn alder basert på fødselsdato
    const fodselsdato = new Date(person.fodselsdato);
    const idag = new Date();
    const alder = idag.getFullYear() - fodselsdato.getFullYear();

    return {
      id: person.id,
      fornavn: person.fornavn,
      etternavn: person.etternavn,
      fodselsdato: person.fodselsdato,
      alder,
      dokumentasjon,
    };
  } finally {
    await session.close();
  }
}

/**
 * Evaluerer om en søker oppfyller et spesifikt kravelement
 */
export async function evaluateKravelement(
  sokerProfile: SokerProfile,
  kravelement: { navn: string; type: string }
): Promise<EvalueringsResultat> {
  const session = getSession();

  try {
    // GSK - Generell studiekompetanse (spesiallogikk)
    if (kravelement.type === 'generell-studiekompetanse') {
      const harVitnemaal = sokerProfile.dokumentasjon.some(
        (d) => d.type === 'vitnemaal' && d.fagkoder.length > 0
      );

      return {
        oppfylt: harVitnemaal,
        detaljer: harVitnemaal
          ? 'Har vitnemål fra videregående'
          : 'Mangler vitnemål fra videregående',
        oppfylteKrav: harVitnemaal ? ['Generell studiekompetanse'] : [],
        manglendeFagkoder: harVitnemaal ? [] : ['Vitnemål fra VGS'],
      };
    }

    // For andre kravelementer: bruk database-spørring
    const fagkodeQuery = `
      MATCH (krav:Kravelement {navn: $kravelementNavn})
      MATCH (fagkode:Fagkode)-[:KVALIFISERER_FOR]->(krav)
      RETURN collect(fagkode.kode) as kvalifiserendeFagkoder
    `;

    const result = await session.run(fagkodeQuery, { kravelementNavn: kravelement.navn });

    if (result.records.length === 0) {
      return {
        oppfylt: false,
        detaljer: `Ingen fagkoder funnet for kravelement: ${kravelement.navn}`,
        oppfylteKrav: [],
        manglendeFagkoder: [],
      };
    }

    const kvalifiserendeFagkoder = result.records[0].get('kvalifiserendeFagkoder');

    // Sjekk om søker har noen av de kvalifiserende fagkodene
    const harKvalifiserendeFagkode = sokerProfile.dokumentasjon.some((d) =>
      d.fagkoder.some((f) => kvalifiserendeFagkoder.includes(f.kode))
    );

    return {
      oppfylt: harKvalifiserendeFagkode,
      detaljer: harKvalifiserendeFagkode
        ? `Har kvalifiserende fagkode for ${kravelement.navn}`
        : `Mangler kvalifiserende fagkode for ${kravelement.navn}`,
      oppfylteKrav: harKvalifiserendeFagkode ? [kravelement.navn] : [],
      manglendeFagkoder: harKvalifiserendeFagkode ? [] : kvalifiserendeFagkoder,
    };
  } finally {
    await session.close();
  }
}

/**
 * Evaluerer LogicalNode rekursivt - bygger på buildDetaljertKrav logikken
 * fra /app/api/opptaksveier/[id]/krav/route.ts
 */
export async function evaluateLogicalNode(
  sokerProfile: SokerProfile,
  nodeName: string
): Promise<EvalueringsResultat> {
  const session = getSession();

  try {
    // Samme query som buildDetaljertKrav
    const query = `
      MATCH (node:LogicalNode {navn: $nodeName})
      OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
      OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
      RETURN 
        node,
        collect(DISTINCT krav) as kravelementer,
        collect(DISTINCT childNode) as childNodes
    `;

    const result = await session.run(query, { nodeName });

    if (result.records.length === 0) {
      return {
        oppfylt: false,
        detaljer: `LogicalNode '${nodeName}' ikke funnet`,
        oppfylteKrav: [],
        manglendeFagkoder: [],
      };
    }

    const record = result.records[0];
    const node = record.get('node').properties;
    const kravelementer = record
      .get('kravelementer')
      .filter((k: any) => k)
      .map((k: any) => k.properties);
    const childNodes = record.get('childNodes').filter((n: any) => n);

    // Evaluer direkte kravelementer
    const kravResultater: EvalueringsResultat[] = [];
    for (const krav of kravelementer) {
      const resultat = await evaluateKravelement(sokerProfile, krav);
      kravResultater.push(resultat);
    }

    // Evaluer child nodes rekursivt
    const childResultater: EvalueringsResultat[] = [];
    for (const childNode of childNodes) {
      const childResultat = await evaluateLogicalNode(sokerProfile, childNode.properties.navn);
      childResultater.push(childResultat);
    }

    // Kombiner alle resultater
    const alleResultater = [...kravResultater, ...childResultater];

    // Beregn samlet resultat basert på node type
    let samletOppfylt = false;
    let detaljer = '';

    if (node.type === 'AND') {
      samletOppfylt = alleResultater.every((r) => r.oppfylt);
      const oppfylte = alleResultater.filter((r) => r.oppfylt).length;
      detaljer = `AND: ${oppfylte}/${alleResultater.length} krav oppfylt`;
    } else if (node.type === 'OR') {
      samletOppfylt = alleResultater.some((r) => r.oppfylt);
      const oppfylte = alleResultater.filter((r) => r.oppfylt).length;
      detaljer = `OR: ${oppfylte}/${alleResultater.length} krav oppfylt (kun 1 trengs)`;
    } else if (node.type === 'NOT') {
      samletOppfylt = !alleResultater.every((r) => r.oppfylt);
      detaljer = `NOT: Motsatt av ${alleResultater.length} krav`;
    }

    // Samle oppfylte krav og manglende fagkoder
    const oppfylteKrav = alleResultater.flatMap((r) => r.oppfylteKrav || []);
    const manglendeFagkoder = alleResultater.flatMap((r) => r.manglendeFagkoder || []);

    return {
      oppfylt: samletOppfylt,
      detaljer: `${node.navn}: ${detaljer}`,
      oppfylteKrav,
      manglendeFagkoder: [...new Set(manglendeFagkoder)], // Fjern duplikater
    };
  } finally {
    await session.close();
  }
}

/**
 * Evaluerer søker mot en spesifikk opptaksvei
 */
export async function evaluateOpptaksVei(
  sokerId: string,
  opptaksVeiId: string
): Promise<OpptaksVeiEvaluering | null> {
  const session = getSession();

  try {
    // Hent søker-profil
    const sokerProfile = await getSokerProfile(sokerId);
    if (!sokerProfile) {
      return null;
    }

    // Hent opptaksvei med LogicalNode (samme som i krav/route.ts)
    const query = `
      MATCH (ov:OpptaksVei {id: $opptaksVeiId})
      OPTIONAL MATCH (ov)-[:HAR_REGEL]->(root:LogicalNode)
      RETURN ov, root
    `;

    const result = await session.run(query, { opptaksVeiId });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const opptaksvei = record.get('ov').properties;
    const rootNode = record.get('root')?.properties;

    if (!rootNode) {
      return {
        opptaksVei: {
          id: opptaksvei.id,
          navn: opptaksvei.navn,
          beskrivelse: opptaksvei.beskrivelse,
        },
        oppfylt: true, // Ingen krav = automatisk oppfylt
        regeluttrykk: 'Ingen krav definert',
        evaluering: {
          oppfylt: true,
          detaljer: 'Ingen krav definert for denne opptaksveien',
          oppfylteKrav: [],
          manglendeFagkoder: [],
        },
      };
    }

    // Bygg regeluttrykk (gjenbruk eksisterende funksjon)
    const regeluttrykk = await buildRegeluttrykk(session, rootNode.navn);

    // Evaluer LogicalNode
    const evaluering = await evaluateLogicalNode(sokerProfile, rootNode.navn);

    return {
      opptaksVei: {
        id: opptaksvei.id,
        navn: opptaksvei.navn,
        beskrivelse: opptaksvei.beskrivelse,
      },
      oppfylt: evaluering.oppfylt,
      regeluttrykk,
      evaluering,
    };
  } finally {
    await session.close();
  }
}

// Gjenbruk buildRegeluttrykk fra krav/route.ts
async function buildRegeluttrykk(session: any, nodeName: string): Promise<string> {
  const query = `
    MATCH (node:LogicalNode {navn: $nodeName})
    OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
    OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
    RETURN 
      node,
      collect(DISTINCT krav) as kravelementer,
      collect(DISTINCT childNode) as childNodes
  `;

  const result = await session.run(query, { nodeName });
  if (result.records.length === 0) return '';

  const record = result.records[0];
  const node = record.get('node').properties;
  const kravelementer = record.get('kravelementer').filter((k: any) => k);
  const childNodes = record.get('childNodes').filter((n: any) => n);

  const parts: string[] = [];

  // Legg til direkte kravelementer
  kravelementer.forEach((krav: any) => {
    parts.push(krav.properties.navn);
  });

  // Legg til child nodes rekursivt
  for (const childNode of childNodes) {
    const childExpr = await buildRegeluttrykk(session, childNode.properties.navn);
    if (childExpr) {
      parts.push(`(${childExpr})`);
    }
  }

  // Bygg uttrykk basert på node type
  let expression = '';

  if (node.type === 'AND') {
    expression = parts.join(' OG ');
  } else if (node.type === 'OR') {
    expression = parts.join(' ELLER ');
  } else if (node.type === 'NOT') {
    expression = `IKKE (${parts.join(' OG ')})`;
  }

  return expression;
}
