import { getSession } from '../../../lib/neo4j';

/**
 * Seeder alle standard-komponenter som brukes i OpptaksVeier
 * - Kravelementer (GSK, matematikk, etc.)
 * - Grunnlag (vitnemål, fagbrev, etc.)
 * - Kvotetyper (ordinær, førstegangsvitnemål, etc.)
 * - Rangeringstyper (karaktersnitt, fagbrev, etc.)
 */
export async function seedStandardKomponenter() {
  const session = getSession();

  try {
    // ========== KRAVELEMENTER ==========
    console.log('🎯 Oppretter kravelementer...');

    await session.run(`
      CREATE (krav1:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R1-nivå',
        type: 'matematikk-r1',
        beskrivelse: 'Matematikk på R1-nivå eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav2:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R2-nivå',
        type: 'matematikk-r2',
        beskrivelse: 'Matematikk på R2-nivå for ingeniørstudier',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav3:Kravelement {
        id: randomUUID(),
        navn: 'Generell studiekompetanse',
        type: 'gsk',
        beskrivelse: 'Fullført videregående opplæring med studiekompetanse',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav4:Kravelement {
        id: randomUUID(),
        navn: 'Politiattest',
        type: 'politiattest',
        beskrivelse: 'Gyldig politiattest ikke eldre enn 3 måneder',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav5:Kravelement {
        id: randomUUID(),
        navn: 'Norsk språkkompetanse',
        type: 'norsk-spraak',
        beskrivelse: 'Dokumentert norskferdigheter',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav6:Kravelement {
        id: randomUUID(),
        navn: 'Alder 23 år',
        type: 'alder-23',
        beskrivelse: 'Minimum 23 år fylt i opptaksåret',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav7:Kravelement {
        id: randomUUID(),
        navn: '5 års arbeidserfaring',
        type: 'arbeidserfaring-5',
        beskrivelse: 'Minimum 5 års relevant arbeidserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav8:Kravelement {
        id: randomUUID(),
        navn: 'Alderskrav førstegangsvitnemål',
        type: 'alder-forstegangsvitnemaal',
        beskrivelse: 'Maksimalt 21 år i opptaksåret',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav9:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R1+R2',
        type: 'matematikk-r1r2',
        beskrivelse: 'Matematikk R1 og R2 som samlet krav',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav10:Kravelement {
        id: randomUUID(),
        navn: 'Fysikk 1',
        type: 'fysikk-1',
        beskrivelse: 'Fysikk 1 fra videregående',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav11:Kravelement {
        id: randomUUID(),
        navn: 'Fullført forkurs',
        type: 'forkurs-fullfort',
        beskrivelse: 'Fullført 1-årig forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav12:Kravelement {
        id: randomUUID(),
        navn: 'Norsk karakterkrav 3.0',
        type: 'norsk-karakter-30',
        beskrivelse: 'Minimum karakter 3.0 i norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav13:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk karakterkrav 4.0',
        type: 'matematikk-karakter-40',
        beskrivelse: 'Minimum karakter 4.0 i matematikk',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet kravelementer');

    // ========== GRUNNLAG ==========
    console.log('🏗️ Oppretter grunnlag...');

    await session.run(`
      // Videregående/Gymnasial
      CREATE (grunnlag1:Grunnlag {
        id: randomUUID(),
        navn: 'Førstegangsvitnemål',
        type: 'forstegangsvitnemaal',
        beskrivelse: 'Søker med sitt første vitnemål fra videregående opplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag2:Grunnlag {
        id: randomUUID(),
        navn: 'Ordinært vitnemål',
        type: 'ordinaert-vitnemaal',
        beskrivelse: 'Standard vitnemål fra videregående opplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag3:Grunnlag {
        id: randomUUID(),
        navn: 'Flere vitnemål',
        type: 'flere-vitnemaal',
        beskrivelse: 'Søker med multiple vitnemål (annen poengformel)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag4:Grunnlag {
        id: randomUUID(),
        navn: 'Vitnemål med kompetansebevis',
        type: 'vitnemaal-kompetansebevis',
        beskrivelse: 'Ordinært vitnemål med privatist-forbedringer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag5:Grunnlag {
        id: randomUUID(),
        navn: 'IB (International Baccalaureate)',
        type: 'ib',
        beskrivelse: 'Internasjonal studentereksamen',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Yrkesfag
      CREATE (grunnlag6:Grunnlag {
        id: randomUUID(),
        navn: 'Fagbrev/svennebrev',
        type: 'fagbrev',
        beskrivelse: 'Fullført lærlingtid med fagbrev eller svennebrev',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag7:Grunnlag {
        id: randomUUID(),
        navn: '3-årig yrkesutdanning',
        type: 'yrkesfag-3aar',
        beskrivelse: 'Treårig yrkesfaglig utdanning uten lærlingtid',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag8:Grunnlag {
        id: randomUUID(),
        navn: 'Yrkesfag med påbygg',
        type: 'yrkesfag-pabygg',
        beskrivelse: 'Yrkesfaglig utdanning med påbyggingsår',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Høyere utdanning
      CREATE (grunnlag9:Grunnlag {
        id: randomUUID(),
        navn: 'Bachelorgrad',
        type: 'bachelor',
        beskrivelse: 'Fullført bachelorutdanning (180 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag10:Grunnlag {
        id: randomUUID(),
        navn: 'Mastergrad',
        type: 'master',
        beskrivelse: 'Fullført masterutdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Alternative veier
      CREATE (grunnlag11:Grunnlag {
        id: randomUUID(),
        navn: '23/5-regel',
        type: '23-5-regel',
        beskrivelse: '23 år med 5 års arbeids- eller utdanningserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag12:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse UH',
        type: 'realkompetanse-uh',
        beskrivelse: '25+ år med relevant erfaring for universitet/høgskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag13:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse fagskole',
        type: 'realkompetanse-fagskole',
        beskrivelse: '23+ år med relevant erfaring for fagskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag14:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent fagskole',
        type: 'fagskole-godkjent',
        beskrivelse: 'Fullført fagskoleUtdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag15:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent utenlandsk utdanning',
        type: 'utenlandsk-godkjent',
        beskrivelse: 'Utenlandsk utdanning vurdert som likeverdig',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag16:Grunnlag {
        id: randomUUID(),
        navn: 'Y-veien/ingeniørforberedende',
        type: 'y-veien',
        beskrivelse: 'Spesielle forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet grunnlag');

    // ========== KVOTETYPER ==========
    console.log('📊 Oppretter kvotetyper...');

    await session.run(`
      CREATE (kvote1:KvoteType {
        id: randomUUID(),
        navn: 'Ordinær kvote',
        type: 'ordinaer',
        beskrivelse: 'Hovedkvote for alle kvalifiserte søkere',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote2:KvoteType {
        id: randomUUID(),
        navn: 'Førstegangsvitnemål',
        type: 'forstegangsvitnemaal',
        beskrivelse: 'For søkere under 21 år med nytt vitnemål',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote3:KvoteType {
        id: randomUUID(),
        navn: 'Forkurskvote',
        type: 'forkurs',
        beskrivelse: 'For søkere med fullført forkurs ingeniør',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet kvotetyper');

    // ========== RANGERINGSTYPER ==========
    console.log('📈 Oppretter rangeringstyper...');

    await session.run(`
      CREATE (rangering1:RangeringType {
        id: randomUUID(),
        navn: 'Karaktersnitt + realfagspoeng',
        type: 'karaktersnitt-realfag',
        formelMal: 'karaktersnitt + (realfagspoeng * vektfaktor)',
        beskrivelse: 'Standard rangering med tilleggspoeng for realfag',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (rangering2:RangeringType {
        id: randomUUID(),
        navn: 'Fagbrev + realfagskarakterer',
        type: 'fagbrev-realfag',
        formelMal: 'fagbrevkarakter * 0.4 + realfagssnitt * 0.6',
        beskrivelse: 'Vekting av fagbrev og realfagskarakterer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (rangering3:RangeringType {
        id: randomUUID(),
        navn: 'Karaktersnitt ren',
        type: 'karaktersnitt',
        formelMal: 'sum(karakterer) / antall_fag',
        beskrivelse: 'Bare karaktersnitt uten tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (rangering4:RangeringType {
        id: randomUUID(),
        navn: 'Arbeidserfaring + fagkompetanse',
        type: 'erfaring-fagkompetanse',
        formelMal: 'arbeidserfaring_poeng + fagkompetanse_vurdering',
        beskrivelse: 'For realkompetansesøkere',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (rangering5:RangeringType {
        id: randomUUID(),
        navn: 'Forkurskarakterer',
        type: 'forkurs',
        formelMal: 'sum(forkurs_karakterer) / antall_fag',
        beskrivelse: 'Rangering basert på forkursresultater',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (rangering6:RangeringType {
        id: randomUUID(),
        navn: 'Opptaksprøve + karakterer',
        type: 'opptak-karakterer',
        formelMal: 'opptaksprove_poeng * 0.5 + karaktersnitt * 0.5',
        beskrivelse: 'Kombinert vurdering av opptaksprøve og karakterer',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet rangeringstyper');

    // Return summary
    const result = await session.run(`
      MATCH (k:Kravelement)
      MATCH (g:Grunnlag)
      MATCH (kv:KvoteType)
      MATCH (rt:RangeringType)
      RETURN 
        count(DISTINCT k) as kravelementer,
        count(DISTINCT g) as grunnlag,
        count(DISTINCT kv) as kvotetyper,
        count(DISTINCT rt) as rangeringstyper
    `);

    const counts = result.records[0];
    console.log('\n📊 Standard-komponenter opprettet:');
    console.log(`  Kravelementer: ${counts.get('kravelementer').toNumber()}`);
    console.log(`  Grunnlag: ${counts.get('grunnlag').toNumber()}`);
    console.log(`  Kvotetyper: ${counts.get('kvotetyper').toNumber()}`);
    console.log(`  Rangeringstyper: ${counts.get('rangeringstyper').toNumber()}`);
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle standard-komponenter
 */
export async function clearStandardKomponenter() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Kravelement) DETACH DELETE n`);
    await session.run(`MATCH (n:Grunnlag) DETACH DELETE n`);
    await session.run(`MATCH (n:KvoteType) DETACH DELETE n`);
    await session.run(`MATCH (n:RangeringType) DETACH DELETE n`);
    console.log('🗑️ Slettet standard-komponenter');
  } finally {
    await session.close();
  }
}
