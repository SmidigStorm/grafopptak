import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (pt:PoengType)
      RETURN pt
      ORDER BY pt.type, pt.navn
      `
    );

    const poengtyper = result.records.map((record: any) => record.get('pt').properties);

    return NextResponse.json(poengtyper);
  } catch (error) {
    console.error('Feil ved henting av poengtypene:', error);
    return NextResponse.json({ error: 'Feil ved henting av poengtypene' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, beskrivelse, beregningsmåte } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (pt:PoengType {
        id: randomUUID(),
        navn: $navn,
        type: $type,
        beskrivelse: $beskrivelse,
        beregningsmåte: $beregningsmåte,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN pt
      `,
      { navn, type, beskrivelse: beskrivelse || '', beregningsmåte: beregningsmåte || '' }
    );

    const poengtype = result.records[0].get('pt').properties;

    return NextResponse.json(poengtype, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av poengtype:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av poengtype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
