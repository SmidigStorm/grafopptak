import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/fagkoder/route';
import { Neo4jDatabase } from '../../lib/neo4j.js';

const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

const getTestData = async (type: string) => {
  const label = type === 'faggrupper' ? 'Faggruppe' : 'Fagkode';
  const result = await testDb.runQuery(`MATCH (n:${label}) RETURN n`);
  return result.records.map((record) => record.get('n').properties);
};

// Mock NextRequest helper
const createMockRequest = (method: string, body?: any) => {
  return {
    method,
    json: async () => body,
    url: 'http://localhost:3000/api/fagkoder',
  } as NextRequest;
};

describe('Fagkoder API', () => {
  describe('GET /api/fagkoder', () => {
    it('should return all seeded fagkoder with their faggrupper', async () => {
      const request = createMockRequest('GET');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(14); // From seed: 14 fagkoder total

      // Check that fagkoder have expected properties
      expect(data[0]).toHaveProperty('kode');
      expect(data[0]).toHaveProperty('navn');
      expect(data[0]).toHaveProperty('faggrupper');

      // Check that some expected fagkoder exist
      const rea3022 = data.find((fk) => fk.kode === 'REA3022');
      const rea3024 = data.find((fk) => fk.kode === 'REA3024');

      expect(rea3022).toBeDefined();
      expect(rea3022.navn).toBe('Matematikk R1');
      expect(rea3024).toBeDefined();
      expect(rea3024.navn).toBe('Matematikk R2');
    });
  });

  describe('POST /api/fagkoder', () => {
    it('should create a new fagkode', async () => {
      // Get any existing faggruppe from seed
      const faggrupper = await getTestData('faggrupper');
      expect(faggrupper.length).toBeGreaterThan(0);

      const anyFaggruppe = faggrupper[0];

      const newFagkode = {
        kode: 'TEST001',
        navn: 'Test Fagkode',
        beskrivelse: 'En test fagkode',
        faggruppe_id: anyFaggruppe.id,
      };

      const request = createMockRequest('POST', newFagkode);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.kode).toBe('TEST001');
      expect(data.navn).toBe('Test Fagkode');
    });

    it('should return 400 if kode already exists', async () => {
      // Get any existing faggruppe from seed
      const faggrupper = await getTestData('faggrupper');
      expect(faggrupper.length).toBeGreaterThan(0);

      const anyFaggruppe = faggrupper[0];

      const newFagkode = {
        kode: 'REA3022', // Already exists in seed
        navn: 'Duplicate',
        beskrivelse: 'Test duplicate',
        faggruppe_id: anyFaggruppe.id,
      };

      const request = createMockRequest('POST', newFagkode);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('eksisterer allerede');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidFagkode = {
        navn: 'Missing kode',
        beskrivelse: 'Test',
      };

      const request = createMockRequest('POST', invalidFagkode);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
