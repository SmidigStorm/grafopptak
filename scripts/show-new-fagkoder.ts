import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'test12345'
  )
);

async function showNewFagkoder() {
  const session = driver.session();
  
  try {
    console.log('📚 Viser fagkoder fra Thomas sitt vitnemål\n');
    console.log('=' .repeat(80));
    
    // Hent alle fagkoder med de spesifiserte prefiksene
    const result = await session.run(`
      MATCH (f:Fagkode)
      WHERE f.kode STARTS WITH 'VG' 
         OR f.kode STARTS WITH 'VF'
         OR f.kode STARTS WITH 'VT'
         OR f.kode STARTS WITH 'AA'
         OR f.kode STARTS WITH 'VL'
      RETURN f.kode AS kode, 
             f.navn AS navn, 
             f.type AS type, 
             f.omfang AS omfang
      ORDER BY f.kode
    `);
    
    if (result.records.length === 0) {
      console.log('❌ Fant ingen fagkoder med de spesifiserte prefiksene');
      return;
    }
    
    // Grupper fagkoder etter prefix
    const grupperteFagkoder: Record<string, any[]> = {};
    
    result.records.forEach(record => {
      const fagkode = {
        kode: record.get('kode'),
        navn: record.get('navn'),
        type: record.get('type'),
        omfang: record.get('omfang')
      };
      
      // Ekstraher prefix (første 2 tegn)
      const prefix = fagkode.kode.substring(0, 2);
      
      if (!grupperteFagkoder[prefix]) {
        grupperteFagkoder[prefix] = [];
      }
      
      grupperteFagkoder[prefix].push(fagkode);
    });
    
    // Vis fagkoder gruppert etter prefix
    const prefixBeskrivelser: Record<string, string> = {
      'VG': 'Videregående grunnleggende fag',
      'VF': 'Videregående felles programfag',
      'VT': 'Videregående tekniske fag',
      'AA': 'Arbeidsledelse',
      'VL': 'Videregående ledelse'
    };
    
    for (const [prefix, fagkoder] of Object.entries(grupperteFagkoder)) {
      console.log(`\n📂 ${prefix} - ${prefixBeskrivelser[prefix] || 'Ukjent kategori'}`);
      console.log('-'.repeat(80));
      
      // Vis header
      console.log(
        'Kode'.padEnd(15) +
        'Navn'.padEnd(40) +
        'Type'.padEnd(15) +
        'Omfang'
      );
      console.log('-'.repeat(80));
      
      // Vis fagkoder
      fagkoder.forEach(fagkode => {
        console.log(
          fagkode.kode.padEnd(15) +
          fagkode.navn.padEnd(40) +
          (fagkode.type || 'N/A').padEnd(15) +
          (fagkode.omfang || 'N/A')
        );
      });
      
      console.log(`\nAntall ${prefix}-fag: ${fagkoder.length}`);
    }
    
    // Vis total oppsummering
    console.log('\n' + '='.repeat(80));
    console.log('📊 Oppsummering:');
    console.log('-'.repeat(80));
    
    let totalt = 0;
    for (const [prefix, fagkoder] of Object.entries(grupperteFagkoder)) {
      console.log(`${prefix}: ${fagkoder.length} fag`);
      totalt += fagkoder.length;
    }
    
    console.log('-'.repeat(80));
    console.log(`Totalt: ${totalt} fagkoder`);
    
  } catch (error) {
    console.error('❌ Feil ved henting av fagkoder:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Kjør scriptet
showNewFagkoder().catch(console.error);