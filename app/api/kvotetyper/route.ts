import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (kt:KvoteType)
      RETURN kt
      ORDER BY kt.navn
      `
    );

    const kvotetyper = result.records.map((record: any) => record.get('kt').properties);

    return NextResponse.json(kvotetyper);
  } catch (error) {
    console.error('Feil ved henting av kvotetyper:', error);
    return NextResponse.json({ error: 'Feil ved henting av kvotetyper' }, { status: 500 });
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
      CREATE (kt:KvoteType {
        id: randomUUID(),
        navn: $navn,
        type: $type,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN kt
      `,
      { navn, type, beskrivelse: beskrivelse || '' }
    );

    const kvotetype = result.records[0].get('kt').properties;

    return NextResponse.json(kvotetype, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av kvotetype:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av kvotetype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
