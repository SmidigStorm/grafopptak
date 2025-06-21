import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

async function testApiQuery() {
  const session = driver.session();
  
  try {
    console.log('Running the exact API query...\n');
    
    const query = `
      MATCH (fk:Fagkode)
      OPTIONAL MATCH (fk)-[:KVALIFISERER_FOR]->(fg:Faggruppe)
      RETURN fk, collect(fg.navn) as faggrupper
      ORDER BY fk.navn
    `;
    
    console.log('Query:', query.trim());
    console.log('\n---\n');
    
    const result = await session.run(query);
    
    console.log(`Total results: ${result.records.length}`);
    console.log('\nFirst 5 results by navn:\n');
    
    result.records.slice(0, 5).forEach((record, index) => {
      const fagkode = record.get('fk');
      const faggrupper = record.get('faggrupper');
      
      console.log(`${index + 1}. ${fagkode.properties.navn} (${fagkode.properties.kode})`);
      console.log(`   Faggrupper: ${faggrupper.filter(Boolean).join(', ') || 'Ingen'}`);
      console.log(`   Full node: ${JSON.stringify(fagkode.properties, null, 2)}`);
      console.log('');
    });
    
    // Also show some statistics
    console.log('\n--- Statistics ---');
    const withFaggrupper = result.records.filter(r => r.get('faggrupper').filter(Boolean).length > 0).length;
    const withoutFaggrupper = result.records.filter(r => r.get('faggrupper').filter(Boolean).length === 0).length;
    
    console.log(`Fagkoder with faggrupper: ${withFaggrupper}`);
    console.log(`Fagkoder without faggrupper: ${withoutFaggrupper}`);
    
    // Check for any potential issues
    console.log('\n--- Checking for potential issues ---');
    const nullNames = result.records.filter(r => !r.get('fk').properties.navn);
    const emptyNames = result.records.filter(r => r.get('fk').properties.navn === '');
    
    console.log(`Fagkoder with null navn: ${nullNames.length}`);
    console.log(`Fagkoder with empty navn: ${emptyNames.length}`);
    
    if (nullNames.length > 0) {
      console.log('\nFagkoder with null navn:');
      nullNames.slice(0, 3).forEach(r => {
        console.log(`  - ${JSON.stringify(r.get('fk').properties)}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

testApiQuery().catch(console.error);