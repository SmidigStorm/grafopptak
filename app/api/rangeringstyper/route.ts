import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (rt:RangeringType)
      OPTIONAL MATCH (rt)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt, collect(pt) as poengTyper
      ORDER BY rt.navn
      `
    );

    const rangeringstyper = result.records.map((record: any) => ({
      ...record.get('rt').properties,
      poengTyper: record
        .get('poengTyper')
        .map((pt: any) => pt.properties)
        .filter((pt: any) => pt.id),
    }));

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
    const { navn, type, formelMal, beskrivelse, poengTypeIds = [] } = body;

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
      WITH rt
      UNWIND $poengTypeIds as poengTypeId
      MATCH (pt:PoengType {id: poengTypeId})
      CREATE (rt)-[:INKLUDERER_POENGTYPE]->(pt)
      WITH rt
      OPTIONAL MATCH (rt)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt, collect(pt) as poengTyper
      `,
      { navn, type, formelMal: formelMal || '', beskrivelse: beskrivelse || '', poengTypeIds }
    );

    const record = result.records[0];
    const rangeringstype = {
      ...record.get('rt').properties,
      poengTyper: record
        .get('poengTyper')
        .map((pt: any) => pt.properties)
        .filter((pt: any) => pt.id),
    };

    return NextResponse.json(rangeringstype, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av rangeringstype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
