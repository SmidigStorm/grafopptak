import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/faggrupper/route';
import { createTestFaggruppe, getTestData } from '../setup.js';

const createMockRequest = (method: string, body?: any) => {
  return {
    method,
    json: async () => body,
    url: 'http://localhost:3000/api/faggrupper',
  } as NextRequest;
};

describe('Faggrupper API', () => {
  describe('GET /api/faggrupper', () => {
    it('should return seeded faggrupper with fagkode counts', async () => {
      const request = createMockRequest('GET');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(4); // From seed: math R1, math R2, norsk, realfag

      const faggruppeMathR1 = data.find((fg) => fg.navn === 'Matematikk R1-nivå');
      const faggruppeMathR2 = data.find((fg) => fg.navn === 'Matematikk R2-nivå');
      const faggruppeNorsk = data.find((fg) => fg.navn === 'Norsk 393 timer');
      const faggruppeRealfag = data.find((fg) => fg.navn === 'Realfag valgfritt');

      expect(faggruppeMathR1).toBeDefined();
      expect(faggruppeMathR2).toBeDefined();
      expect(faggruppeNorsk).toBeDefined();
      expect(faggruppeRealfag).toBeDefined();

      // Check fagkode counts from seed
      expect(faggruppeMathR1.antallFagkoder).toBe(4);
      expect(faggruppeMathR2.antallFagkoder).toBe(2);
      expect(faggruppeNorsk.antallFagkoder).toBe(2);
      expect(faggruppeRealfag.antallFagkoder).toBe(6);
    });
  });

  describe('POST /api/faggrupper', () => {
    it('should create a new faggruppe', async () => {
      const newFaggruppe = {
        navn: 'Test Faggruppe',
        beskrivelse: 'En test faggruppe',
      };

      const request = createMockRequest('POST', newFaggruppe);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.navn).toBe('Test Faggruppe');
      expect(data.beskrivelse).toBe('En test faggruppe');
    });

    it('should return 400 if navn already exists', async () => {
      const newFaggruppe = {
        navn: 'Matematikk R1-nivå', // Already exists in seed
        beskrivelse: 'Duplicate',
      };

      const request = createMockRequest('POST', newFaggruppe);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('eksisterer allerede');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidFaggruppe = {
        beskrivelse: 'Missing navn',
      };

      const request = createMockRequest('POST', invalidFaggruppe);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
