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
  }
}