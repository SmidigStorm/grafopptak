import { getSession } from '../../../lib/neo4j';

/**
 * Seeder fagkoder og faggrupper med relasjoner
 * Dette er en atomisk operasjon som må kjøres som helhet
 */
export async function seedFagkoder() {
  const session = getSession();

  try {
    console.log('📁 Oppretter faggrupper...');

    // ========== FAGGRUPPER ==========
    await session.run(`
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
        beskrivelse: 'Norsk hovedmål - 393 timer (Kunnskapsløftet)',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (nor1212:Fagkode {
        id: randomUUID(),
        kode: 'NOR1212',
        navn: 'Norsk sidemål',
        beskrivelse: 'Norsk sidemål - 393 timer (Kunnskapsløftet)',
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
        beskrivelse: 'Fysikk 1 - Grunnleggende fysikk',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (fys1002:Fagkode {
        id: randomUUID(),
        kode: 'FYS1002',
        navn: 'Fysikk 2',
        beskrivelse: 'Fysikk 2 - Videregående fysikk',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (kje1001:Fagkode {
        id: randomUUID(),
        kode: 'KJE1001',
        navn: 'Kjemi 1',
        beskrivelse: 'Kjemi 1 - Grunnleggende kjemi',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (kje1002:Fagkode {
        id: randomUUID(),
        kode: 'KJE1002',
        navn: 'Kjemi 2',
        beskrivelse: 'Kjemi 2 - Videregående kjemi',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (bio1001:Fagkode {
        id: randomUUID(),
        kode: 'BIO1001',
        navn: 'Biologi 1',
        beskrivelse: 'Biologi 1 - Grunnleggende biologi',
        gyldigFra: date('2020-01-01'),
        gyldigTil: null,
        aktiv: true
      })
      CREATE (bio1002:Fagkode {
        id: randomUUID(),
        kode: 'BIO1002',
        navn: 'Biologi 2',
        beskrivelse: 'Biologi 2 - Videregående biologi',
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

    // Return summary
    const result = await session.run(`
      MATCH (fg:Faggruppe)
      OPTIONAL MATCH (fg)<-[:KVALIFISERER_FOR]-(fk:Fagkode)
      WITH fg, count(fk) as antallFagkoder
      RETURN fg.navn as navn, antallFagkoder
      ORDER BY fg.navn
    `);

    console.log('\n📊 Faggrupper opprettet:');
    result.records.forEach((record) => {
      const navn = record.get('navn');
      const antall = record.get('antallFagkoder').toNumber();
      console.log(`  ${navn}: ${antall} fagkoder`);
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle fagkoder og faggrupper
 * Brukes før reseeding eller i tester
 */
export async function clearFagkoder() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Fagkode) DETACH DELETE n`);
    await session.run(`MATCH (n:Faggruppe) DETACH DELETE n`);
    console.log('🗑️ Slettet fagkoder og faggrupper');
  } finally {
    await session.close();
  }
}
