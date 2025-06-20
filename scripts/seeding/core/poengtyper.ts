import { getSession } from '../../../lib/neo4j';

/**
 * Seeder standard poengtypene som brukes i rangeringsformler
 * Poengtypene brukes for å beregne score for søkere på ulike opptaksveier
 */
export async function seedPoengtyper() {
  const session = getSession();

  try {
    console.log('📊 Oppretter poengtypene...');

    // ========== DOKUMENTBASERTE POENGTYPER ==========
    await session.run(`
      CREATE (vitnemaalKaraktersnitt:PoengType {
        id: randomUUID(),
        navn: 'karaktersnitt-vitnemaal',
        type: 'dokumentbasert',
        beskrivelse: 'Karaktersnitt fra vitnemål (snitt av alle karakterer)',
        beregningsmåte: 'Snitt av alle tallkarakterer på vitnemål, multiplisert med 10',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fagbrevKarakter:PoengType {
        id: randomUUID(),
        navn: 'fagbrev-karakter',
        type: 'dokumentbasert',
        beskrivelse: 'Karakter fra fagbrev/svennebrev',
        beregningsmåte: 'Fagbrevkarakter multiplisert med 10',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (forkursKaraktersnitt:PoengType {
        id: randomUUID(),
        navn: 'karaktersnitt-forkurs',
        type: 'dokumentbasert',
        beskrivelse: 'Karaktersnitt fra forkurs',
        beregningsmåte: 'Snitt av alle karakterer fra forkurs, multiplisert med 10',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (realfagssnitt:PoengType {
        id: randomUUID(),
        navn: 'realfagssnitt',
        type: 'dokumentbasert',
        beskrivelse: 'Karaktersnitt for realfag',
        beregningsmåte: 'Snitt av karakterer i fysikk, kjemi, biologi, IT, multiplisert med 10',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // ========== TILLEGGSPOENG ==========
    await session.run(`
      CREATE (realfagspoeng:PoengType {
        id: randomUUID(),
        navn: 'realfagspoeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for realfag utover minstekrav',
        beregningsmåte: 'Antall realfag utover minstekrav * 2.0 poeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (toppidrettspoeng:PoengType {
        id: randomUUID(),
        navn: 'toppidretts-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for toppidrett',
        beregningsmåte: 'Fast 1.5 poeng for dokumentert toppidrett',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (alderspoeng:PoengType {
        id: randomUUID(),
        navn: 'alders-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for alder',
        beregningsmåte: 'Antall år over 21 * 0.1 poeng, maks 2.0 poeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // ========== MANUELLE/VURDERTE POENGTYPER ==========
    await session.run(`
      CREATE (arbeidserfaring:PoengType {
        id: randomUUID(),
        navn: 'arbeidserfaring-poeng',
        type: 'manuell',
        beskrivelse: 'Poeng for relevant arbeidserfaring',
        beregningsmåte: 'Manuell vurdering av arbeidserfaring, 0-50 poeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fagkompetanse:PoengType {
        id: randomUUID(),
        navn: 'fagkompetanse-vurdering',
        type: 'manuell',
        beskrivelse: 'Vurdering av fagkompetanse',
        beregningsmåte: 'Manuell vurdering av fagkompetanse, 0-50 poeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (opptaksprove:PoengType {
        id: randomUUID(),
        navn: 'opptaksprove-poeng',
        type: 'manuell',
        beskrivelse: 'Resultat fra opptaksprøve',
        beregningsmåte: 'Poengsum fra opptaksprøve, normalt 0-100 poeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    console.log('✅ Opprettet poengtypene');

    // Return summary
    const result = await session.run(`
      MATCH (pt:PoengType)
      RETURN pt.type as kategori, count(pt) as antall, collect(pt.navn) as navn
      ORDER BY pt.type
    `);

    console.log('\\n📊 Poengtypene opprettet:');
    result.records.forEach((record) => {
      const kategori = record.get('kategori');
      const antall = record.get('antall').toNumber();
      const navn = record.get('navn');
      console.log(`  ${kategori}: ${antall} typer`);
      navn.forEach((poengNavn: string) => {
        console.log(`    - ${poengNavn}`);
      });
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle poengtypene
 */
export async function clearPoengtyper() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:PoengType) DETACH DELETE n`);
    await session.run(`MATCH (n:PoengBeregning) DETACH DELETE n`);
    console.log('🗑️ Slettet poengtypene og poengberegninger');
  } finally {
    await session.close();
  }
}
