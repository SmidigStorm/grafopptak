import { getSession } from '../lib/neo4j';

async function seedDatabase() {
  const session = getSession();
  
  try {
    console.log('🌱 Starter seeding av Neo4j database...');
    
    // Slett eksisterende data
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('✅ Slettet eksisterende data');
    
    // Opprett institusjoner
    await session.run(`
      CREATE (ntnu:Institusjon {name: 'NTNU', fullName: 'Norges teknisk-naturvitenskapelige universitet'})
      CREATE (uio:Institusjon {name: 'UiO', fullName: 'Universitetet i Oslo'})
      CREATE (uib:Institusjon {name: 'UiB', fullName: 'Universitetet i Bergen'})
    `);
    console.log('✅ Opprettet institusjoner');
    
    // Opprett utdanninger
    await session.run(`
      MATCH (ntnu:Institusjon {name: 'NTNU'})
      MATCH (uio:Institusjon {name: 'UiO'})
      CREATE (data:Utdanning {name: 'Datateknologi', studiepoeng: 180, grad: 'Bachelor'})
      CREATE (med:Utdanning {name: 'Medisin', studiepoeng: 360, grad: 'Master'})
      CREATE (psyk:Utdanning {name: 'Psykologi', studiepoeng: 300, grad: 'Master'})
      CREATE (ntnu)-[:TILBYR]->(data)
      CREATE (ntnu)-[:TILBYR]->(med)
      CREATE (uio)-[:TILBYR]->(med)
      CREATE (uio)-[:TILBYR]->(psyk)
    `);
    console.log('✅ Opprettet utdanninger');
    
    // Opprett søkere
    await session.run(`
      CREATE (p1:Person {name: 'Kari Nordmann', alder: 19, poeng: 52.3})
      CREATE (p2:Person {name: 'Ola Hansen', alder: 21, poeng: 48.7})
      CREATE (p3:Person {name: 'Anne Olsen', alder: 20, poeng: 55.1})
    `);
    console.log('✅ Opprettet søkere');
    
    // Opprett opptak
    await session.run(`
      CREATE (opptak2025:Opptak {name: 'Opptak 2025', år: 2025, status: 'Åpen'})
    `);
    console.log('✅ Opprettet opptak');
    
    // Opprett søknader
    await session.run(`
      MATCH (p1:Person {name: 'Kari Nordmann'})
      MATCH (p2:Person {name: 'Ola Hansen'})
      MATCH (p3:Person {name: 'Anne Olsen'})
      MATCH (data:Utdanning {name: 'Datateknologi'})
      MATCH (med:Utdanning {name: 'Medisin'})
      MATCH (psyk:Utdanning {name: 'Psykologi'})
      MATCH (opptak:Opptak {name: 'Opptak 2025'})
      CREATE (p1)-[:SØKER {prioritet: 1}]->(data)
      CREATE (p1)-[:SØKER {prioritet: 2}]->(med)
      CREATE (p2)-[:SØKER {prioritet: 1}]->(data)
      CREATE (p3)-[:SØKER {prioritet: 1}]->(med)
      CREATE (p3)-[:SØKER {prioritet: 2}]->(psyk)
      CREATE (p1)-[:DELTAR_I]->(opptak)
      CREATE (p2)-[:DELTAR_I]->(opptak)
      CREATE (p3)-[:DELTAR_I]->(opptak)
    `);
    console.log('✅ Opprettet søknader');
    
    // Opprett regelsett
    await session.run(`
      MATCH (data:Utdanning {name: 'Datateknologi'})
      MATCH (med:Utdanning {name: 'Medisin'})
      CREATE (r1:Regelsett {name: 'Generell studiekompetanse', minimumspoeng: 35})
      CREATE (r2:Regelsett {name: 'Realfagskrav', krav: 'R2 matematikk'})
      CREATE (r3:Regelsett {name: 'Karakterkrav medisin', minimumspoeng: 50})
      CREATE (data)-[:KREVER]->(r1)
      CREATE (data)-[:KREVER]->(r2)
      CREATE (med)-[:KREVER]->(r1)
      CREATE (med)-[:KREVER]->(r3)
    `);
    console.log('✅ Opprettet regelsett');
    
    console.log('🎉 Seeding fullført!');
    
  } catch (error) {
    console.error('❌ Feil under seeding:', error);
  } finally {
    await session.close();
  }
}

// Kjør seeding
seedDatabase().catch(console.error);