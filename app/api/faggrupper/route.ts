import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/faggrupper - Hent alle faggrupper
export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (fg:Faggruppe)
      OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg)
      RETURN fg, count(fk) as antallFagkoder
      ORDER BY fg.navn
    `);

    const faggrupper = result.records.map((record) => {
      const faggruppe = record.get('fg').properties;
      const antallFagkoder = record.get('antallFagkoder').toNumber();

      return {
        ...faggruppe,
        antallFagkoder,
      };
    });

    return NextResponse.json(faggrupper);
  } catch (error) {
    console.error('Error fetching faggrupper:', error);
    return NextResponse.json({ error: 'Failed to fetch faggrupper' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/faggrupper - Opprett ny faggruppe
export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, beskrivelse, type } = body;

    // Valider required fields
    if (!navn) {
      return NextResponse.json({ error: 'Navn is required' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (fg:Faggruppe {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        type: $type,
        aktiv: true
      })
      RETURN fg
    `,
      {
        navn,
        beskrivelse: beskrivelse || null,
        type: type || null,
      }
    );

    const faggruppe = result.records[0].get('fg').properties;

    return NextResponse.json(faggruppe, { status: 201 });
  } catch (error) {
    console.error('Error creating faggruppe:', error);
    return NextResponse.json({ error: 'Failed to create faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}
