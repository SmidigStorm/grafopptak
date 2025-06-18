import { Neo4jDatabase } from '../../lib/neo4j.js';

const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

describe('Neo4j Database Connection', () => {
  it('should connect to database successfully', async () => {
    await expect(testDb.verifyConnectivity()).resolves.not.toThrow();
  });

  it('should execute basic queries', async () => {
    const result = await testDb.runQuery('RETURN 1 as number');
    expect(result.records).toHaveLength(1);
    expect(result.records[0].get('number').toNumber()).toBe(1);
  });

  it('should handle parameterized queries', async () => {
    const result = await testDb.runQuery('RETURN $name as name, $age as age', {
      name: 'Test',
      age: 25,
    });

    expect(result.records).toHaveLength(1);
    expect(result.records[0].get('name')).toBe('Test');
    expect(result.records[0].get('age')).toBe(25);
  });

  it('should create and retrieve nodes', async () => {
    // Create
    await testDb.runQuery(`
      CREATE (t:TestNode {
        id: 'test-123',
        name: 'Test Node',
        created: datetime()
      })
    `);

    // Retrieve
    const result = await testDb.runQuery(`
      MATCH (t:TestNode {id: 'test-123'})
      RETURN t
    `);

    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('t');
    expect(node.properties.name).toBe('Test Node');
    expect(node.properties.id).toBe('test-123');
  });

  it('should handle transactions', async () => {
    const session = testDb.session();

    try {
      const txc = session.beginTransaction();

      await txc.run(`
        CREATE (t1:TestTransaction {id: 'tx-1'})
        CREATE (t2:TestTransaction {id: 'tx-2'})
      `);

      await txc.commit();

      // Verify both nodes exist
      const result = await testDb.runQuery(`
        MATCH (t:TestTransaction)
        RETURN count(t) as count
      `);

      expect(result.records[0].get('count').toNumber()).toBe(2);
    } finally {
      await session.close();
    }
  });
});
