import { getSession } from '../../../lib/neo4j';

/**
 * Seeder dokumentasjon og karakterdata for eksisterende søkere
 * Krever at søkere og fagkoder allerede eksisterer
 */
export async function seedDokumentasjon() {
  const session = getSession();

  try {
    console.log('📄 Oppretter dokumentasjon og karakterdata...');

    // Dette kaller seed-karakterer.ts funksjonen som allerede eksisterer
    const { seedKarakterer } = await import('../../seed-karakterer');
    await seedKarakterer();

    console.log('✅ Opprettet dokumentasjon og karakterdata');
  } finally {
    await session.close();
  }
}

/**
 * Fjerner all dokumentasjon og karakterdata
 */
export async function clearDokumentasjon() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Dokumentasjon) DETACH DELETE n`);
    await session.run(`MATCH (n:Søknad) DETACH DELETE n`);
    console.log('🗑️ Slettet dokumentasjon og karakterdata');
  } finally {
    await session.close();
  }
}
