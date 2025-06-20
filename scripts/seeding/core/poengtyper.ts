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
      CREATE (karaktersnittVitnemaal:PoengType {
        id: randomUUID(),
        navn: 'karaktersnitt-et-vitnemaal',
        type: 'dokumentbasert',
        beskrivelse: 'Karaktersnitt fra ett vitnemål',
        beregningsmåte: 'Snitt av alle tallkarakterer på ett vitnemål, multiplisert med 10 (0-60 poeng)',
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
        beskrivelse: 'Tilleggspoeng for realfag fra videregående',
        beregningsmåte: 'Kompleks tabell per fag, maks 4 poeng totalt (delt med språkpoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (spraakpoeng:PoengType {
        id: randomUUID(),
        navn: 'språkpoeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for fremmedspråk fra videregående',
        beregningsmåte: 'Nivå I/II: 0,5p, Nivå III: 1p, maks 4 poeng totalt (delt med realfagspoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (folkehogskolePoeng:PoengType {
        id: randomUUID(),
        navn: 'folkehøgskole-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for folkehøgskole',
        beregningsmåte: '2 poeng for godkjent folkehøgskole (33+ uker, 90%+ oppmøte)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (militaertjenestePoeng:PoengType {
        id: randomUUID(),
        navn: 'militærtjeneste-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for militærtjeneste',
        beregningsmåte: '2 poeng for fullført militærtjeneste/befalsskole/FN-tjeneste',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (siviltjenestePoeng:PoengType {
        id: randomUUID(),
        navn: 'siviltjeneste-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for siviltjeneste',
        beregningsmåte: '2 poeng for fullført siviltjeneste',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fagskolePoeng:PoengType {
        id: randomUUID(),
        navn: 'fagskole-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for fagskole',
        beregningsmåte: '30-59 fagskolepoeng: 1p, 60+ fagskolepoeng: 2p',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hoyereUtdanningPoeng:PoengType {
        id: randomUUID(),
        navn: 'høyere-utdanning-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for høyere utdanning',
        beregningsmåte: '30-59 studiepoeng: 1p, 60+ studiepoeng: 2p',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet tilleggspoeng (maks 2 poeng totalt på tvers av alle typer)');

    // ========== AUTOMATISKE POENGTYPER ==========
    await session.run(`
      CREATE (kjonnspoeng:PoengType {
        id: randomUUID(),
        navn: 'kjønnspoeng',
        type: 'automatisk',
        beskrivelse: 'Automatiske kjønnspoeng for spesielle studieprogram',
        beregningsmåte: '1-2 poeng automatisk basert på kjønn og studieprogram',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (alderspoeng:PoengType {
        id: randomUUID(),
        navn: 'alderspoeng',
        type: 'automatisk',
        beskrivelse: 'Automatiske alderspoeng',
        beregningsmåte: '2 poeng/år fra 20 år (ordinær) eller 24 år (23/5), maks 8 poeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // ========== MANUELLE/VURDERTE POENGTYPER ==========
    await session.run(`
      CREATE (opptaksprovePoeng:PoengType {
        id: randomUUID(),
        navn: 'opptaksprøve-poeng',
        type: 'manuell',
        beskrivelse: 'Poeng fra opptaksprøver',
        beregningsmåte: 'Variabel skala avhengig av prøve - kan legges til karakterpoeng eller erstatte dem',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (realkompetansePoeng:PoengType {
        id: randomUUID(),
        navn: 'realkompetansevurderingspoeng',
        type: 'manuell',
        beskrivelse: 'Vurdering av realkompetanse',
        beregningsmåte: 'Saksbehandler setter direkte poengsum 0-60 som erstatning for karakterpoeng',
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

    console.log('\\n💡 Poengbegrensninger:');
    console.log('  📘 Realfags- og språkpoeng: Maks 4 poeng totalt');
    console.log(
      '  📘 Tilleggspoeng (folkehøgskole/militær/sivil/fagskole/høyere): Maks 2 poeng totalt'
    );
    console.log('  📘 Alderspoeng: Maks 8 poeng');
    console.log('  📘 Karaktersnitt: 0-60 poeng');
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
