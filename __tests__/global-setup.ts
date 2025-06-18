// Global setup - runs once before all tests
import { Neo4jDatabase } from '../lib/neo4j.js';

const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

export default async function globalSetup() {
  console.log('🚀 Starting global test setup...');

  // Prevent running in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot run tests in production environment!');
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEO4J_URI = process.env.NEO4J_TEST_URI || 'bolt://localhost:7687';
  process.env.NEO4J_USER = process.env.NEO4J_TEST_USER || 'neo4j';
  process.env.NEO4J_PASSWORD = process.env.NEO4J_TEST_PASSWORD || 'grafopptak123';

  try {
    // Connect to test database
    await testDb.verifyConnectivity();
    console.log('✅ Connected to test database');

    // Import database admin
    const { DatabaseAdmin } = await import('../scripts/db-admin.js');

    // Do full reset: clear data + constraints, set up constraints, then seed
    console.log('🗄️ Resetting test database...');
    await DatabaseAdmin.resetDatabase();
    await DatabaseAdmin.setupConstraints();

    // Import and run seed
    const { seedAll } = await import('../scripts/seed-all.js');
    await seedAll();

    console.log('✅ Global test database setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  } finally {
    // Close the setup connection
    await testDb.close();
  }
}
