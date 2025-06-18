import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (rt:RangeringType)
      RETURN rt
      ORDER BY rt.navn
      `
    );

    const rangeringstyper = result.records.map((record: any) => record.get('rt').properties);

    return NextResponse.json(rangeringstyper);
  } catch (error) {
    console.error('Feil ved henting av rangeringstyper:', error);
    return NextResponse.json({ error: 'Feil ved henting av rangeringstyper' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, formelMal, beskrivelse } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (rt:RangeringType {
        id: randomUUID(),
        navn: $navn,
        type: $type,
        formelMal: $formelMal,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN rt
      `,
      { navn, type, formelMal: formelMal || '', beskrivelse: beskrivelse || '' }
    );

    const rangeringstype = result.records[0].get('rt').properties;

    return NextResponse.json(rangeringstype, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av rangeringstype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
