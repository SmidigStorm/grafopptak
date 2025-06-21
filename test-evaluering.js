// Enkel test av evaluering functionality
const https = require('https');
const http = require('http');

async function testEvaluering() {
  const baseUrl = 'http://localhost:3000';

  try {
    console.log('🧪 Tester evaluering functionality...');

    // Test 1: Hent en søker
    console.log('\n📋 Henter søkere...');
    const sokerResponse = await fetch(`${baseUrl}/api/sokere`);
    const sokere = await sokerResponse.json();

    if (sokere.length === 0) {
      console.log('❌ Ingen søkere funnet');
      return;
    }

    const soker = sokere[0];
    console.log(`✅ Fant søker: ${soker.fornavn} ${soker.etternavn} (ID: ${soker.id})`);

    // Test 2: Hent utdanningstilbud
    console.log('\n📚 Henter utdanningstilbud...');
    const utdanningResponse = await fetch(`${baseUrl}/api/utdanningstilbud`);
    const utdanningstilbud = await utdanningResponse.json();

    if (utdanningstilbud.length === 0) {
      console.log('❌ Ingen utdanningstilbud funnet');
      return;
    }

    const informatikk = utdanningstilbud.find((u) => u.kortnavn === 'Informatikk');
    if (!informatikk) {
      console.log('❌ Informatikk utdanningstilbud ikke funnet');
      console.log(
        'Tilgjengelige:',
        utdanningstilbud.map((u) => u.kortnavn)
      );
      return;
    }

    console.log(`✅ Fant utdanningstilbud: ${informatikk.navn} (ID: ${informatikk.id})`);

    // Test 3: Test evaluering
    console.log('\n🎯 Tester evaluering...');
    const evalueringsData = {
      utdanningstilbudId: informatikk.id,
    };

    const evalueringsResponse = await fetch(`${baseUrl}/api/sokere/${soker.id}/evaluering`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evalueringsData),
    });

    const evalueringsResultat = await evalueringsResponse.json();
    console.log('✅ Evaluering utført!');
    console.log('📊 Resultat:', JSON.stringify(evalueringsResultat, null, 2));
  } catch (error) {
    console.error('❌ Feil:', error.message);
  }
}

testEvaluering();
