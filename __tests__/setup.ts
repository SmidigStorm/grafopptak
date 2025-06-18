// Test setup and utilities
import { Neo4jDatabase } from '../lib/neo4j.js';

// Test database instance
const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

// Mock Next.js environment
process.env.NODE_ENV = 'test';
process.env.NEO4J_URI = process.env.NEO4J_TEST_URI || 'bolt://localhost:7687';
process.env.NEO4J_USER = process.env.NEO4J_TEST_USER || 'neo4j';
process.env.NEO4J_PASSWORD = process.env.NEO4J_TEST_PASSWORD || 'grafopptak123';

// Per-suite test setup
beforeAll(async () => {
  // Connect to test database (database is already reset by global setup)
  await testDb.verifyConnectivity();
  console.log('✅ Connected to test database');
});

afterAll(async () => {
  // Close database connection
  await testDb.close();
  console.log('✅ Closed test database connection');
});

// Reset database function
const resetDatabase = async () => {
  // Prevent running in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot run tests in production environment!');
  }

  // Import database admin directly
  const { DatabaseAdmin } = await import('../scripts/db-admin.js');

  try {
    // Do full reset: clear data + constraints, set up constraints, then seed
    await DatabaseAdmin.resetDatabase();
    await DatabaseAdmin.setupConstraints();

    // Import and run seed
    const { seedFagkoderAndFaggrupper } = await import('../scripts/seed-fagkoder.js');
    await seedFagkoderAndFaggrupper();

    console.log('✅ Test database reset complete');
  } catch (error) {
    console.error('❌ Failed to reset test database:', error);
    throw error;
  }
};

// Test utilities
const createTestFaggruppe = async (navn, beskrivelse = 'Test beskrivelse') => {
  const result = await testDb.runQuery(
    `
    CREATE (fg:Faggruppe {
      id: randomUUID(),
      navn: $navn,
      beskrivelse: $beskrivelse,
      aktiv: true,
      opprettet: datetime(),
      oppdatert: datetime()
    })
    RETURN fg
    `,
    { navn, beskrivelse }
  );
  return result.records[0].get('fg').properties;
};

const createTestFagkode = async (kode, navn, faggruppe_id) => {
  const result = await testDb.runQuery(
    `
    CREATE (fk:Fagkode {
      id: randomUUID(),
      kode: $kode,
      navn: $navn,
      beskrivelse: 'Test beskrivelse',
      aktiv: true,
      opprettet: datetime(),
      oppdatert: datetime()
    })
    RETURN fk
    `,
    { kode, navn }
  );

  const fagkode = result.records[0].get('fk').properties;

  // Link to faggruppe if provided
  if (faggruppe_id) {
    await testDb.runQuery(
      `
      MATCH (fk:Fagkode {id: $fagkode_id})
      MATCH (fg:Faggruppe {id: $faggruppe_id})
      CREATE (fk)-[:TILHØRER]->(fg)
      `,
      { fagkode_id: fagkode.id, faggruppe_id }
    );
  }

  return fagkode;
};

const getTestData = async (type) => {
  const label = type === 'fagkoder' ? 'Fagkode' : 'Faggruppe';
  const result = await testDb.runQuery(`MATCH (n:${label}) RETURN n`);
  return result.records.map((record) => record.get('n').properties);
};

export { testDb, createTestFaggruppe, createTestFagkode, getTestData };
