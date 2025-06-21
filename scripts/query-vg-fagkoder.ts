import { getSession, closeDriver } from '../lib/neo4j';

async function queryVGFagkoder() {
  const session = getSession();
  
  try {
    console.log('Connecting to Neo4j...');
    
    // Define the prefixes to check
    const prefixes = ['AA', 'VF', 'VT', 'VL'];
    
    console.log('\nChecking fagkoder for prefixes: ' + prefixes.join(', '));
    console.log('═'.repeat(80));
    
    // Query for each prefix
    for (const prefix of prefixes) {
      const result = await session.run(`
        MATCH (f:Fagkode)
        WHERE f.kode STARTS WITH $prefix
        RETURN f.kode AS kode, f.navn AS navn, f.aarstrinn AS aarstrinn
        ORDER BY f.kode
      `, { prefix });
      
      const fagkoder = result.records.map(record => ({
        kode: record.get('kode'),
        navn: record.get('navn'),
        aarstrinn: record.get('aarstrinn')
      }));
      
      console.log(`\nPrefix "${prefix}": ${fagkoder.length} fagkoder`);
      console.log('─'.repeat(80));
      
      if (fagkoder.length > 0) {
        // Print first 5 examples for each prefix
        const displayCount = Math.min(5, fagkoder.length);
        console.log(`Showing first ${displayCount} examples:`);
        
        for (let i = 0; i < displayCount; i++) {
          const fag = fagkoder[i];
          console.log(`  ${fag.kode.padEnd(10)} | ${fag.navn.padEnd(50)} | Årstrinn: ${fag.aarstrinn || 'N/A'}`);
        }
        
        if (fagkoder.length > displayCount) {
          console.log(`  ... and ${fagkoder.length - displayCount} more`);
        }
        
        // Summary by årstrinn for this prefix
        const aarstrinnCount = fagkoder.reduce((acc, fag) => {
          const aarstrinn = fag.aarstrinn || 'Ikke spesifisert';
          acc[aarstrinn] = (acc[aarstrinn] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        if (Object.keys(aarstrinnCount).length > 1) {
          console.log(`\n  Årstrinn fordeling for ${prefix}:`);
          Object.entries(aarstrinnCount)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([aarstrinn, count]) => {
              console.log(`    ${aarstrinn}: ${count} fagkoder`);
            });
        }
      } else {
        console.log('  Ingen fagkoder funnet med dette prefikset');
      }
    }
    
    // Total summary
    console.log('\n═'.repeat(80));
    console.log('\nTOTAL OPPSUMMERING:');
    console.log('─'.repeat(80));
    
    let totalCount = 0;
    for (const prefix of prefixes) {
      const countResult = await session.run(`
        MATCH (f:Fagkode)
        WHERE f.kode STARTS WITH $prefix
        RETURN count(f) AS count
      `, { prefix });
      
      const count = countResult.records[0].get('count').toNumber();
      totalCount += count;
      console.log(`  ${prefix}: ${count.toString().padStart(4)} fagkoder`);
    }
    
    console.log('─'.repeat(80));
    console.log(`  TOTAL: ${totalCount} fagkoder`);
    
  } catch (error) {
    console.error('Error querying fagkoder:', error);
  } finally {
    await session.close();
    await closeDriver();
    console.log('\nDatabase connection closed.');
  }
}

// Run the query
queryVGFagkoder().catch(console.error);