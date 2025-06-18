import { getSession } from '../lib/neo4j';

async function seedKarakterer() {
  const session = getSession();

  try {
    console.log('🎯 Starter seeding av karakterer og dokumentasjon...');

    // ========== DOKUMENTASJON FOR SØKERE ==========
    console.log('📄 Oppretter dokumentasjon for søkere...');

    // Anna Hansen - Fersk student med gode karakterer
    await session.run(`
      MATCH (anna:Person {fornavn: 'Anna', etternavn: 'Hansen'})
      
      CREATE (annaVitnemal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål - Blindern videregående skole',
        utstedt: date('2023-06-15'),
        utsteder: 'Blindern videregående skole',
        utdanningsnivaa: 'videregaende',
        aktiv: true
      })
      
      CREATE (anna)-[:EIER]->(annaVitnemal)
    `);

    // Koble Anna's vitnemål til fagkoder med karakterer
    await session.run(`
      MATCH (annaVitnemal:Dokumentasjon {navn: 'Vitnemål - Blindern videregående skole'})
      MATCH (rea3022:Fagkode {kode: 'REA3022'}) // Matematikk R1
      MATCH (rea3024:Fagkode {kode: 'REA3024'}) // Matematikk R2
      MATCH (nor1211:Fagkode {kode: 'NOR1211'}) // Norsk hovedmål
      MATCH (fys1001:Fagkode {kode: 'FYS1001'}) // Fysikk 1
      MATCH (fys1002:Fagkode {kode: 'FYS1002'}) // Fysikk 2
      MATCH (kje1001:Fagkode {kode: 'KJE1001'}) // Kjemi 1
      MATCH (kje1002:Fagkode {kode: 'KJE1002'}) // Kjemi 2
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(rea3022)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(rea3024)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(nor1211)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(fys1001)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(fys1002)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(kje1001)
      
      CREATE (annaVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-06-15')
      }]->(kje1002)
    `);

    // Erik Johnsen - Student med forbedringsforsøk
    await session.run(`
      MATCH (erik:Person {fornavn: 'Erik', etternavn: 'Johnsen'})
      
      CREATE (erikVitnemal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål - Trondheim katedralskole',
        utstedt: date('2022-06-15'),
        utsteder: 'Trondheim katedralskole',
        utdanningsnivaa: 'videregaende',
        aktiv: true
      })
      
      CREATE (erik)-[:EIER]->(erikVitnemal)
    `);

    // Erik's ordinære karakterer
    await session.run(`
      MATCH (erikVitnemal:Dokumentasjon {navn: 'Vitnemål - Trondheim katedralskole'})
      MATCH (rea3026:Fagkode {kode: 'REA3026'}) // Matematikk S1
      MATCH (rea3028:Fagkode {kode: 'REA3028'}) // Matematikk S2
      MATCH (nor1211:Fagkode {kode: 'NOR1211'}) // Norsk hovedmål
      MATCH (bio1001:Fagkode {kode: 'BIO1001'}) // Biologi 1
      MATCH (bio1002:Fagkode {kode: 'BIO1002'}) // Biologi 2
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2022-06-15')
      }]->(rea3026)
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2022-06-15')
      }]->(rea3028)
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2022-06-15')
      }]->(nor1211)
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-06-15')
      }]->(bio1001)
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-06-15')
      }]->(bio1002)
    `);

    // Erik tar matematikk på nytt som privatist
    await session.run(`
      MATCH (erikVitnemal:Dokumentasjon {navn: 'Vitnemål - Trondheim katedralskole'})
      MATCH (rea3026:Fagkode {kode: 'REA3026'}) // Matematikk S1
      MATCH (rea3028:Fagkode {kode: 'REA3028'}) // Matematikk S2
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-01-20'),
        kommentar: 'privatist forbedring'
      }]->(rea3026)
      
      CREATE (erikVitnemal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-01-20'),
        kommentar: 'privatist forbedring'
      }]->(rea3028)
    `);

    // Maria Andersen - Fagbrev
    await session.run(`
      MATCH (maria:Person {fornavn: 'Maria', etternavn: 'Andersen'})
      
      CREATE (mariaFagbrev:Dokumentasjon {
        id: randomUUID(),
        type: 'fagbrev',
        navn: 'Fagbrev - Elektriker',
        utstedt: date('2020-06-30'),
        utsteder: 'Fagopplæring i Hordaland',
        utdanningsnivaa: 'fagopplaering',
        aktiv: true
      })
      
      CREATE (mariaKarakterutskrift:Dokumentasjon {
        id: randomUUID(),
        type: 'karakterutskrift',
        navn: 'Karakterutskrift - Høgskulen på Vestlandet',
        utstedt: date('2023-05-15'),
        utsteder: 'Høgskulen på Vestlandet',
        utdanningsnivaa: 'hoeyere utdanning',
        aktiv: true
      })
      
      CREATE (maria)-[:EIER]->(mariaFagbrev)
      CREATE (maria)-[:EIER]->(mariaKarakterutskrift)
    `);

    // Maria's fagbrev og påbygning
    await session.run(`
      MATCH (mariaFagbrev:Dokumentasjon {navn: 'Fagbrev - Elektriker'})
      
      // Oppretter fagkode for elektriker-fagbrev
      CREATE (ele2001:Fagkode {
        id: randomUUID(),
        kode: 'ELE2001',
        navn: 'Fagbrev Elektriker',
        beskrivelse: 'Fagbrev i elektrikerfaget',
        gyldigFra: date('2010-01-01'),
        aktiv: true
      })
      
      CREATE (mariaFagbrev)-[:INNEHOLDER {
        karakter: 'bestått',
        karaktersystem: 'bestått/ikke bestått',
        dato: date('2020-06-30')
      }]->(ele2001)
    `);

    // Maria's karakterer fra høyere utdanning
    await session.run(`
      MATCH (mariaKarakterutskrift:Dokumentasjon {navn: 'Karakterutskrift - Høgskulen på Vestlandet'})
      MATCH (rea3022:Fagkode {kode: 'REA3022'}) // Matematikk R1 (tatt som del av påbygning)
      
      CREATE (mariaKarakterutskrift)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15')
      }]->(rea3022)
    `);

    // Lars Olsen - Arbeidserfaring og realkompetanse
    await session.run(`
      MATCH (lars:Person {fornavn: 'Lars', etternavn: 'Olsen'})
      
      CREATE (larsVitnemal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål - Stavanger katedralskole',
        utstedt: date('2014-06-15'),
        utsteder: 'Stavanger katedralskole',
        utdanningsnivaa: 'videregaende',
        aktiv: true
      })
      
      CREATE (lars)-[:EIER]->(larsVitnemal)
    `);

    // Lars har eldre karakterer med utfasede fagkoder
    await session.run(`
      MATCH (larsVitnemal:Dokumentasjon {navn: 'Vitnemål - Stavanger katedralskole'})
      MATCH (math2mx:Fagkode {kode: '2MX'}) // Gammel matematikk R1-ekvivalent
      MATCH (nor1211:Fagkode {kode: 'NOR1211'}) // Norsk hovedmål
      
      CREATE (larsVitnemal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2014-06-15')
      }]->(math2mx)
      
      CREATE (larsVitnemal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2014-06-15')
      }]->(nor1211)
    `);

    // Sophie Müller - Utenlandsk student
    await session.run(`
      MATCH (sophie:Person {fornavn: 'Sophie', etternavn: 'Müller'})
      
      CREATE (sophieVitnemal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Zeugnis der Allgemeinen Hochschulreife',
        utstedt: date('2021-07-10'),
        utsteder: 'Gymnasium München-Nord',
        utdanningsnivaa: 'videregaende',
        aktiv: true
      })
      
      CREATE (sophiePolitiattest:Dokumentasjon {
        id: randomUUID(),
        type: 'politiattest',
        navn: 'Politiattest',
        utstedt: date('2024-01-15'),
        utsteder: 'Politiet',
        gyldigTil: date('2024-04-15'),
        aktiv: true
      })
      
      CREATE (sophie)-[:EIER]->(sophieVitnemal)
      CREATE (sophie)-[:EIER]->(sophiePolitiattest)
    `);

    console.log('✅ Opprettet dokumentasjon og karakterer for alle søkere');

    // ========== SAMMENDRAG ==========
    console.log('\n📊 Sammendrag av karakterdata:');

    // Karakterstatistikk per person
    const karakterStats = await session.run(`
      MATCH (p:Person)-[:EIER]->(d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
      WITH p, count(r) as antallKarakterer, 
           collect(DISTINCT d.type) as dokumenttyper
      RETURN p.fornavn + ' ' + p.etternavn as navn, 
             antallKarakterer,
             dokumenttyper
      ORDER BY navn
    `);

    console.log('\n   👥 Karakterer per søker:');
    karakterStats.records.forEach((record) => {
      console.log(
        `     ${record.get('navn')}: ${record.get('antallKarakterer').toNumber()} karakterer fra ${record.get('dokumenttyper').join(', ')}`
      );
    });

    // Karakterfordeling
    const karakterfordeling = await session.run(`
      MATCH (d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
      WHERE r.karaktersystem = '1-6'
      RETURN r.karakter as karakter, count(r) as antall
      ORDER BY karakter DESC
    `);

    console.log('\n   📊 Karakterfordeling (1-6):');
    karakterfordeling.records.forEach((record) => {
      console.log(
        `     Karakter ${record.get('karakter')}: ${record.get('antall').toNumber()} forekomster`
      );
    });

    // Forbedringsforsøk
    const forbedringer = await session.run(`
      MATCH (p:Person)-[:EIER]->(d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
      WHERE r.kommentar CONTAINS 'forbedring'
      RETURN p.fornavn + ' ' + p.etternavn as navn, 
             fk.navn as fag,
             r.karakter as nyKarakter,
             r.dato as dato
      ORDER BY navn
    `);

    if (forbedringer.records.length > 0) {
      console.log('\n   📈 Forbedringsforsøk:');
      forbedringer.records.forEach((record) => {
        console.log(
          `     ${record.get('navn')} forbedret ${record.get('fag')} til ${record.get('nyKarakter')}`
        );
      });
    }

    console.log('\n🎉 Karakterseeding fullført!');
  } catch (error) {
    console.error('❌ Feil under karakterseeding:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Kjør seeding hvis scriptet kalles direkte
if (require.main === module) {
  seedKarakterer()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedKarakterer };
