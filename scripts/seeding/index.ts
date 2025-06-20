import { getSession } from '../../lib/neo4j';

// Core modules
import { seedFagkoder, clearFagkoder } from './core/fagkoder';
import { seedStandardKomponenter, clearStandardKomponenter } from './core/standard-komponenter';
import { seedPoengtyper, clearPoengtyper } from './core/poengtyper';
import { seedInstitusjoner, clearInstitusjoner } from './core/institusjoner';

// Regelsett modules
import { seedRegelsettMaler, clearRegelsettMaler } from './regelsett/maler';
import { seedKonkreteRegelsett, clearKonkreteRegelsett } from './regelsett/konkrete';

// Personer modules
import { seedSokere, clearSokere } from './personer/sokere';
import { seedDokumentasjon, clearDokumentasjon } from './personer/dokumentasjon';

/**
 * Hovedfunksjon for å seede hele databasen med modulær struktur
 * Erstatter den monolitiske seed-all.ts
 */
export async function seedAll() {
  const session = getSession();

  try {
    console.log('🌱 Starter modulær seeding av all data...');

    // ========== RESET ==========
    console.log('🗑️ Sletter eksisterende data...');

    // Clear all data (but keep constraints)
    await clearDokumentasjon();
    await clearSokere();
    await clearKonkreteRegelsett();
    await clearRegelsettMaler();
    await clearInstitusjoner();
    await clearPoengtyper();
    await clearStandardKomponenter();
    await clearFagkoder();

    console.log('✅ Slettet eksisterende data');

    // ========== CORE SEEDING ==========
    console.log('\\n🏗️ Seeding kjerne-komponenter...');

    await seedFagkoder();
    await seedStandardKomponenter();
    await seedPoengtyper();
    await seedInstitusjoner();

    console.log('✅ Ferdig med kjerne-komponenter');

    // ========== REGELSETT SEEDING ==========
    console.log('\\n📋 Seeding regelsett...');

    await seedRegelsettMaler();
    await seedKonkreteRegelsett();

    console.log('✅ Ferdig med regelsett');

    // ========== PERSONER SEEDING ==========
    console.log('\\n👥 Seeding personer og dokumentasjon...');

    await seedSokere();
    await seedDokumentasjon();

    console.log('✅ Ferdig med personer og dokumentasjon');

    // ========== SAMMENDRAG ==========
    console.log('\\n📊 Sammendrag av opprettet data:');

    // Faggrupper
    const faggrupperSummary = await session.run(
      'MATCH (fg:Faggruppe) OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg) RETURN fg.navn as faggruppe, count(fk) as antallFagkoder ORDER BY fg.navn'
    );
    console.log('\\n   📁 Faggrupper:');
    faggrupperSummary.records.forEach((record) => {
      console.log(
        `     ${record.get('faggruppe')}: ${record.get('antallFagkoder').toNumber()} fagkoder`
      );
    });

    // Standard-komponenter
    const komponenterCount = await session.run(`
      MATCH (k:Kravelement)
      MATCH (g:Grunnlag) 
      MATCH (kv:KvoteType)
      MATCH (rt:RangeringType)
      MATCH (pt:PoengType)
      RETURN 
        count(DISTINCT k) as kravelementer,
        count(DISTINCT g) as grunnlag,
        count(DISTINCT kv) as kvotetyper,
        count(DISTINCT rt) as rangeringstyper,
        count(DISTINCT pt) as poengtyper
    `);

    const counts = komponenterCount.records[0];
    console.log('\\n   📋 Standard-komponenter:');
    console.log(`     Kravelementer: ${counts.get('kravelementer').toNumber()}`);
    console.log(`     Grunnlag: ${counts.get('grunnlag').toNumber()}`);
    console.log(`     Kvotetyper: ${counts.get('kvotetyper').toNumber()}`);
    console.log(`     Rangeringstyper: ${counts.get('rangeringstyper').toNumber()}`);
    console.log(`     Poengtypene: ${counts.get('poengtyper').toNumber()}`);

    // Institusjoner
    const institusjonerSummary = await session.run(`
      MATCH (i:Institusjon)
      OPTIONAL MATCH (i)-[:TILBYR]->(u:Utdanningstilbud)
      WITH i, count(u) as antallTilbud
      RETURN count(i) as antallInstitusjoner, sum(antallTilbud) as antallTilbud
    `);
    const instCounts = institusjonerSummary.records[0];
    console.log('\\n   🏢 Institusjoner:');
    console.log(`     Institusjoner: ${instCounts.get('antallInstitusjoner').toNumber()}`);
    console.log(`     Utdanningstilbud: ${instCounts.get('antallTilbud').toNumber()}`);

    // Regelsett-maler
    const malerSummary = await session.run(`
      MATCH (rm:Regelsett {erMal: true})
      RETURN count(rm) as antallMaler, collect(rm.navn) as malerNavn
    `);
    const malerCount = malerSummary.records[0];
    console.log('\\n   📜 Regelsett-maler:');
    console.log(`     Antall maler: ${malerCount.get('antallMaler').toNumber()}`);

    // Konkrete regelsett
    const konkreteRegelsettSummary = await session.run(`
      MATCH (r:Regelsett {erMal: false})
      OPTIONAL MATCH (r)-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
      RETURN count(DISTINCT r) as antallRegelsett, count(ov) as antallOpptaksveier
    `);
    const konkreteCounts = konkreteRegelsettSummary.records[0];
    console.log('\\n   📋 Konkrete regelsett:');
    console.log(`     Regelsett: ${konkreteCounts.get('antallRegelsett').toNumber()}`);
    console.log(`     OpptaksVeier: ${konkreteCounts.get('antallOpptaksveier').toNumber()}`);

    // Personer
    const personerSummary = await session.run(`
      MATCH (p:Person)
      OPTIONAL MATCH (p)-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)
      RETURN count(p) as antallPersoner, count(d) as antallDokumenter
    `);
    const personCounts = personerSummary.records[0];
    console.log('\\n   👥 Personer:');
    console.log(`     Søkere: ${personCounts.get('antallPersoner').toNumber()}`);
    console.log(`     Dokumenter: ${personCounts.get('antallDokumenter').toNumber()}`);

    console.log('\\n🎉 Modulær seeding fullført!');
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle data fra databasen
 */
export async function clearAll() {
  console.log('🗑️ Sletter all data...');

  await clearDokumentasjon();
  await clearSokere();
  await clearKonkreteRegelsett();
  await clearRegelsettMaler();
  await clearInstitusjoner();
  await clearPoengtyper();
  await clearStandardKomponenter();
  await clearFagkoder();

  console.log('✅ All data slettet');
}

/**
 * CLI entry point - erstatter seed-all.ts
 */
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\\n✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    });
}
