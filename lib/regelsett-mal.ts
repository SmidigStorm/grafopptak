import { getSession } from '@/lib/neo4j';

/**
 * Kopierer et regelsett-mal og lager en ny instans for et utdanningstilbud
 */
export async function opprettRegelsettFraMal(
  utdanningstilbudId: string,
  regelssettMalId: string,
  utdanningstilbudNavn: string
): Promise<string> {
  const session = getSession();

  try {
    // Lag nytt regelsett-navn basert på utdanningstilbud og år
    const currentYear = new Date().getFullYear();
    const regelssettNavn = `${utdanningstilbudNavn} H${currentYear.toString().slice(-2)}`;

    // Kopier regelsett-mal og opprett ny instans
    const result = await session.run(
      `
      // Finn regelsett-mal
      MATCH (mal:Regelsett {id: $regelssettMalId, erMal: true})
      
      // Opprett nytt regelsett basert på mal
      CREATE (nytt:Regelsett {
        id: randomUUID(),
        navn: $regelssettNavn,
        versjon: "1.0",
        gyldigFra: date(),
        gyldigTil: null,
        beskrivelse: mal.beskrivelse + " (basert på mal)",
        aktiv: true,
        opprettet: datetime(),
        erMal: false,
        malType: mal.malType
      })
      
      // Kopierer alle INNEHOLDER-relasjoner (grunnlag)
      WITH mal, nytt
      MATCH (mal)-[:INNEHOLDER]->(grunnlag:Grunnlag)
      CREATE (nytt)-[:INNEHOLDER]->(grunnlag)
      
      // Kopierer alle HAR_OPPTAKSVEI-relasjoner og opptaksveier
      WITH mal, nytt
      MATCH (mal)-[:HAR_OPPTAKSVEI]->(opptaksVei:OpptaksVei)
      
      // Opprett nye opptaksveier
      CREATE (nyOpptaksVei:OpptaksVei {
        id: randomUUID(),
        navn: opptaksVei.navn,
        beskrivelse: opptaksVei.beskrivelse,
        prioritet: opptaksVei.prioritet,
        aktiv: opptaksVei.aktiv
      })
      CREATE (nytt)-[:HAR_OPPTAKSVEI]->(nyOpptaksVei)
      
      // Kopierer alle relasjoner fra original opptaksvei
      WITH opptaksVei, nyOpptaksVei
      OPTIONAL MATCH (opptaksVei)-[:BASERT_PÅ]->(grunnlag:Grunnlag)
      FOREACH (g IN CASE WHEN grunnlag IS NOT NULL THEN [grunnlag] ELSE [] END |
        CREATE (nyOpptaksVei)-[:BASERT_PÅ]->(g)
      )
      
      WITH opptaksVei, nyOpptaksVei  
      OPTIONAL MATCH (opptaksVei)-[:HAR_REGEL]->(logikk:LogiskNode)
      FOREACH (l IN CASE WHEN logikk IS NOT NULL THEN [logikk] ELSE [] END |
        CREATE (nyOpptaksVei)-[:HAR_REGEL]->(l)
      )
      
      WITH opptaksVei, nyOpptaksVei
      OPTIONAL MATCH (opptaksVei)-[:GIR_TILGANG_TIL]->(kvote:KvoteType)
      FOREACH (k IN CASE WHEN kvote IS NOT NULL THEN [kvote] ELSE [] END |
        CREATE (nyOpptaksVei)-[:GIR_TILGANG_TIL]->(k)
      )
      
      WITH opptaksVei, nyOpptaksVei
      OPTIONAL MATCH (opptaksVei)-[:BRUKER_RANGERING]->(rangering:RangeringType)
      FOREACH (r IN CASE WHEN rangering IS NOT NULL THEN [rangering] ELSE [] END |
        CREATE (nyOpptaksVei)-[:BRUKER_RANGERING]->(r)
      )
      
      // Returner det nye regelsettet
      WITH nytt
      LIMIT 1
      RETURN nytt.id as id
    `,
      {
        regelssettMalId,
        regelssettNavn,
      }
    );

    if (result.records.length === 0) {
      throw new Error('Kunne ikke opprette regelsett fra mal');
    }

    const nyttRegelsettId = result.records[0].get('id');

    // Koble det nye regelsettet til utdanningstilbudet
    await session.run(
      `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})
      MATCH (r:Regelsett {id: $nyttRegelsettId})
      CREATE (u)-[:HAR_REGELSETT]->(r)
    `,
      {
        utdanningstilbudId,
        nyttRegelsettId,
      }
    );

    return nyttRegelsettId;
  } finally {
    await session.close();
  }
}
