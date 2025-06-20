import { NextRequest } from 'next/server';
import { Neo4jDatabase } from '../../lib/neo4j.js';

const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

// Mock NextRequest helper
const createMockRequest = (method: string, body?: any, url?: string) => {
  return {
    method,
    json: async () => body,
    url: url || 'http://localhost:3000/api/opptaksveier',
  } as NextRequest;
};

// Helper functions for test data
const createTestRegelsett = async () => {
  const result = await testDb.runQuery(`
    CREATE (r:Regelsett {
      id: randomUUID(),
      navn: 'Test Regelsett',
      versjon: '1.0',
      gyldigFra: date('2024-01-01'),
      aktiv: true,
      opprettet: datetime()
    })
    RETURN r
  `);
  return result.records[0].get('r').properties;
};

const createTestStandardComponents = async () => {
  // Create test grunnlag
  const grunnlagResult = await testDb.runQuery(`
    CREATE (g:Grunnlag {
      id: 'test-grunnlag',
      navn: 'Test Grunnlag',
      beskrivelse: 'Test grunnlag for testing'
    })
    RETURN g
  `);

  // Create test kravelementer
  await testDb.runQuery(`
    CREATE (k1:Kravelement {
      id: 'test-krav-1',
      navn: 'Test Krav 1',
      beskrivelse: 'Første test krav'
    }),
    (k2:Kravelement {
      id: 'test-krav-2', 
      navn: 'Test Krav 2',
      beskrivelse: 'Andre test krav'
    })
  `);

  // Create test kvotetype
  await testDb.runQuery(`
    CREATE (kv:KvoteType {
      id: 'test-kvote',
      navn: 'Test Kvote',
      beskrivelse: 'Test kvote type'
    })
  `);

  // Create test rangeringstype
  await testDb.runQuery(`
    CREATE (rt:RangeringType {
      id: 'test-rangering',
      navn: 'Test Rangering',
      beskrivelse: 'Test rangering type'
    })
  `);

  return grunnlagResult.records[0].get('g').properties;
};

const cleanupTestData = async () => {
  await testDb.runQuery(`
    MATCH (n) 
    WHERE n.id STARTS WITH 'test-' OR n.navn CONTAINS 'Test'
    DETACH DELETE n
  `);
};

describe('OpptaksVei API', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('POST /api/regelsett/[id]/opptaksveier', () => {
    it('should create a new opptaksvei in a regelsett', async () => {
      // Arrange
      const testRegelsett = await createTestRegelsett();
      await createTestStandardComponents();

      const newOpptaksVei = {
        navn: 'Test OpptaksVei',
        beskrivelse: 'En test opptaksvei',
        grunnlagId: 'test-grunnlag',
        kravIds: ['test-krav-1', 'test-krav-2'],
        kvoteId: 'test-kvote',
        rangeringId: 'test-rangering',
        aktiv: true,
      };

      // Mock the POST function (we'll implement this)
      const { POST } = await import('@/app/api/regelsett/[id]/opptaksveier/route');
      const request = createMockRequest('POST', newOpptaksVei);
      const mockParams = Promise.resolve({ id: testRegelsett.id });

      // Act
      const response = await POST(request, { params: mockParams });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.navn).toBe('Test OpptaksVei');
      expect(data.grunnlag).toBe('test-grunnlag');
      expect(data.krav).toEqual(['test-krav-1', 'test-krav-2']);
      expect(data.kvote).toBe('test-kvote');
      expect(data.rangering).toBe('test-rangering');
    });

    it('should return 404 if regelsett does not exist', async () => {
      const newOpptaksVei = {
        navn: 'Test OpptaksVei',
        grunnlagId: 'test-grunnlag',
        kravIds: [],
        kvoteId: 'test-kvote',
        rangeringId: 'test-rangering',
      };

      const { POST } = await import('@/app/api/regelsett/[id]/opptaksveier/route');
      const request = createMockRequest('POST', newOpptaksVei);
      const mockParams = Promise.resolve({ id: 'non-existent-id' });

      const response = await POST(request, { params: mockParams });

      expect(response.status).toBe(404);
    });

    it('should return 400 if required fields are missing', async () => {
      const testRegelsett = await createTestRegelsett();

      const invalidOpptaksVei = {
        beskrivelse: 'Missing navn',
        // Missing navn, grunnlagId, kvoteId, rangeringId
      };

      const { POST } = await import('@/app/api/regelsett/[id]/opptaksveier/route');
      const request = createMockRequest('POST', invalidOpptaksVei);
      const mockParams = Promise.resolve({ id: testRegelsett.id });

      const response = await POST(request, { params: mockParams });

      expect(response.status).toBe(400);
    });

    it('should return 400 if referenced components do not exist', async () => {
      const testRegelsett = await createTestRegelsett();

      const invalidOpptaksVei = {
        navn: 'Test OpptaksVei',
        grunnlagId: 'non-existent-grunnlag',
        kravIds: ['non-existent-krav'],
        kvoteId: 'non-existent-kvote',
        rangeringId: 'non-existent-rangering',
      };

      const { POST } = await import('@/app/api/regelsett/[id]/opptaksveier/route');
      const request = createMockRequest('POST', invalidOpptaksVei);
      const mockParams = Promise.resolve({ id: testRegelsett.id });

      const response = await POST(request, { params: mockParams });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/opptaksveier/[id]', () => {
    it('should update an existing opptaksvei', async () => {
      // Arrange - Create test data
      const testRegelsett = await createTestRegelsett();
      await createTestStandardComponents();

      // Create an opptaksvei first
      const createResult = await testDb.runQuery(
        `
        MATCH (r:Regelsett {id: $regelsetId})
        CREATE (ov:OpptaksVei {
          id: randomUUID(),
          navn: 'Original OpptaksVei',
          aktiv: true,
          opprettet: datetime()
        })
        CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)
        RETURN ov
      `,
        { regelsetId: testRegelsett.id }
      );

      const opptaksVeiId = createResult.records[0].get('ov').properties.id;

      const updatedData = {
        navn: 'Updated OpptaksVei',
        beskrivelse: 'Updated beskrivelse',
        grunnlagId: 'test-grunnlag',
        kravIds: ['test-krav-1'],
        kvoteId: 'test-kvote',
        rangeringId: 'test-rangering',
        aktiv: false,
      };

      // Mock the PUT function
      const { PUT } = await import('@/app/api/opptaksveier/[id]/route');
      const request = createMockRequest('PUT', updatedData);
      const mockParams = Promise.resolve({ id: opptaksVeiId });

      // Act
      const response = await PUT(request, { params: mockParams });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.navn).toBe('Updated OpptaksVei');
      expect(data.aktiv).toBe(false);
    });

    it('should return 404 if opptaksvei does not exist', async () => {
      const updatedData = {
        navn: 'Updated OpptaksVei',
      };

      const { PUT } = await import('@/app/api/opptaksveier/[id]/route');
      const request = createMockRequest('PUT', updatedData);
      const mockParams = Promise.resolve({ id: 'non-existent-id' });

      const response = await PUT(request, { params: mockParams });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/opptaksveier/[id]', () => {
    it('should delete an opptaksvei', async () => {
      // Arrange
      const testRegelsett = await createTestRegelsett();

      const createResult = await testDb.runQuery(
        `
        MATCH (r:Regelsett {id: $regelsetId})
        CREATE (ov:OpptaksVei {
          id: randomUUID(),
          navn: 'To Be Deleted',
          aktiv: true,
          opprettet: datetime()
        })
        CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)
        RETURN ov
      `,
        { regelsetId: testRegelsett.id }
      );

      const opptaksVeiId = createResult.records[0].get('ov').properties.id;

      // Mock the DELETE function
      const { DELETE } = await import('@/app/api/opptaksveier/[id]/route');
      const request = createMockRequest('DELETE');
      const mockParams = Promise.resolve({ id: opptaksVeiId });

      // Act
      const response = await DELETE(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(204);

      // Verify deletion
      const verifyResult = await testDb.runQuery(
        `
        MATCH (ov:OpptaksVei {id: $id})
        RETURN count(ov) as count
      `,
        { id: opptaksVeiId }
      );

      expect(verifyResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('should return 404 if opptaksvei does not exist', async () => {
      const { DELETE } = await import('@/app/api/opptaksveier/[id]/route');
      const request = createMockRequest('DELETE');
      const mockParams = Promise.resolve({ id: 'non-existent-id' });

      const response = await DELETE(request, { params: mockParams });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/regelsett/[id] (with opptaksveier)', () => {
    it('should return regelsett with complete opptaksveier data', async () => {
      // Arrange
      const testRegelsett = await createTestRegelsett();
      await createTestStandardComponents();

      // Create opptaksvei with all relationships
      await testDb.runQuery(
        `
        MATCH (r:Regelsett {id: $regelsetId}),
              (g:Grunnlag {id: 'test-grunnlag'}),
              (k1:Kravelement {id: 'test-krav-1'}),
              (k2:Kravelement {id: 'test-krav-2'}),
              (kv:KvoteType {id: 'test-kvote'}),
              (rt:RangeringType {id: 'test-rangering'})
        CREATE (ov:OpptaksVei {
          id: randomUUID(),
          navn: 'Complete OpptaksVei',
          aktiv: true,
          opprettet: datetime()
        })
        CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)
        CREATE (ov)-[:BASERT_PÅ]->(g)
        CREATE (ov)-[:KREVER]->(k1)
        CREATE (ov)-[:KREVER]->(k2)
        CREATE (ov)-[:GIR_TILGANG_TIL]->(kv)
        CREATE (ov)-[:BRUKER_RANGERING]->(rt)
      `,
        { regelsetId: testRegelsett.id }
      );

      // Mock the existing GET function from regelsett API
      const { GET } = await import('@/app/api/regelsett/[id]/route');
      const request = createMockRequest('GET');
      const mockParams = Promise.resolve({ id: testRegelsett.id });

      // Act
      const response = await GET(request, { params: mockParams });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.opptaksVeier).toHaveLength(1);

      const opptaksVei = data.opptaksVeier[0];
      expect(opptaksVei.navn).toBe('Complete OpptaksVei');
      expect(opptaksVei.grunnlag).toBe('Test Grunnlag');
      expect(opptaksVei.krav).toEqual(expect.arrayContaining(['Test Krav 1', 'Test Krav 2']));
      expect(opptaksVei.kvote).toBe('Test Kvote');
      expect(opptaksVei.rangering).toBe('Test Rangering');
    });
  });
});
