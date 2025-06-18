import { NextRequest, NextResponse } from 'next/server';
import { Neo4jDatabase } from '@/lib/neo4j';

const db = new Neo4jDatabase({
  uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'grafopptak123',
});

export async function GET() {
  try {
    const result = await db.runQuery(
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
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { navn, type, formelMal, beskrivelse } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await db.runQuery(
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
  }
}