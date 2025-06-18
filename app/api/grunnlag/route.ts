import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (g:Grunnlag)
      RETURN g
      ORDER BY g.navn
      `
    );

    const grunnlag = result.records.map((record: any) => record.get('g').properties);

    return NextResponse.json(grunnlag);
  } catch (error) {
    console.error('Feil ved henting av grunnlag:', error);
    return NextResponse.json({ error: 'Feil ved henting av grunnlag' }, { status: 500 });
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
      CREATE (g:Grunnlag {
        id: randomUUID(),
        navn: $navn,
        type: $type,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN g
      `,
      { navn, type, beskrivelse: beskrivelse || '' }
    );

    const grunnlag = result.records[0].get('g').properties;

    return NextResponse.json(grunnlag, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av grunnlag:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av grunnlag' }, { status: 500 });
  } finally {
    await session.close();
  }
}
