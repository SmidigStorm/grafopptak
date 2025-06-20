import { getSession } from '../lib/neo4j';

/**
 * VIKTIG: ALL SEEDING SKAL SKJE I DENNE FILEN
 *
 * Grunner for monolitisk struktur:
 * 1. Enklere å holde oversikt over rekkefølge og avhengigheter
 * 2. Lettere å se sammenhenger mellom entiteter
 * 3. Færre filer å holde styr på
 * 4. Avhengigheter mellom entiteter er lettere å håndtere
 *
 * Rekkefølge er viktig:
 * 1. Fagkoder og faggrupper (grunnleggende referansedata)
 * 2. Kravelementer, grunnlag, kvotetyper (regelkomponenter)
 * 3. PoengTyper (må finnes før RangeringType)
 * 4. RangeringTyper med relasjoner til PoengTyper
 * 5. Institusjoner og utdanningstilbud
 * 6. Regelsett og opptaksveier
 * 7. Personer og dokumentasjon (testdata)
 */

export async function seedAll() {
  const session = getSession();

  try {
    console.log('🌱 Starter full seeding av databasen...');

    // ========== FAGKODER OG FAGGRUPPER ==========
    console.log('📁 Oppretter faggrupper...');

    await session.run(`
      CREATE (fg1:Faggruppe {
        id: randomUUID(),
        navn: 'Matematikk R1-nivå',
        type: 'matematikk-r1',
        beskrivelse: 'Matematikk R1 programfag som kvalifiserer for realfagspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fg2:Faggruppe {
        id: randomUUID(),
        navn: 'Matematikk R2-nivå',
        type: 'matematikk-r2',
        beskrivelse: 'Matematikk R2 programfag som kvalifiserer for realfagspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fg3:Faggruppe {
        id: randomUUID(),
        navn: 'Norsk 393 timer',
        type: 'norsk-393',
        beskrivelse: 'Norsk hovedmål eller sidemål med 393 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fg4:Faggruppe {
        id: randomUUID(),
        navn: 'Realfag valgfritt',
        type: 'realfag-valgfritt',
        beskrivelse: 'Realfag som kan gi tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet faggrupper');

    console.log('📋 Oppretter fagkoder...');

    await session.run(`
      // Matematikk R1
      CREATE (fk1:Fagkode {
        id: randomUUID(),
        kode: 'MAT1001',
        navn: 'Matematikk R1',
        type: 'matematikk',
        omfang: 'R1-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk2:Fagkode {
        id: randomUUID(),
        kode: 'REA3022',
        navn: 'Matematikk S1',
        type: 'matematikk',
        omfang: 'S1-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk3:Fagkode {
        id: randomUUID(),
        kode: 'REA3024',
        navn: 'Matematikk S2',
        type: 'matematikk',
        omfang: 'S2-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk4:Fagkode {
        id: randomUUID(),
        kode: 'REA3026',
        navn: 'Matematikk R1',
        type: 'matematikk',
        omfang: 'R1-nivå',
        aktiv: true,
        opprettet: datetime()
      })

      // Matematikk R2
      CREATE (fk5:Fagkode {
        id: randomUUID(),
        kode: 'MAT1002',
        navn: 'Matematikk R2',
        type: 'matematikk',
        omfang: 'R2-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk6:Fagkode {
        id: randomUUID(),
        kode: 'REA3028',
        navn: 'Matematikk R2',
        type: 'matematikk',
        omfang: 'R2-nivå',
        aktiv: true,
        opprettet: datetime()
      })

      // Norsk
      CREATE (fk7:Fagkode {
        id: randomUUID(),
        kode: 'NOR1211',
        navn: 'Norsk hovedmål',
        type: 'norsk',
        omfang: '393 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk8:Fagkode {
        id: randomUUID(),
        kode: 'NOR1212',
        navn: 'Norsk sidemål',
        type: 'norsk',
        omfang: '393 timer',
        aktiv: true,
        opprettet: datetime()
      })

      // Realfag
      CREATE (fk9:Fagkode {
        id: randomUUID(),
        kode: 'FYS1001',
        navn: 'Fysikk 1',
        type: 'fysikk',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk10:Fagkode {
        id: randomUUID(),
        kode: 'FYS1002',
        navn: 'Fysikk 2',
        type: 'fysikk',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk11:Fagkode {
        id: randomUUID(),
        kode: 'KJE1001',
        navn: 'Kjemi 1',
        type: 'kjemi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk12:Fagkode {
        id: randomUUID(),
        kode: 'KJE1002',
        navn: 'Kjemi 2',
        type: 'kjemi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk13:Fagkode {
        id: randomUUID(),
        kode: 'BIO1001',
        navn: 'Biologi 1',
        type: 'biologi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk14:Fagkode {
        id: randomUUID(),
        kode: 'BIO1002',
        navn: 'Biologi 2',
        type: 'biologi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk15:Fagkode {
        id: randomUUID(),
        kode: 'GEO1001',
        navn: 'Geofag 1',
        type: 'geofag',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet fagkoder');

    console.log('🔗 Kobler fagkoder til faggrupper...');

    await session.run(`
      MATCH (fg1:Faggruppe {type: 'matematikk-r1'})
      MATCH (fg2:Faggruppe {type: 'matematikk-r2'})
      MATCH (fg3:Faggruppe {type: 'norsk-393'})
      MATCH (fg4:Faggruppe {type: 'realfag-valgfritt'})

      MATCH (fk1:Fagkode {kode: 'MAT1001'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})
      MATCH (fk3:Fagkode {kode: 'REA3024'})
      MATCH (fk4:Fagkode {kode: 'REA3026'})
      MATCH (fk5:Fagkode {kode: 'MAT1002'})
      MATCH (fk6:Fagkode {kode: 'REA3028'})
      MATCH (fk7:Fagkode {kode: 'NOR1211'})
      MATCH (fk8:Fagkode {kode: 'NOR1212'})
      MATCH (fk9:Fagkode {kode: 'FYS1001'})
      MATCH (fk10:Fagkode {kode: 'FYS1002'})
      MATCH (fk11:Fagkode {kode: 'KJE1001'})
      MATCH (fk12:Fagkode {kode: 'KJE1002'})
      MATCH (fk13:Fagkode {kode: 'BIO1001'})
      MATCH (fk14:Fagkode {kode: 'BIO1002'})
      MATCH (fk15:Fagkode {kode: 'GEO1001'})

      // Matematikk R1
      CREATE (fk1)-[:KVALIFISERER_FOR]->(fg1)
      CREATE (fk2)-[:KVALIFISERER_FOR]->(fg1)
      CREATE (fk3)-[:KVALIFISERER_FOR]->(fg1)
      CREATE (fk4)-[:KVALIFISERER_FOR]->(fg1)

      // Matematikk R2
      CREATE (fk5)-[:KVALIFISERER_FOR]->(fg2)
      CREATE (fk6)-[:KVALIFISERER_FOR]->(fg2)

      // Norsk 393
      CREATE (fk7)-[:KVALIFISERER_FOR]->(fg3)
      CREATE (fk8)-[:KVALIFISERER_FOR]->(fg3)

      // Realfag valgfritt
      CREATE (fk9)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk10)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk11)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk12)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk13)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk14)-[:KVALIFISERER_FOR]->(fg4)
      CREATE (fk15)-[:KVALIFISERER_FOR]->(fg4)
    `);
    console.log('✅ Koblet fagkoder til faggrupper');

    // ========== KRAVELEMENTER ==========
    console.log('🎯 Oppretter kravelementer...');

    await session.run(`
      CREATE (krav1:Kravelement {
        id: randomUUID(),
        navn: 'Generell studiekompetanse',
        type: 'generell-studiekompetanse',
        beskrivelse: 'Fullført og bestått generell studiekompetanse',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav2:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Matematikk R1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav3:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R2',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Matematikk R2 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav4:Kravelement {
        id: randomUUID(),
        navn: 'Fysikk 1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Fysikk 1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav5:Kravelement {
        id: randomUUID(),
        navn: 'Kjemi 1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Kjemi 1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav6:Kravelement {
        id: randomUUID(),
        navn: 'Norsk 393 timer',
        type: 'sprakkunnskaper',
        beskrivelse: 'Norsk hovedmål eller sidemål, minimum 393 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav7:Kravelement {
        id: randomUUID(),
        navn: 'Arbeidserfaring 5 år',
        type: 'arbeidserfaring',
        beskrivelse: '5 års relevant arbeids- eller utdanningserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav8:Kravelement {
        id: randomUUID(),
        navn: 'Fagbrev',
        type: 'fagkompetanse',
        beskrivelse: 'Fagbrev eller svennebrev i relevant fag',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav9:Kravelement {
        id: randomUUID(),
        navn: 'Politiattest',
        type: 'vandel',
        beskrivelse: 'Politiattest uten anmerkninger',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav10:Kravelement {
        id: randomUUID(),
        navn: 'Helseattest',
        type: 'helse',
        beskrivelse: 'Helseattest som bekrefter skikkethet',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav11:Kravelement {
        id: randomUUID(),
        navn: 'Forkurs ingeniør',
        type: 'spesiell-kompetanse',
        beskrivelse: 'Fullført og bestått forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav12:Kravelement {
        id: randomUUID(),
        navn: 'Bachelorgrad',
        type: 'hoyere-utdanning',
        beskrivelse: 'Fullført bachelorgrad fra akkreditert institusjon',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav13:Kravelement {
        id: randomUUID(),
        navn: 'Praksiserfaring helse',
        type: 'praksis',
        beskrivelse: 'Minimum 6 måneder praksis i helsesektoren',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet kravelementer');

    // ========== GRUNNLAG ==========
    console.log('🏗️ Oppretter grunnlag...');

    await session.run(`
      CREATE (grunnlag1:Grunnlag {
        id: randomUUID(),
        navn: 'Vitnemål videregående',
        type: 'vitnemaal-vgs',
        beskrivelse: 'Vitnemål fra videregående opplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag2:Grunnlag {
        id: randomUUID(),
        navn: 'Fagbrev/svennebrev',
        type: 'fagbrev',
        beskrivelse: 'Fagbrev eller svennebrev fra fag- og yrkesopplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag3:Grunnlag {
        id: randomUUID(),
        navn: 'Privatisteksamen',
        type: 'privatist',
        beskrivelse: 'Vitnemål fra privatisteksamen',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag4:Grunnlag {
        id: randomUUID(),
        navn: 'IB Diploma',
        type: 'ib-diploma',
        beskrivelse: 'International Baccalaureate Diploma',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag5:Grunnlag {
        id: randomUUID(),
        navn: 'Forkurs ingeniør',
        type: 'forkurs-ingenior',
        beskrivelse: 'Fullført forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag6:Grunnlag {
        id: randomUUID(),
        navn: 'Gymnaseksamen før 1994',
        type: 'gammel-gymnaseksamen',
        beskrivelse: 'Artium, examen artium eller gymnaseksamen før 1994',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag7:Grunnlag {
        id: randomUUID(),
        navn: 'Folkehøgskole',
        type: 'folkehogskole',
        beskrivelse: 'Vitnemål fra folkehøgskole (33+ uker)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag8:Grunnlag {
        id: randomUUID(),
        navn: 'Høyere utdanning',
        type: 'hoyere-utdanning',
        beskrivelse: 'Utdanning fra universitet eller høgskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag9:Grunnlag {
        id: randomUUID(),
        navn: 'Fagskole',
        type: 'fagskole',
        beskrivelse: 'Vitnemål fra fagskoleutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag10:Grunnlag {
        id: randomUUID(),
        navn: 'Bachelorgrad',
        type: 'bachelor',
        beskrivelse: 'Fullført bachelorutdanning (180 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag11:Grunnlag {
        id: randomUUID(),
        navn: 'Mastergrad',
        type: 'master',
        beskrivelse: 'Fullført masterutdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag12:Grunnlag {
        id: randomUUID(),
        navn: '23/5-regel',
        type: '23-5-regel',
        beskrivelse: '23 år med 5 års arbeids- eller utdanningserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag13:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse UH',
        type: 'realkompetanse-uh',
        beskrivelse: '25+ år med relevant erfaring for universitet/høgskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag14:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse fagskole',
        type: 'realkompetanse-fagskole',
        beskrivelse: '23+ år med relevant erfaring for fagskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag15:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent fagskole',
        type: 'fagskole-godkjent',
        beskrivelse: 'Fullført fagskoleutdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag16:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent utenlandsk utdanning',
        type: 'utenlandsk-godkjent',
        beskrivelse: 'Utenlandsk utdanning vurdert som likeverdig',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag17:Grunnlag {
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

    // ========== POENGTYPER ==========
    console.log('📊 Oppretter poengtypene...');

    // Dokumentbaserte poengtyper
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

    // Tilleggspoeng
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

    // Automatiske poengtyper
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

    // Manuelle/vurderte poengtyper
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

    // ========== RANGERINGSTYPER MED RELASJONER ==========
    console.log('📈 Oppretter rangeringstyper...');

    await session.run(`
      // Opprett rangeringstyper
      CREATE (skolepoeng:RangeringType {
        id: randomUUID(),
        navn: 'Skolepoeng',
        type: 'skolepoeng',
        formelMal: 'karakterpoeng + realfagspoeng + språkpoeng + kjønnspoeng + opptaksprøvepoeng',
        beskrivelse: 'Grunnleggende skolepoeng uten alderspoeng og andre tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (konkurransepoeng:RangeringType {
        id: randomUUID(),
        navn: 'Konkurransepoeng',
        type: 'konkurransepoeng',
        formelMal: 'karakterpoeng + realfagspoeng + språkpoeng + kjønnspoeng + opptaksprøvepoeng + tilleggspoeng + alderspoeng',
        beskrivelse: 'Full poengberegning med alle tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (realkompetanse:RangeringType {
        id: randomUUID(),
        navn: 'Realkompetanse',
        type: 'realkompetanse',
        formelMal: 'realkompetansevurderingspoeng',
        beskrivelse: 'Rangering basert kun på realkompetansevurdering',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Hent poengtyper for relasjoner
      WITH skolepoeng, konkurransepoeng, realkompetanse
      MATCH (karaktersnitt:PoengType {navn: 'karaktersnitt-et-vitnemaal'})
      MATCH (realfag:PoengType {navn: 'realfagspoeng'})
      MATCH (spraak:PoengType {navn: 'språkpoeng'})
      MATCH (kjonn:PoengType {navn: 'kjønnspoeng'})
      MATCH (opptaksprove:PoengType {navn: 'opptaksprøve-poeng'})
      MATCH (folkehogskole:PoengType {navn: 'folkehøgskole-poeng'})
      MATCH (militar:PoengType {navn: 'militærtjeneste-poeng'})
      MATCH (sivil:PoengType {navn: 'siviltjeneste-poeng'})
      MATCH (fagskole:PoengType {navn: 'fagskole-poeng'})
      MATCH (hoyere:PoengType {navn: 'høyere-utdanning-poeng'})
      MATCH (alder:PoengType {navn: 'alderspoeng'})
      MATCH (realkompetansePoeng:PoengType {navn: 'realkompetansevurderingspoeng'})
      
      // Skolepoeng relasjoner
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(karaktersnitt)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(realfag)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(spraak)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(kjonn)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(opptaksprove)
      
      // Konkurransepoeng relasjoner (alle fra skolepoeng + tilleggspoeng + alderspoeng)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(karaktersnitt)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(realfag)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(spraak)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(kjonn)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(opptaksprove)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(folkehogskole)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(militar)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(sivil)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(fagskole)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(hoyere)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(alder)
      
      // Realkompetanse relasjoner (kun realkompetansevurdering)
      CREATE (realkompetanse)-[:INKLUDERER_POENGTYPE]->(realkompetansePoeng)
    `);
    console.log('✅ Opprettet rangeringstyper med poengtype-relasjoner');

    // ========== INSTITUSJONER ==========
    console.log('🏢 Oppretter institusjoner...');

    await session.run(`
      CREATE (uio:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Oslo',
        kortnavn: 'UiO',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnu:Institusjon {
        id: randomUUID(),
        navn: 'Norges teknisk-naturvitenskapelige universitet',
        kortnavn: 'NTNU',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Trondheim',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uib:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Bergen',
        kortnavn: 'UiB',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Bergen',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uis:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Stavanger',
        kortnavn: 'UiS',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Stavanger',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uit:Institusjon {
        id: randomUUID(),
        navn: 'UiT Norges arktiske universitet',
        kortnavn: 'UiT',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Tromsø',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uia:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Agder',
        kortnavn: 'UiA',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Kristiansand',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (oslomet:Institusjon {
        id: randomUUID(),
        navn: 'OsloMet - storbyuniversitetet',
        kortnavn: 'OsloMet',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hvl:Institusjon {
        id: randomUUID(),
        navn: 'Høgskulen på Vestlandet',
        kortnavn: 'HVL',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Bergen',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hinn:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Innlandet',
        kortnavn: 'HiNN',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Lillehammer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (himolde:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Molde',
        kortnavn: 'HiMolde',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Molde',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (bi:Institusjon {
        id: randomUUID(),
        navn: 'BI Norges Handelshøyskole',
        kortnavn: 'BI',
        type: 'høgskole',
        eier: 'privat',
        sted: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kristiania:Institusjon {
        id: randomUUID(),
        navn: 'Høyskolen Kristiania',
        kortnavn: 'Kristiania',
        type: 'høgskole',
        eier: 'privat',
        sted: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet institusjoner');

    // ========== UTDANNINGSTILBUD ==========
    console.log('🎓 Oppretter utdanningstilbud...');

    await session.run(`
      MATCH (uio:Institusjon {kortnavn: 'UiO'})
      MATCH (ntnu:Institusjon {kortnavn: 'NTNU'})
      MATCH (oslomet:Institusjon {kortnavn: 'OsloMet'})
      MATCH (kristiania:Institusjon {kortnavn: 'Kristiania'})

      CREATE (uio)-[:TILBYR]->(informatikk:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Informatikk: programmering og systemarkitektur',
        kortnavn: 'Informatikk',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (ntnu)-[:TILBYR]->(bygg:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Bygg- og miljøteknikk',
        kortnavn: 'Bygg- og miljøteknikk',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Trondheim',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (oslomet)-[:TILBYR]->(larerutdanning:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Grunnskolelærerutdanning 1-7',
        kortnavn: 'Lærerutdanning 1-7',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (kristiania)-[:TILBYR]->(markedsforing:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Markedsføring og salgsledelse',
        kortnavn: 'Markedsføring',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet utdanningstilbud');

    // ========== PERSONER (TESTDATA) ==========
    console.log('👥 Oppretter søkere...');

    await session.run(`
      CREATE (anna:Person {
        id: randomUUID(),
        fornavn: 'Anna',
        etternavn: 'Hansen',
        fodselsdato: date('2005-03-15'),
        kjonn: 'kvinne',
        telefon: '12345678',
        epost: 'anna.hansen@example.com',
        adresse: 'Storgata 1, 0001 Oslo',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (erik:Person {
        id: randomUUID(),
        fornavn: 'Erik',
        etternavn: 'Johnsen',
        fodselsdato: date('2004-08-22'),
        kjonn: 'mann',
        telefon: '23456789',
        epost: 'erik.johnsen@example.com',
        adresse: 'Parkveien 10, 7030 Trondheim',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (maria:Person {
        id: randomUUID(),
        fornavn: 'Maria',
        etternavn: 'Andersen',
        fodselsdato: date('1995-12-03'),
        kjonn: 'kvinne',
        telefon: '34567890',
        epost: 'maria.andersen@example.com',
        adresse: 'Torgallmenningen 2, 5020 Bergen',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (lars:Person {
        id: randomUUID(),
        fornavn: 'Lars',
        etternavn: 'Olsen',
        fodselsdato: date('2003-06-10'),
        kjonn: 'mann',
        telefon: '45678901',
        epost: 'lars.olsen@example.com',
        adresse: 'Kvadraturen 5, 4612 Kristiansand',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (sophie:Person {
        id: randomUUID(),
        fornavn: 'Sophie',
        etternavn: 'Müller',
        fodselsdato: date('2005-11-18'),
        kjonn: 'kvinne',
        telefon: '56789012',
        epost: 'sophie.muller@example.com',
        adresse: 'Hansastraße 15, 20354 Hamburg',
        statsborgerskap: 'tysk',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet søkere');

    // ========== DOKUMENTASJON OG KARAKTERER ==========
    console.log('📄 Oppretter dokumentasjon og karakterdata...');

    await session.run(`
      MATCH (anna:Person {fornavn: 'Anna'})
      MATCH (erik:Person {fornavn: 'Erik'})
      MATCH (maria:Person {fornavn: 'Maria'})
      MATCH (lars:Person {fornavn: 'Lars'})
      MATCH (sophie:Person {fornavn: 'Sophie'})

      // Anna - vitnemål
      CREATE (anna)-[:HAR_DOKUMENTASJON]->(annaVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2023-06-15'),
        utsteder: 'Oslo katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Erik - vitnemål  
      CREATE (erik)-[:HAR_DOKUMENTASJON]->(erikVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2022-06-20'),
        utsteder: 'Trondheim katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Maria - fagbrev og karakterutskrift
      CREATE (maria)-[:HAR_DOKUMENTASJON]->(mariaFagbrev:Dokumentasjon {
        id: randomUUID(),
        type: 'fagbrev',
        navn: 'Fagbrev IKT-servicefag',
        utstedt: date('2016-08-15'),
        utsteder: 'Bergen tekniske fagskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (maria)-[:HAR_DOKUMENTASJON]->(mariaKarakter:Dokumentasjon {
        id: randomUUID(),
        type: 'karakterutskrift',
        navn: 'Karakterutskrift påbygging',
        utstedt: date('2017-06-10'),
        utsteder: 'Bergen voksenopplæring',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Lars - vitnemål
      CREATE (lars)-[:HAR_DOKUMENTASJON]->(larsVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2021-06-18'),
        utsteder: 'Kristiansand katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Sophie - IB Diploma
      CREATE (sophie)-[:HAR_DOKUMENTASJON]->(sophieIB:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'IB Diploma Programme',
        utstedt: date('2023-07-05'),
        utsteder: 'International School Hamburg',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Karakterer for Anna
      WITH annaVitnemaal
      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})
      MATCH (fk3:Fagkode {kode: 'REA3024'})
      MATCH (fk4:Fagkode {kode: 'REA3026'})
      MATCH (fk5:Fagkode {kode: 'FYS1001'})
      MATCH (fk6:Fagkode {kode: 'KJE1001'})
      MATCH (fk7:Fagkode {kode: 'BIO1001'})

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar1:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        opprettet: datetime()
      })
      CREATE (kar1)-[:GITT_I]->(fk1)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar2:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-20'),
        opprettet: datetime()
      })
      CREATE (kar2)-[:GITT_I]->(fk2)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar3:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-20'),
        opprettet: datetime()
      })
      CREATE (kar3)-[:GITT_I]->(fk3)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar4:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-25'),
        opprettet: datetime()
      })
      CREATE (kar4)-[:GITT_I]->(fk4)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar5:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-30'),
        opprettet: datetime()
      })
      CREATE (kar5)-[:GITT_I]->(fk5)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar6:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-06-05'),
        opprettet: datetime()
      })
      CREATE (kar6)-[:GITT_I]->(fk6)

      CREATE (annaVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar7:Karakter {
        id: randomUUID(),
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        opprettet: datetime()
      })
      CREATE (kar7)-[:GITT_I]->(fk7)
    `);

    await session.run(`
      // Karakterer for Erik
      MATCH (erik:Person {fornavn: 'Erik'})
      MATCH (erikVitnemaal:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(erik)
      WHERE erikVitnemaal.type = 'vitnemaal'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})
      MATCH (fk3:Fagkode {kode: 'REA3024'})
      MATCH (fk4:Fagkode {kode: 'REA3026'})
      MATCH (fk5:Fagkode {kode: 'FYS1001'})
      MATCH (fk6:Fagkode {kode: 'FYS1002'})
      MATCH (fk7:Fagkode {kode: 'KJE1001'})

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar8:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2022-05-15'),
        opprettet: datetime()
      })
      CREATE (kar8)-[:GITT_I]->(fk1)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar9:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-05-20'),
        kommentar: 'Forbedret fra 3',
        opprettet: datetime()
      })
      CREATE (kar9)-[:GITT_I]->(fk2)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar10:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2022-05-20'),
        kommentar: 'Forbedret fra 3',
        opprettet: datetime()
      })
      CREATE (kar10)-[:GITT_I]->(fk3)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar11:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-05-25'),
        opprettet: datetime()
      })
      CREATE (kar11)-[:GITT_I]->(fk4)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar12:Karakter {
        id: randomUUID(),
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2022-05-30'),
        opprettet: datetime()
      })
      CREATE (kar12)-[:GITT_I]->(fk5)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar13:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-06-05'),
        opprettet: datetime()
      })
      CREATE (kar13)-[:GITT_I]->(fk6)

      CREATE (erikVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar14:Karakter {
        id: randomUUID(),
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2022-06-10'),
        opprettet: datetime()
      })
      CREATE (kar14)-[:GITT_I]->(fk7)
    `);

    await session.run(`
      // Karakterer for Maria (fagbrev)
      MATCH (maria:Person {fornavn: 'Maria'})
      MATCH (mariaFagbrev:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(maria)
      WHERE mariaFagbrev.type = 'fagbrev'
      MATCH (mariaKarakter:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(maria)
      WHERE mariaKarakter.type = 'karakterutskrift'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})

      CREATE (mariaFagbrev)-[:INNEHOLDER_KARAKTER]->(kar15:Karakter {
        id: randomUUID(),
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2016-06-15'),
        opprettet: datetime()
      })
      CREATE (kar15)-[:GITT_I]->(fk1)

      CREATE (mariaKarakter)-[:INNEHOLDER_KARAKTER]->(kar16:Karakter {
        id: randomUUID(),
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2017-05-20'),
        opprettet: datetime()
      })
      CREATE (kar16)-[:GITT_I]->(fk2)
    `);

    await session.run(`
      // Karakterer for Lars
      MATCH (lars:Person {fornavn: 'Lars'})
      MATCH (larsVitnemaal:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(lars)
      WHERE larsVitnemaal.type = 'vitnemaal'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})

      CREATE (larsVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar17:Karakter {
        id: randomUUID(),
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2021-05-15'),
        opprettet: datetime()
      })
      CREATE (kar17)-[:GITT_I]->(fk1)

      CREATE (larsVitnemaal)-[:INNEHOLDER_KARAKTER]->(kar18:Karakter {
        id: randomUUID(),
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2021-05-20'),
        opprettet: datetime()
      })
      CREATE (kar18)-[:GITT_I]->(fk2)
    `);

    console.log('✅ Opprettet dokumentasjon og karakterdata');

    console.log('✅ Fullført seeding av alle data!');

    // ========== SAMMENDRAG ==========
    console.log('\\n📊 Sammendrag av seeded data:');

    const summary = await session.run(`
      MATCH (fg:Faggruppe) OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg)
      WITH count(DISTINCT fg) as faggrupper, count(DISTINCT fk) as fagkoder
      MATCH (k:Kravelement) 
      MATCH (g:Grunnlag)
      MATCH (kv:KvoteType)
      MATCH (rt:RangeringType)
      MATCH (pt:PoengType)
      MATCH (i:Institusjon)
      MATCH (u:Utdanningstilbud)
      MATCH (p:Person)
      MATCH (d:Dokumentasjon)
      MATCH (kar:Karakter)
      RETURN 
        faggrupper, fagkoder,
        count(DISTINCT k) as kravelementer,
        count(DISTINCT g) as grunnlag,
        count(DISTINCT kv) as kvotetyper,
        count(DISTINCT rt) as rangeringstyper,
        count(DISTINCT pt) as poengtyper,
        count(DISTINCT i) as institusjoner,
        count(DISTINCT u) as utdanningstilbud,
        count(DISTINCT p) as personer,
        count(DISTINCT d) as dokumenter,
        count(DISTINCT kar) as karakterer
    `);

    const stats = summary.records[0];
    console.log(`   📁 Faggrupper: ${stats.get('faggrupper').toNumber()}`);
    console.log(`   📋 Fagkoder: ${stats.get('fagkoder').toNumber()}`);
    console.log(`   🎯 Kravelementer: ${stats.get('kravelementer').toNumber()}`);
    console.log(`   🏗️ Grunnlag: ${stats.get('grunnlag').toNumber()}`);
    console.log(`   📊 Kvotetyper: ${stats.get('kvotetyper').toNumber()}`);
    console.log(`   📈 Rangeringstyper: ${stats.get('rangeringstyper').toNumber()}`);
    console.log(`   📊 PoengTyper: ${stats.get('poengtyper').toNumber()}`);
    console.log(`   🏢 Institusjoner: ${stats.get('institusjoner').toNumber()}`);
    console.log(`   🎓 Utdanningstilbud: ${stats.get('utdanningstilbud').toNumber()}`);
    console.log(`   👥 Personer: ${stats.get('personer').toNumber()}`);
    console.log(`   📄 Dokumenter: ${stats.get('dokumenter').toNumber()}`);
    console.log(`   ⭐ Karakterer: ${stats.get('karakterer').toNumber()}`);

    // Verifiser RangeringType-relasjoner
    const rangeringCheck = await session.run(`
      MATCH (rt:RangeringType)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt.navn as rangeringstype, collect(pt.navn) as poengtyper
      ORDER BY rt.navn
    `);

    console.log('\\n📈 RangeringType PoengType-relasjoner:');
    rangeringCheck.records.forEach((record) => {
      const rtNavn = record.get('rangeringstype');
      const ptNavn = record.get('poengtyper');
      console.log(`   ${rtNavn}: ${ptNavn.length} poengtyper`);
      ptNavn.forEach((pt: string) => {
        console.log(`     - ${pt}`);
      });
    });

    console.log('\\n🎉 Seeding fullført!');
  } finally {
    await session.close();
  }
}

/**
 * Fjerner all data fra databasen
 */
export async function clearAll() {
  const session = getSession();

  try {
    console.log('🗑️ Sletter all data...');

    await session.run(`
      MATCH (n) DETACH DELETE n
    `);

    console.log('✅ All data slettet');
  } finally {
    await session.close();
  }
}

// CLI entry point
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\\n✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    });
}
