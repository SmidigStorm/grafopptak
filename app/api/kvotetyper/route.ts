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
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { navn, type, beskrivelse } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await db.runQuery(
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
  }
}