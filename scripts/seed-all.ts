import { getSession } from '../lib/neo4j';
import { seedKarakterer } from './seed-karakterer';

async function seedAll() {
  const session = getSession();

  try {
    console.log('🌱 Starter seeding av all data...');

    // ========== RESET ==========
    console.log('🗑️ Sletter eksisterende data...');

    // Slett alle data-noder (men behold constraints)
    await session.run(`MATCH (n:Fagkode) DETACH DELETE n`);
    await session.run(`MATCH (n:Faggruppe) DETACH DELETE n`);
    await session.run(`MATCH (n:Kravelement) DETACH DELETE n`);
    await session.run(`MATCH (n:Grunnlag) DETACH DELETE n`);
    await session.run(`MATCH (n:KvoteType) DETACH DELETE n`);
    await session.run(`MATCH (n:RangeringType) DETACH DELETE n`);
    await session.run(`MATCH (n:RegelsettMal) DETACH DELETE n`);
    await session.run(`MATCH (n:Institusjon) DETACH DELETE n`);
    await session.run(`MATCH (n:Utdanningstilbud) DETACH DELETE n`);
    await session.run(`MATCH (n:Person) DETACH DELETE n`);
    console.log('✅ Slettet eksisterende data');

    // ========== FAGGRUPPER ==========
    console.log('📁 Oppretter faggrupper...');

    const faggrupper = await session.run(`
      CREATE (mathR1:Faggruppe {
        id: randomUUID(),
        navn: 'Matematikk R1-nivå',
        beskrivelse: 'Matematikk på R1-nivå eller tilsvarende kombinasjon (S1+S2)',
        type: 'matematikk',
        aktiv: true
      })
      CREATE (mathR2:Faggruppe {
        id: randomUUID(),
        navn: 'Matematikk R2-nivå',
        beskrivelse: 'Matematikk på R2-nivå',
        type: 'matematikk',
        aktiv: true
      })
      CREATE (norsk393:Faggruppe {
        id: randomUUID(),
        navn: 'Norsk 393 timer',
        beskrivelse: 'Norsk hovedmål eller sidemål (393 timer)',
        type: 'norsk',
        aktiv: true
      })
      CREATE (realfagValgfritt:Faggruppe {
        id: randomUUID(),
        navn: 'Realfag valgfritt',
        beskrivelse: 'Fysikk, kjemi, biologi, IT, geofag eller teknologi/forskningslære (1+2)',
        type: 'realfag',
        aktiv: true
      })
      RETURN mathR1, mathR2, norsk393, realfagValgfritt
    `);
    console.log('✅ Opprettet faggrupper');

    // ========== FAGKODER ==========
    console.log('📋 Oppretter fagkoder...');

    // Matematikk fagkoder
    await session.run(`
      CREATE (rea3022:Fagkode {
        id: randomUUID(),
        kode: 'REA3022',
        navn: 'Matematikk R1',
        beskrivelse: 'Matematikk R1 - Hovedkode (Kunnskapsløftet)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (rea3024:Fagkode {
        id: randomUUID(),
        kode: 'REA3024',
        navn: 'Matematikk R2',
        beskrivelse: 'Matematikk R2 - Hovedkode (Kunnskapsløftet)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (rea3026:Fagkode {
        id: randomUUID(),
        kode: 'REA3026',
        navn: 'Matematikk S1',
        beskrivelse: 'Matematikk S1 - Del av S1+S2 kombinasjon',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (rea3028:Fagkode {
        id: randomUUID(),
        kode: 'REA3028',
        navn: 'Matematikk S2',
        beskrivelse: 'Matematikk S2 - Del av S1+S2 kombinasjon',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (math3mx:Fagkode {
        id: randomUUID(),
        kode: '3MX',
        navn: 'Matematikk 3MX',
        beskrivelse: 'Matematikk 3MX - Utfaset fagkode (Reform 94)',
        gyldigFra: date('1994-01-01'),
        gyldigTil: date('2006-12-31'),
        aktiv: false
      })
      CREATE (math2mx:Fagkode {
        id: randomUUID(),
        kode: '2MX',
        navn: 'Matematikk 2MX',
        beskrivelse: 'Matematikk 2MX - Utfaset fagkode (Reform 94)',
        gyldigFra: date('1994-01-01'),
        gyldigTil: date('2006-12-31'),
        aktiv: false
      })
    `);

    // Norsk fagkoder
    await session.run(`
      CREATE (nor1211:Fagkode {
        id: randomUUID(),
        kode: 'NOR1211',
        navn: 'Norsk hovedmål',
        beskrivelse: 'Norsk hovedmål (393 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (nor1212:Fagkode {
        id: randomUUID(),
        kode: 'NOR1212',
        navn: 'Norsk sidemål',
        beskrivelse: 'Norsk sidemål (393 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
    `);

    // Realfag fagkoder
    await session.run(`
      CREATE (fys1001:Fagkode {
        id: randomUUID(),
        kode: 'FYS1001',
        navn: 'Fysikk 1',
        beskrivelse: 'Fysikk 1 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (fys1002:Fagkode {
        id: randomUUID(),
        kode: 'FYS1002',
        navn: 'Fysikk 2',
        beskrivelse: 'Fysikk 2 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (kje1001:Fagkode {
        id: randomUUID(),
        kode: 'KJE1001',
        navn: 'Kjemi 1',
        beskrivelse: 'Kjemi 1 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (kje1002:Fagkode {
        id: randomUUID(),
        kode: 'KJE1002',
        navn: 'Kjemi 2',
        beskrivelse: 'Kjemi 2 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (bio1001:Fagkode {
        id: randomUUID(),
        kode: 'BIO1001',
        navn: 'Biologi 1',
        beskrivelse: 'Biologi 1 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (bio1002:Fagkode {
        id: randomUUID(),
        kode: 'BIO1002',
        navn: 'Biologi 2',
        beskrivelse: 'Biologi 2 (140 timer)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
    `);
    console.log('✅ Opprettet fagkoder');

    // ========== FAGKODE-FAGGRUPPE KOBLINGER ==========
    console.log('🔗 Kobler fagkoder til faggrupper...');

    // Matematikk R1-nivå
    await session.run(`
      MATCH (mathR1:Faggruppe {navn: 'Matematikk R1-nivå'})
      MATCH (rea3022:Fagkode {kode: 'REA3022'})
      MATCH (rea3026:Fagkode {kode: 'REA3026'}) 
      MATCH (rea3028:Fagkode {kode: 'REA3028'})
      MATCH (math2mx:Fagkode {kode: '2MX'})
      
      CREATE (rea3022)-[:KVALIFISERER_FOR]->(mathR1)
      CREATE (rea3026)-[:KVALIFISERER_FOR {kreverKombinasjon: ['REA3028']}]->(mathR1)
      CREATE (rea3028)-[:KVALIFISERER_FOR {kreverKombinasjon: ['REA3026']}]->(mathR1)
      CREATE (math2mx)-[:KVALIFISERER_FOR]->(mathR1)
    `);

    // Matematikk R2-nivå
    await session.run(`
      MATCH (mathR2:Faggruppe {navn: 'Matematikk R2-nivå'})
      MATCH (rea3024:Fagkode {kode: 'REA3024'})
      MATCH (math3mx:Fagkode {kode: '3MX'})
      
      CREATE (rea3024)-[:KVALIFISERER_FOR]->(mathR2)
      CREATE (math3mx)-[:KVALIFISERER_FOR]->(mathR2)
    `);

    // Norsk 393 timer
    await session.run(`
      MATCH (norsk393:Faggruppe {navn: 'Norsk 393 timer'})
      MATCH (nor1211:Fagkode {kode: 'NOR1211'})
      MATCH (nor1212:Fagkode {kode: 'NOR1212'})
      
      CREATE (nor1211)-[:KVALIFISERER_FOR]->(norsk393)
      CREATE (nor1212)-[:KVALIFISERER_FOR]->(norsk393)
    `);

    // Realfag valgfritt
    await session.run(`
      MATCH (realfagValgfritt:Faggruppe {navn: 'Realfag valgfritt'})
      MATCH (fys1001:Fagkode {kode: 'FYS1001'})
      MATCH (fys1002:Fagkode {kode: 'FYS1002'})
      MATCH (kje1001:Fagkode {kode: 'KJE1001'})
      MATCH (kje1002:Fagkode {kode: 'KJE1002'})
      MATCH (bio1001:Fagkode {kode: 'BIO1001'})
      MATCH (bio1002:Fagkode {kode: 'BIO1002'})
      
      CREATE (fys1001)-[:KVALIFISERER_FOR {kreverKombinasjon: ['FYS1002']}]->(realfagValgfritt)
      CREATE (fys1002)-[:KVALIFISERER_FOR {kreverKombinasjon: ['FYS1001']}]->(realfagValgfritt)
      CREATE (kje1001)-[:KVALIFISERER_FOR {kreverKombinasjon: ['KJE1002']}]->(realfagValgfritt)
      CREATE (kje1002)-[:KVALIFISERER_FOR {kreverKombinasjon: ['KJE1001']}]->(realfagValgfritt)
      CREATE (bio1001)-[:KVALIFISERER_FOR {kreverKombinasjon: ['BIO1002']}]->(realfagValgfritt)
      CREATE (bio1002)-[:KVALIFISERER_FOR {kreverKombinasjon: ['BIO1001']}]->(realfagValgfritt)
    `);
    console.log('✅ Koblet fagkoder til faggrupper');

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
    `);
    console.log('✅ Opprettet kravelementer');

    // ========== GRUNNLAG ==========
    console.log('🏗️ Oppretter grunnlag...');

    await session.run(`
      CREATE (grunnlag1:Grunnlag {
        id: randomUUID(),
        navn: 'Vitnemål videregående',
        type: 'vitnemaal-vgs',
        beskrivelse: 'Standard vitnemål fra videregående skole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag2:Grunnlag {
        id: randomUUID(),
        navn: 'Fagbrev',
        type: 'fagbrev',
        beskrivelse: 'Fagbrev/svennebrev fra yrkesfag',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag3:Grunnlag {
        id: randomUUID(),
        navn: 'FagskoleUtdanning',
        type: 'fagskole',
        beskrivelse: 'Fullført fagskoleUtdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag4:Grunnlag {
        id: randomUUID(),
        navn: 'Utenlandsk utdanning',
        type: 'utenlandsk',
        beskrivelse: 'Godkjent utenlandsk utdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag5:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse',
        type: 'realkompetanse',
        beskrivelse: 'Vurdering basert på arbeidserfaring',
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
        navn: 'Kvote for forkurs ingeniør',
        type: 'forkurs-ingenior',
        beskrivelse: 'For søkere som har gjennomført forkurs',
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

    // ========== REGELSETT-MALER ==========
    console.log('📋 Oppretter regelsett-maler...');

    // Opprett RegelsettMal for Ingeniørutdanning
    await session.run(`
      CREATE (ingeniorMal:RegelsettMal {
        id: randomUUID(),
        navn: 'Ingeniørutdanning',
        beskrivelse: 'Standard regelsettmal for ingeniørutdanninger med strengere realfagskrav',
        versjon: '1.0',
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Koble ingeniørutdanning til standarder og opprett tre-struktur
    await session.run(`
      MATCH (ingeniorMal:RegelsettMal {navn: 'Ingeniørutdanning'})
      MATCH (gsk:Kravelement {type: 'gsk'})
      MATCH (matR1:Kravelement {type: 'matematikk-r1'})
      MATCH (matR2:Kravelement {type: 'matematikk-r2'})
      
      MATCH (grunnlagVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (grunnlagFagbrev:Grunnlag {type: 'fagbrev'})
      MATCH (grunnlagFagskole:Grunnlag {type: 'fagskole'})
      
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (forstegangsvitnemaal:KvoteType {type: 'forstegangsvitnemaal'})
      
      MATCH (karaktersnitt:RangeringType {type: 'karaktersnitt-realfag'})
      MATCH (fagbrevRangering:RangeringType {type: 'fagbrev-realfag'})

      // Koble til regelsettmal
      CREATE (ingeniorMal)-[:INNEHOLDER]->(gsk)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(matR1)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(matR2)
      
      CREATE (ingeniorMal)-[:INNEHOLDER]->(grunnlagVgs)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(grunnlagFagbrev)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(grunnlagFagskole)
      
      CREATE (ingeniorMal)-[:INNEHOLDER]->(ordinaer)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(forstegangsvitnemaal)
      
      CREATE (ingeniorMal)-[:INNEHOLDER]->(karaktersnitt)
      CREATE (ingeniorMal)-[:INNEHOLDER]->(fagbrevRangering)

      // Opprett tre-struktur: Videregående vei
      CREATE (grunnlagVgs)-[:KREVER]->(gsk)
      CREATE (grunnlagVgs)-[:KREVER]->(matR1)
      CREATE (grunnlagVgs)-[:KREVER]->(matR2)
      CREATE (grunnlagVgs)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (grunnlagVgs)-[:GIR_TILGANG_TIL]->(forstegangsvitnemaal)
      CREATE (grunnlagVgs)-[:BRUKER_RANGERING]->(karaktersnitt)

      // Opprett tre-struktur: Fagbrev vei  
      CREATE (grunnlagFagbrev)-[:KREVER]->(matR1)
      CREATE (grunnlagFagbrev)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (grunnlagFagbrev)-[:BRUKER_RANGERING]->(fagbrevRangering)

      // Opprett tre-struktur: Fagskole vei
      CREATE (grunnlagFagskole)-[:KREVER]->(matR1)  
      CREATE (grunnlagFagskole)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (grunnlagFagskole)-[:BRUKER_RANGERING]->(karaktersnitt)
    `);

    // Opprett RegelsettMal for Lærerutdanning
    await session.run(`
      CREATE (laererMal:RegelsettMal {
        id: randomUUID(),
        navn: 'Lærerutdanning',
        beskrivelse: 'Standard regelsettmal for lærerutdanninger med karakterkrav',
        versjon: '1.0',
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Koble lærerutdanning til standarder og opprett tre-struktur
    await session.run(`
      MATCH (laererMal:RegelsettMal {navn: 'Lærerutdanning'})
      MATCH (gsk:Kravelement {type: 'gsk'})
      MATCH (norskSpraak:Kravelement {type: 'norsk-spraak'})
      
      MATCH (grunnlagVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (grunnlagRealkompetanse:Grunnlag {type: 'realkompetanse'})
      
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (forstegangsvitnemaal:KvoteType {type: 'forstegangsvitnemaal'})
      
      MATCH (karaktersnitt:RangeringType {type: 'karaktersnitt-realfag'})
      MATCH (arbeidserfaring:RangeringType {type: 'erfaring-fagkompetanse'})

      // Koble til regelsettmal
      CREATE (laererMal)-[:INNEHOLDER]->(gsk)
      CREATE (laererMal)-[:INNEHOLDER]->(norskSpraak)
      
      CREATE (laererMal)-[:INNEHOLDER]->(grunnlagVgs)
      CREATE (laererMal)-[:INNEHOLDER]->(grunnlagRealkompetanse)
      
      CREATE (laererMal)-[:INNEHOLDER]->(ordinaer)
      CREATE (laererMal)-[:INNEHOLDER]->(forstegangsvitnemaal)
      
      CREATE (laererMal)-[:INNEHOLDER]->(karaktersnitt)
      CREATE (laererMal)-[:INNEHOLDER]->(arbeidserfaring)

      // Opprett tre-struktur: Videregående vei
      CREATE (grunnlagVgs)-[:KREVER]->(gsk)
      CREATE (grunnlagVgs)-[:KREVER]->(norskSpraak)
      CREATE (grunnlagVgs)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (grunnlagVgs)-[:GIR_TILGANG_TIL]->(forstegangsvitnemaal)
      CREATE (grunnlagVgs)-[:BRUKER_RANGERING]->(karaktersnitt)

      // Opprett tre-struktur: Realkompetanse vei
      CREATE (grunnlagRealkompetanse)-[:KREVER]->(norskSpraak)
      CREATE (grunnlagRealkompetanse)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (grunnlagRealkompetanse)-[:BRUKER_RANGERING]->(arbeidserfaring)
    `);

    console.log('✅ Opprettet regelsett-maler');

    // ========== INSTITUSJONER ==========
    console.log('🏢 Oppretter institusjoner...');

    await session.run(`
      CREATE (uio:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Oslo',
        kortNavn: 'UiO',
        type: 'Universitet',
        institusjonsnummer: '0150',
        adresse: 'Problemveien 7, 0313 Oslo',
        nettside: 'https://www.uio.no',
        aktiv: true
      })
      CREATE (ntnu:Institusjon {
        id: randomUUID(),
        navn: 'Norges teknisk-naturvitenskapelige universitet',
        kortNavn: 'NTNU',
        type: 'Universitet',
        institusjonsnummer: '0194',
        adresse: 'Høgskoleringen 1, 7491 Trondheim',
        nettside: 'https://www.ntnu.no',
        aktiv: true
      })
      CREATE (oslomet:Institusjon {
        id: randomUUID(),
        navn: 'OsloMet - storbyuniversitetet',
        kortNavn: 'OsloMet',
        type: 'Høgskole',
        institusjonsnummer: '0202',
        adresse: 'Pilestredet 35, 0166 Oslo',
        nettside: 'https://www.oslomet.no',
        aktiv: true
      })
      CREATE (kristiania:Institusjon {
        id: randomUUID(),
        navn: 'Høyskolen Kristiania',
        kortNavn: 'Kristiania',
        type: 'Privat høgskole',
        institusjonsnummer: '1502',
        adresse: 'Prinsensgate 7-9, 0152 Oslo',
        nettside: 'https://www.kristiania.no',
        aktiv: true
      })
      CREATE (viken:Institusjon {
        id: randomUUID(),
        navn: 'Viken videregående skole',
        kortNavn: 'Viken VGS',
        type: 'Videregående skole',
        institusjonsnummer: '3001',
        adresse: 'Skolegata 1, 3000 Drammen',
        nettside: 'https://viken.no',
        aktiv: true
      })
    `);
    console.log('✅ Opprettet institusjoner');

    // ========== UTDANNINGSTILBUD ==========
    console.log('🎓 Oppretter utdanningstilbud...');

    await session.run(`
      MATCH (uio:Institusjon {kortNavn: 'UiO'})
      MATCH (ntnu:Institusjon {kortNavn: 'NTNU'})
      MATCH (oslomet:Institusjon {kortNavn: 'OsloMet'})
      MATCH (kristiania:Institusjon {kortNavn: 'Kristiania'})
      
      CREATE (informatikk:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i informatikk',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 200,
        beskrivelse: 'Tredelt bachelorprogram i informatikk med spesialisering innen programmering, algoritmer og datastrukturer.',
        aktiv: true
      })
      CREATE (bygg:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Sivilingeniør i bygg- og miljøteknikk',
        studienivaa: 'Master',
        studiepoeng: 300,
        varighet: '5 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Trondheim',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 150,
        beskrivelse: 'Integrert masterprogram innen bygg- og miljøteknikk med fokus på bærekraftige løsninger.',
        aktiv: true
      })
      CREATE (sykepleie:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i sykepleie',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Begge',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 120,
        beskrivelse: 'Profesjonsutdanning som kvalifiserer for autorisasjon som sykepleier.',
        aktiv: true
      })
      CREATE (markedsforing:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i markedsføring og merkevareledelse',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Engelsk',
        maxAntallStudenter: 80,
        beskrivelse: 'Moderne markedsføringsutdanning med fokus på digital markedsføring og merkevarebygging.',
        aktiv: true
      })
      
      CREATE (uio)-[:TILBYR]->(informatikk)
      CREATE (ntnu)-[:TILBYR]->(bygg)
      CREATE (oslomet)-[:TILBYR]->(sykepleie)
      CREATE (kristiania)-[:TILBYR]->(markedsforing)
    `);
    console.log('✅ Opprettet utdanningstilbud');

    // ========== SØKERE ==========
    console.log('👥 Oppretter søkere...');

    await session.run(`
      CREATE (anna:Person {
        id: randomUUID(),
        fornavn: 'Anna',
        etternavn: 'Hansen',
        fodselsdato: date('2003-05-15'),
        fodselsnummer: '15050312345',
        epost: 'anna.hansen@example.no',
        telefon: '12345678',
        adresse: 'Storgata 15\\n0180 Oslo',
        postnummer: '0180',
        poststed: 'Oslo',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (erik:Person {
        id: randomUUID(),
        fornavn: 'Erik',
        etternavn: 'Johnsen',
        fodselsdato: date('2002-09-23'),
        fodselsnummer: '23090234567',
        epost: 'erik.johnsen@example.no',
        telefon: '23456789',
        adresse: 'Elvegata 42\\n7030 Trondheim',
        postnummer: '7030',
        poststed: 'Trondheim',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (maria:Person {
        id: randomUUID(),
        fornavn: 'Maria',
        etternavn: 'Andersen',
        fodselsdato: date('1998-12-08'),
        fodselsnummer: '08129812345',
        epost: 'maria.andersen@example.no',
        telefon: '34567890',
        adresse: 'Fjellveien 8\\n5020 Bergen',
        postnummer: '5020',
        poststed: 'Bergen',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (lars:Person {
        id: randomUUID(),
        fornavn: 'Lars',
        etternavn: 'Olsen',
        fodselsdato: date('1995-07-14'),
        fodselsnummer: '14079512345',
        epost: 'lars.olsen@example.no',
        telefon: '45678901',
        adresse: 'Industriveien 99\\n4020 Stavanger',
        postnummer: '4020',
        poststed: 'Stavanger',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (sophie:Person {
        id: randomUUID(),
        fornavn: 'Sophie',
        etternavn: 'Müller',
        fodselsdato: date('2001-03-25'),
        fodselsnummer: '25030123456',
        epost: 'sophie.muller@example.de',
        telefon: '56789012',
        adresse: 'Universitetsveien 12\\n0315 Oslo',
        postnummer: '0315',
        poststed: 'Oslo',
        statsborgerskap: 'Tyskland',
        aktiv: true
      })
    `);
    console.log('✅ Opprettet søkere');

    // ========== SAMMENDRAG ==========
    console.log('\n📊 Sammendrag av opprettet data:');

    // Faggrupper
    const faggrupperSummary = await session.run(
      'MATCH (fg:Faggruppe) OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg) RETURN fg.navn as faggruppe, count(fk) as antallFagkoder ORDER BY fg.navn'
    );
    console.log('\n   📁 Faggrupper:');
    faggrupperSummary.records.forEach((record) => {
      console.log(
        `     ${record.get('faggruppe')}: ${record.get('antallFagkoder').toNumber()} fagkoder`
      );
    });

    // Regelsett-elementer
    const kravelementerCount = await session.run(
      'MATCH (ke:Kravelement) RETURN count(ke) as antall'
    );
    const grunnlagCount = await session.run('MATCH (g:Grunnlag) RETURN count(g) as antall');
    const kvotetypeCount = await session.run('MATCH (kt:KvoteType) RETURN count(kt) as antall');
    const rangeringstypeCount = await session.run(
      'MATCH (rt:RangeringType) RETURN count(rt) as antall'
    );

    console.log('\n   📋 Regelsett-elementer:');
    console.log(`     Kravelementer: ${kravelementerCount.records[0].get('antall').toNumber()}`);
    console.log(`     Grunnlag: ${grunnlagCount.records[0].get('antall').toNumber()}`);
    console.log(`     Kvotetyper: ${kvotetypeCount.records[0].get('antall').toNumber()}`);
    console.log(`     Rangeringstyper: ${rangeringstypeCount.records[0].get('antall').toNumber()}`);

    // Regelsett-maler
    const regelsettMalerSummary = await session.run(`
      MATCH (rm:RegelsettMal)
      OPTIONAL MATCH (rm)-[:INNEHOLDER]->(ke:Kravelement)
      OPTIONAL MATCH (rm)-[:INNEHOLDER]->(g:Grunnlag)
      OPTIONAL MATCH (rm)-[:INNEHOLDER]->(kt:KvoteType)
      OPTIONAL MATCH (rm)-[:INNEHOLDER]->(rt:RangeringType)
      
      RETURN rm.navn as regelsettMal,
             count(DISTINCT ke) as antallKravelementer,
             count(DISTINCT g) as antallGrunnlag,
             count(DISTINCT kt) as antallKvoteTyper,
             count(DISTINCT rt) as antallRangeringTyper
      ORDER BY rm.navn
    `);

    console.log('\n   📋 Regelsett-maler:');
    regelsettMalerSummary.records.forEach((record) => {
      console.log(`     ${record.get('regelsettMal')}:`);
      console.log(`       Kravelementer: ${record.get('antallKravelementer').toNumber()}`);
      console.log(`       Grunnlag: ${record.get('antallGrunnlag').toNumber()}`);
      console.log(`       Kvotetyper: ${record.get('antallKvoteTyper').toNumber()}`);
      console.log(`       Rangeringstyper: ${record.get('antallRangeringTyper').toNumber()}`);
    });

    // Nye entiteter
    const institusjonerCount = await session.run('MATCH (i:Institusjon) RETURN count(i) as antall');
    const utdanningstilbudCount = await session.run(
      'MATCH (u:Utdanningstilbud) RETURN count(u) as antall'
    );
    const sokereCount = await session.run('MATCH (p:Person) RETURN count(p) as antall');

    console.log('\n   🏢 Andre entiteter:');
    console.log(`     Institusjoner: ${institusjonerCount.records[0].get('antall').toNumber()}`);
    console.log(
      `     Utdanningstilbud: ${utdanningstilbudCount.records[0].get('antall').toNumber()}`
    );
    console.log(`     Søkere: ${sokereCount.records[0].get('antall').toNumber()}`);

    console.log('\n🎉 All seeding fullført!');

    // Seed karakterer hvis kalt direkte
    if (require.main === module) {
      console.log('\n🎯 Starter karakterseeding...');
      await seedKarakterer();
    }
  } catch (error) {
    console.error('❌ Feil under seeding:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Kjør seeding hvis scriptet kalles direkte
if (require.main === module) {
  seedAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedAll };
