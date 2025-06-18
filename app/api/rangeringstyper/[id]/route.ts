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
      MATCH (rt:RangeringType {id: $id})
      RETURN rt
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Rangeringstype ikke funnet' }, { status: 404 });
    }

    const rangeringstype = result.records[0].get('rt').properties;

    return NextResponse.json(rangeringstype);
  } catch (error) {
    console.error('Feil ved henting av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved henting av rangeringstype' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { navn, type, formelMal, beskrivelse, aktiv } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await db.runQuery(
      `
      MATCH (rt:RangeringType {id: $id})
      SET rt.navn = $navn,
          rt.type = $type,
          rt.formelMal = $formelMal,
          rt.beskrivelse = $beskrivelse,
          rt.aktiv = $aktiv,
          rt.sistEndret = datetime()
      RETURN rt
      `,
      { id, navn, type, formelMal: formelMal || '', beskrivelse: beskrivelse || '', aktiv: aktiv ?? true }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Rangeringstype ikke funnet' }, { status: 404 });
    }

    const rangeringstype = result.records[0].get('rt').properties;

    return NextResponse.json(rangeringstype);
  } catch (error) {
    console.error('Feil ved oppdatering av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av rangeringstype' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Sjekk om rangeringstypen er i bruk
    const usageCheck = await db.runQuery(
      `
      MATCH (rt:RangeringType {id: $id})
      OPTIONAL MATCH (rt)-[r]-()
      RETURN count(r) as relationshipCount
      `,
      { id }
    );

    const relationshipCount = usageCheck.records[0]?.get('relationshipCount')?.toNumber() || 0;

    if (relationshipCount > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette rangeringstype som er i bruk' },
        { status: 400 }
      );
    }

    const result = await db.runQuery(
      `
      MATCH (rt:RangeringType {id: $id})
      DELETE rt
      RETURN count(rt) as deletedCount
      `,
      { id }
    );

    const deletedCount = result.records[0]?.get('deletedCount')?.toNumber() || 0;

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Rangeringstype ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Rangeringstype slettet' });
  } catch (error) {
    console.error('Feil ved sletting av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved sletting av rangeringstype' }, { status: 500 });
  }
}