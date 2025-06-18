import { NextRequest, NextResponse } from 'next/server';
import { Neo4jDatabase } from '@/lib/neo4j';

const db = new Neo4jDatabase({
  uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  user: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'grafopptak123',
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await db.runQuery(
      `
      MATCH (g:Grunnlag {id: $id})
      RETURN g
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Grunnlag ikke funnet' }, { status: 404 });
    }

    const grunnlag = result.records[0].get('g').properties;

    return NextResponse.json(grunnlag);
  } catch (error) {
    console.error('Feil ved henting av grunnlag:', error);
    return NextResponse.json({ error: 'Feil ved henting av grunnlag' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { navn, type, beskrivelse, aktiv } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await db.runQuery(
      `
      MATCH (g:Grunnlag {id: $id})
      SET g.navn = $navn,
          g.type = $type,
          g.beskrivelse = $beskrivelse,
          g.aktiv = $aktiv,
          g.sistEndret = datetime()
      RETURN g
      `,
      { id, navn, type, beskrivelse: beskrivelse || '', aktiv: aktiv ?? true }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Grunnlag ikke funnet' }, { status: 404 });
    }

    const grunnlag = result.records[0].get('g').properties;

    return NextResponse.json(grunnlag);
  } catch (error) {
    console.error('Feil ved oppdatering av grunnlag:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av grunnlag' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Sjekk om grunnlaget er i bruk
    const usageCheck = await db.runQuery(
      `
      MATCH (g:Grunnlag {id: $id})
      OPTIONAL MATCH (g)-[r]-()
      RETURN count(r) as relationshipCount
      `,
      { id }
    );

    const relationshipCount = usageCheck.records[0]?.get('relationshipCount')?.toNumber() || 0;

    if (relationshipCount > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette grunnlag som er i bruk' },
        { status: 400 }
      );
    }

    const result = await db.runQuery(
      `
      MATCH (g:Grunnlag {id: $id})
      DELETE g
      RETURN count(g) as deletedCount
      `,
      { id }
    );

    const deletedCount = result.records[0]?.get('deletedCount')?.toNumber() || 0;

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Grunnlag ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grunnlag slettet' });
  } catch (error) {
    console.error('Feil ved sletting av grunnlag:', error);
    return NextResponse.json({ error: 'Feil ved sletting av grunnlag' }, { status: 500 });
  }
}