import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (ke:Kravelement)
      RETURN ke
      ORDER BY ke.navn
    `);

    const kravelementer = result.records.map((record: any) => record.get('ke').properties);

    return NextResponse.json(kravelementer);
  } catch (error) {
    console.error('Feil ved henting av kravelementer:', error);
    return NextResponse.json({ error: 'Feil ved henting av kravelementer' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, beskrivelse } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (ke:Kravelement {
        id: randomUUID(),
        navn: $navn,
        type: $type,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN ke
    `,
      { navn, type, beskrivelse: beskrivelse || '' }
    );

    const kravelement = result.records[0].get('ke').properties;

    return NextResponse.json(kravelement, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av kravelement:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av kravelement' }, { status: 500 });
  } finally {
    await session.close();
  }
}
