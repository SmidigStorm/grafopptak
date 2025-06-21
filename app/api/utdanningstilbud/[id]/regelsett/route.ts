import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: utdanningstilbudId } = await params;
  const session = getSession();

  try {
    // Hent alle regelsett knyttet til utdanningstilbudet
    const query = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})-[:HAR_REGELSETT]->(r:Regelsett)
      RETURN r.id as id, r.navn as navn, r.beskrivelse as beskrivelse, r.type as type
      ORDER BY r.navn
    `;

    const result = await session.run(query, { utdanningstilbudId });
    const regelsett = result.records.map((record) => ({
      id: record.get('id'),
      navn: record.get('navn'),
      beskrivelse: record.get('beskrivelse'),
      type: record.get('type'),
    }));

    return NextResponse.json(regelsett);
  } catch (error) {
    console.error('Error fetching regelsett for utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to fetch regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: utdanningstilbudId } = await params;
  const session = getSession();

  try {
    const { regelsettId } = await request.json();

    if (!regelsettId) {
      return NextResponse.json({ error: 'regelsettId is required' }, { status: 400 });
    }

    // Sjekk at både utdanningstilbud og regelsett eksisterer
    const checkQuery = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})
      MATCH (r:Regelsett {id: $regelsettId})
      RETURN u, r
    `;

    const checkResult = await session.run(checkQuery, { utdanningstilbudId, regelsettId });
    if (checkResult.records.length === 0) {
      return NextResponse.json(
        { error: 'Utdanningstilbud eller regelsett ikke funnet' },
        { status: 404 }
      );
    }

    // Sjekk om utdanningstilbudet allerede har et regelsett
    const existingRegelssettQuery = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})-[:HAR_REGELSETT]->(r:Regelsett)
      RETURN r.navn as navn
    `;

    const existingRegelssettResult = await session.run(existingRegelssettQuery, {
      utdanningstilbudId,
    });
    if (existingRegelssettResult.records.length > 0) {
      const eksisterendeRegelsett = existingRegelssettResult.records[0].get('navn');
      return NextResponse.json(
        {
          error: `Utdanningstilbudet har allerede regelsett "${eksisterendeRegelsett}". Ett utdanningstilbud kan bare ha ett regelsett.`,
        },
        { status: 409 }
      );
    }

    // Opprett relasjonen
    const createQuery = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})
      MATCH (r:Regelsett {id: $regelsettId})
      CREATE (u)-[:HAR_REGELSETT]->(r)
      RETURN r.id as id, r.navn as navn, r.beskrivelse as beskrivelse, r.type as type
    `;

    const createResult = await session.run(createQuery, { utdanningstilbudId, regelsettId });
    const regelsett = createResult.records[0];

    return NextResponse.json({
      message: 'Regelsett knyttet til utdanningstilbud',
      regelsett: {
        id: regelsett.get('id'),
        navn: regelsett.get('navn'),
        beskrivelse: regelsett.get('beskrivelse'),
        type: regelsett.get('type'),
      },
    });
  } catch (error) {
    console.error('Error connecting regelsett to utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to connect regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}
