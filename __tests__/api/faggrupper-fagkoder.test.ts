import { NextRequest } from 'next/server';
import { POST, DELETE } from '@/app/api/faggrupper/[id]/fagkoder/route';
import { Neo4jDatabase } from '../../lib/neo4j.js';

const testDb = new Neo4jDatabase({
  uri: process.env.NEO4J_TEST_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_TEST_USER || 'neo4j',
  password: process.env.NEO4J_TEST_PASSWORD || 'grafopptak123',
});

// Mock NextRequest helper
const createMockRequest = (method: string, body?: any) => {
  return {
    method,
    json: async () => body,
    url: 'http://localhost:3000/api/faggrupper/test-id/fagkoder',
  } as NextRequest;
};

// Test utilities
const createTestFaggruppe = async (navn: string) => {
  const result = await testDb.runQuery(
    `
    CREATE (fg:Faggruppe {
      id: randomUUID(),
      navn: $navn,
      beskrivelse: 'Test beskrivelse',
      aktiv: true
    })
    RETURN fg
    `,
    { navn }
  );
  return result.records[0].get('fg').properties;
};

const createTestFagkode = async (kode: string, navn: string) => {
  const result = await testDb.runQuery(
    `
    CREATE (fk:Fagkode {
      id: randomUUID(),
      kode: $kode,
      navn: $navn,
      beskrivelse: 'Test beskrivelse',
      aktiv: true
    })
    RETURN fk
    `,
    { kode, navn }
  );
  return result.records[0].get('fk').properties;
};

describe('Faggrupper-Fagkoder API', () => {
  describe('POST /api/faggrupper/[id]/fagkoder', () => {
    it('should link fagkode to faggruppe', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe for Linking');
      const fagkode = await createTestFagkode('TEST123', 'Test Fagkode for Linking');

      const request = createMockRequest('POST', { fagkodeId: fagkode.id });
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await POST(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.fagkode.id).toBe(fagkode.id);
      expect(data.faggruppe.id).toBe(faggruppe.id);
      expect(data.relasjon).toBeDefined();
    });

    it('should return 400 if fagkodeId is missing', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe Missing ID');
      const request = createMockRequest('POST', {});
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await POST(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('fagkodeId is required');
    });

    it('should return 404 if faggruppe does not exist', async () => {
      // Arrange
      const fagkode = await createTestFagkode('TEST404', 'Test Fagkode 404');
      const request = createMockRequest('POST', { fagkodeId: fagkode.id });
      const params = Promise.resolve({ id: 'non-existent-id' });

      // Act
      const response = await POST(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Faggruppe or fagkode not found');
    });

    it('should return 404 if fagkode does not exist', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe 404');
      const request = createMockRequest('POST', { fagkodeId: 'non-existent-fagkode-id' });
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await POST(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Faggruppe or fagkode not found');
    });
  });

  describe('DELETE /api/faggrupper/[id]/fagkoder', () => {
    it('should unlink fagkode from faggruppe', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe for Unlinking');
      const fagkode = await createTestFagkode('UNLINK123', 'Test Fagkode for Unlinking');

      // First link them
      await testDb.runQuery(
        `
        MATCH (fg:Faggruppe {id: $faggruppeId})
        MATCH (fk:Fagkode {id: $fagkodeId})
        CREATE (fk)-[:KVALIFISERER_FOR]->(fg)
        `,
        { faggruppeId: faggruppe.id, fagkodeId: fagkode.id }
      );

      const request = {
        method: 'DELETE',
        url: `http://localhost:3000/api/faggrupper/${faggruppe.id}/fagkoder?fagkodeId=${fagkode.id}`,
      } as NextRequest;
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Relationship deleted successfully');
    });

    it('should return 400 if fagkodeId query parameter is missing', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe Missing Query');
      const request = {
        method: 'DELETE',
        url: `http://localhost:3000/api/faggrupper/${faggruppe.id}/fagkoder`,
      } as NextRequest;
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('fagkodeId is required as query parameter');
    });

    it('should return 404 if relationship does not exist', async () => {
      // Arrange
      const faggruppe = await createTestFaggruppe('Test Faggruppe No Relation');
      const fagkode = await createTestFagkode('NOREL123', 'Test Fagkode No Relation');

      const request = {
        method: 'DELETE',
        url: `http://localhost:3000/api/faggrupper/${faggruppe.id}/fagkoder?fagkodeId=${fagkode.id}`,
      } as NextRequest;
      const params = Promise.resolve({ id: faggruppe.id });

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Relationship not found');
    });
  });
});
