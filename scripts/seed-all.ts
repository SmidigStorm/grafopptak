import { getSession } from '../lib/neo4j';

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

    // ========== SAMMENDRAG ==========
    console.log('\n📊 Sammendrag av opprettet data:');

    // Faggrupper
    const faggrupperSummary = await session.run('MATCH (fg:Faggruppe) OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg) RETURN fg.navn as faggruppe, count(fk) as antallFagkoder ORDER BY fg.navn');
    console.log('\n   📁 Faggrupper:');
    faggrupperSummary.records.forEach((record) => {
      console.log(`     ${record.get('faggruppe')}: ${record.get('antallFagkoder').toNumber()} fagkoder`);
    });

    // Regelsett-elementer
    const kravelementerCount = await session.run('MATCH (ke:Kravelement) RETURN count(ke) as antall');
    const grunnlagCount = await session.run('MATCH (g:Grunnlag) RETURN count(g) as antall');
    const kvotetypeCount = await session.run('MATCH (kt:KvoteType) RETURN count(kt) as antall');
    const rangeringstypeCount = await session.run('MATCH (rt:RangeringType) RETURN count(rt) as antall');
    
    console.log('\n   📋 Regelsett-elementer:');
    console.log(`     Kravelementer: ${kravelementerCount.records[0].get('antall').toNumber()}`);
    console.log(`     Grunnlag: ${grunnlagCount.records[0].get('antall').toNumber()}`);
    console.log(`     Kvotetyper: ${kvotetypeCount.records[0].get('antall').toNumber()}`);
    console.log(`     Rangeringstyper: ${rangeringstypeCount.records[0].get('antall').toNumber()}`);

    console.log('\n🎉 All seeding fullført!');
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