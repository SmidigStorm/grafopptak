// Test evaluering direkte via database
import { evaluateOpptaksVei, getSokerProfile } from './lib/evaluering.js';

async function testDirect() {
  try {
    console.log('🧪 Tester evaluering direkte...');

    // Test med Thomas Nilsen (har realfagsvitnemål)
    const thomasId = '87a337f2-e0a7-4504-92a6-1ffea7e36b5a';

    console.log('\n👤 Henter søkerprofil...');
    const sokerProfile = await getSokerProfile(thomasId);
    console.log('Søker:', sokerProfile);

    console.log('\n🎯 Evaluerer mot UiO Informatikk...');
    // Vi bruker regelsettId siden vi kjenner strukturen
    const evalResult = await evaluateOpptaksVei(thomasId, null, 'UiO Informatikk H25');

    console.log('✅ Evaluering fullført!');
    console.log('📊 Resultat:', JSON.stringify(evalResult, null, 2));
  } catch (error) {
    console.error('❌ Feil:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDirect();
