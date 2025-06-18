import { getSession } from '../lib/neo4j';
import { seedAll } from './seed-all';

// Database administrasjonsfunksjoner
export class DatabaseAdmin {
  static async resetDatabase() {
    const session = getSession();

    try {
      console.log('🗄️ Resetter hele databasen...');

      // Slett ALL data og constraints
      await session.run('MATCH (n) DETACH DELETE n');
      console.log('✅ Slettet all data');

      // Slett alle constraints
      const constraintsResult = await session.run('SHOW CONSTRAINTS');
      for (const record of constraintsResult.records) {
        const constraintName = record.get('name');
        try {
          await session.run(`DROP CONSTRAINT ${constraintName} IF EXISTS`);
        } catch (constraintError) {
          // Ignorer feil hvis constraint ikke finnes
          console.log(`⚠️ Constraint ${constraintName} kunne ikke slettes (finnes kanskje ikke)`);
        }
      }
      console.log('✅ Slettet alle constraints');

      console.log('🎉 Database helt resatt!');
    } catch (error) {
      console.error('❌ Feil ved reset av database:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  static async setupConstraints() {
    const session = getSession();

    try {
      console.log('🔐 Setter opp constraints...');

      // Fagkoder og faggrupper
      await session.run(
        'CREATE CONSTRAINT fagkode_id IF NOT EXISTS FOR (fk:Fagkode) REQUIRE fk.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT fagkode_kode IF NOT EXISTS FOR (fk:Fagkode) REQUIRE fk.kode IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT faggruppe_id IF NOT EXISTS FOR (fg:Faggruppe) REQUIRE fg.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT faggruppe_navn IF NOT EXISTS FOR (fg:Faggruppe) REQUIRE fg.navn IS UNIQUE'
      );

      // Institusjoner og utdanningstilbud
      await session.run(
        'CREATE CONSTRAINT institusjon_id IF NOT EXISTS FOR (i:Institusjon) REQUIRE i.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT institusjon_institusjonsnummer IF NOT EXISTS FOR (i:Institusjon) REQUIRE i.institusjonsnummer IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT utdanningstilbud_id IF NOT EXISTS FOR (u:Utdanningstilbud) REQUIRE u.id IS UNIQUE'
      );

      // Opptak og søknader
      await session.run(
        'CREATE CONSTRAINT opptak_id IF NOT EXISTS FOR (o:Opptak) REQUIRE o.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT soknad_id IF NOT EXISTS FOR (s:Søknad) REQUIRE s.id IS UNIQUE'
      );

      // Personer og dokumentasjon
      await session.run(
        'CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT person_fodselsnummer IF NOT EXISTS FOR (p:Person) REQUIRE p.fodselsnummer IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT person_epost IF NOT EXISTS FOR (p:Person) REQUIRE p.epost IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT dokumentasjon_id IF NOT EXISTS FOR (d:Dokumentasjon) REQUIRE d.id IS UNIQUE'
      );

      // Regelsett-komponenter
      await session.run(
        'CREATE CONSTRAINT regelsettmal_id IF NOT EXISTS FOR (rm:RegelsettMal) REQUIRE rm.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT regelsett_id IF NOT EXISTS FOR (r:Regelsett) REQUIRE r.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT grunnlag_id IF NOT EXISTS FOR (g:Grunnlag) REQUIRE g.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT kravelement_id IF NOT EXISTS FOR (ke:Kravelement) REQUIRE ke.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT kvotetype_id IF NOT EXISTS FOR (kt:KvoteType) REQUIRE kt.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT rangeringtype_id IF NOT EXISTS FOR (rt:RangeringType) REQUIRE rt.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT grunnlagimplementering_id IF NOT EXISTS FOR (gi:GrunnlagImplementering) REQUIRE gi.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT kravimplementering_id IF NOT EXISTS FOR (ki:KravImplementering) REQUIRE ki.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT kvoteimplementering_id IF NOT EXISTS FOR (ki:KvoteImplementering) REQUIRE ki.id IS UNIQUE'
      );
      await session.run(
        'CREATE CONSTRAINT rangeringimplementering_id IF NOT EXISTS FOR (ri:RangeringImplementering) REQUIRE ri.id IS UNIQUE'
      );

      console.log('✅ Alle constraints opprettet');
    } catch (error) {
      console.error('❌ Feil ved oppsett av constraints:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  static async getDatabaseStats() {
    const session = getSession();

    try {
      console.log('📊 Henter database statistikk...\n');

      // Count alle node-typer
      const nodeTypes = [
        'Fagkode',
        'Faggruppe',
        'Institusjon',
        'Utdanningstilbud',
        'Opptak',
        'Person',
        'Søknad',
        'Dokumentasjon',
        'RegelsettMal',
        'Regelsett',
        'Grunnlag',
        'Kravelement',
        'KvoteType',
        'RangeringType',
        'GrunnlagImplementering',
        'KravImplementering',
        'KvoteImplementering',
        'RangeringImplementering',
      ];

      for (const nodeType of nodeTypes) {
        const result = await session.run(`MATCH (n:${nodeType}) RETURN count(n) as count`);
        const count = result.records[0]?.get('count').toNumber() || 0;
        if (count > 0) {
          console.log(`   ${nodeType}: ${count}`);
        }
      }

      // Count relasjoner
      const relResult = await session.run('MATCH ()-[r]->() RETURN count(r) as count');
      const relCount = relResult.records[0]?.get('count').toNumber() || 0;
      console.log(`\n   Totalt antall relasjoner: ${relCount}`);

      // Vis constraints
      const constraintsResult = await session.run('SHOW CONSTRAINTS');
      const constraintCount = constraintsResult.records.length;
      console.log(`   Constraints: ${constraintCount}`);

      console.log('\n📊 Database statistikk hentet!');
    } catch (error) {
      console.error('❌ Feil ved henting av statistikk:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  static async fullReset() {
    console.log('🔄 Starter full database reset og seeding...\n');

    try {
      // 1. Reset database
      await this.resetDatabase();

      // 2. Setup constraints
      await this.setupConstraints();

      // 3. Seed all data
      await seedAll();

      // 4. Vis statistikk
      console.log('\n');
      await this.getDatabaseStats();

      console.log('\n🎉 Full reset og seeding fullført!');
    } catch (error) {
      console.error('❌ Feil under full reset:', error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'reset':
        await DatabaseAdmin.resetDatabase();
        break;

      case 'constraints':
        await DatabaseAdmin.setupConstraints();
        break;

      case 'stats':
        await DatabaseAdmin.getDatabaseStats();
        break;

      case 'full-reset':
        await DatabaseAdmin.fullReset();
        break;

      default:
        console.log(`
🗄️ Database Admin Tool

Tilgjengelige kommandoer:
  reset       - Slett all data og constraints
  constraints - Sett opp alle constraints
  stats       - Vis database statistikk
  full-reset  - Full reset + constraints + seeding

Bruk: npm run db:admin <kommando>
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Kommando feilet:', error);
    process.exit(1);
  }
}

// Kjør CLI hvis scriptet kalles direkte
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default DatabaseAdmin;
