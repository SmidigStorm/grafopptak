import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'test1234'
  )
);

async function compareFagkoder() {
  const session = driver.session();
  
  try {
    console.log('🔍 Comparing Fagkode structures...\n');
    
    // Get one regular fagkode
    const regularResult = await session.run(`
      MATCH (f:Fagkode)
      WHERE f.kode STARTS WITH 'MAT'
      RETURN f, labels(f) as labels
      LIMIT 1
    `);
    
    // Get one VG fagkode
    const vgResult = await session.run(`
      MATCH (f:Fagkode)
      WHERE f.kode STARTS WITH 'VG'
      RETURN f, labels(f) as labels
      LIMIT 1
    `);
    
    if (regularResult.records.length === 0) {
      console.log('❌ No regular fagkode found (starting with MAT)');
      return;
    }
    
    if (vgResult.records.length === 0) {
      console.log('❌ No VG fagkode found');
      return;
    }
    
    const regularFagkode = regularResult.records[0].get('f').properties;
    const regularLabels = regularResult.records[0].get('labels');
    const vgFagkode = vgResult.records[0].get('f').properties;
    const vgLabels = vgResult.records[0].get('labels');
    
    console.log('📚 Regular Fagkode (MAT)');
    console.log('Labels:', regularLabels);
    console.log('Properties:');
    console.log(JSON.stringify(regularFagkode, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');
    
    console.log('📚 VG Fagkode');
    console.log('Labels:', vgLabels);
    console.log('Properties:');
    console.log(JSON.stringify(vgFagkode, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Compare properties
    const regularKeys = Object.keys(regularFagkode);
    const vgKeys = Object.keys(vgFagkode);
    
    const allKeys = [...new Set([...regularKeys, ...vgKeys])].sort();
    
    console.log('🔄 Property Comparison:');
    console.log(`\nProperty${' '.repeat(20)}Regular${' '.repeat(10)}VG`);
    console.log('-'.repeat(60));
    
    for (const key of allKeys) {
      const hasRegular = regularKeys.includes(key);
      const hasVG = vgKeys.includes(key);
      
      console.log(
        `${key.padEnd(28)}${hasRegular ? '✅' : '❌'}${' '.repeat(16)}${hasVG ? '✅' : '❌'}`
      );
    }
    
    console.log('\n📊 Summary:');
    console.log(`Regular fagkode properties: ${regularKeys.length}`);
    console.log(`VG fagkode properties: ${vgKeys.length}`);
    
    const onlyInRegular = regularKeys.filter(k => !vgKeys.includes(k));
    const onlyInVG = vgKeys.filter(k => !regularKeys.includes(k));
    
    if (onlyInRegular.length > 0) {
      console.log(`\nProperties only in regular: ${onlyInRegular.join(', ')}`);
    }
    
    if (onlyInVG.length > 0) {
      console.log(`Properties only in VG: ${onlyInVG.join(', ')}`);
    }
    
    // Check relationships
    console.log('\n' + '='.repeat(60) + '\n');
    console.log('🔗 Checking relationships...\n');
    
    const regularRels = await session.run(`
      MATCH (f:Fagkode {kode: $kode})-[r]-()
      RETURN type(r) as relType, count(r) as count
      ORDER BY relType
    `, { kode: regularFagkode.kode });
    
    const vgRels = await session.run(`
      MATCH (f:Fagkode {kode: $kode})-[r]-()
      RETURN type(r) as relType, count(r) as count
      ORDER BY relType
    `, { kode: vgFagkode.kode });
    
    console.log(`Regular fagkode (${regularFagkode.kode}) relationships:`);
    regularRels.records.forEach(record => {
      console.log(`  ${record.get('relType')}: ${record.get('count')}`);
    });
    
    console.log(`\nVG fagkode (${vgFagkode.kode}) relationships:`);
    vgRels.records.forEach(record => {
      console.log(`  ${record.get('relType')}: ${record.get('count')}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the comparison
compareFagkoder().catch(console.error);