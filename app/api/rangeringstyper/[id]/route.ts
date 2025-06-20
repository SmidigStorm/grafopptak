import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession();

  try {
    const { id } = await params;

    const result = await session.run(
      `
      MATCH (rt:RangeringType {id: $id})
      OPTIONAL MATCH (rt)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt, collect(pt) as poengTyper
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Rangeringstype ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const rangeringstype = {
      ...record.get('rt').properties,
      poengTyper: record
        .get('poengTyper')
        .map((pt: any) => pt.properties)
        .filter((pt: any) => pt.id),
    };

    return NextResponse.json(rangeringstype);
  } catch (error) {
    console.error('Feil ved henting av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved henting av rangeringstype' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, beskrivelse, aktiv, poengTypeIds = [] } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (rt:RangeringType {id: $id})
      SET rt.navn = $navn,
          rt.type = $type,
          rt.beskrivelse = $beskrivelse,
          rt.aktiv = $aktiv,
          rt.sistEndret = datetime()
      WITH rt
      // Slett eksisterende PoengType-relasjoner
      OPTIONAL MATCH (rt)-[r:INKLUDERER_POENGTYPE]->()
      DELETE r
      WITH rt
      // Opprett nye PoengType-relasjoner
      UNWIND $poengTypeIds as poengTypeId
      MATCH (pt:PoengType {id: poengTypeId})
      CREATE (rt)-[:INKLUDERER_POENGTYPE]->(pt)
      WITH rt
      // Returner med PoengTyper
      OPTIONAL MATCH (rt)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt, collect(pt) as poengTyper
      `,
      {
        id,
        navn,
        type,
        beskrivelse: beskrivelse || '',
        aktiv: aktiv ?? true,
        poengTypeIds,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Rangeringstype ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const rangeringstype = {
      ...record.get('rt').properties,
      poengTyper: record
        .get('poengTyper')
        .map((pt: any) => pt.properties)
        .filter((pt: any) => pt.id),
    };

    return NextResponse.json(rangeringstype);
  } catch (error) {
    console.error('Feil ved oppdatering av rangeringstype:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av rangeringstype' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    // Sjekk om rangeringstypen er i bruk
    const usageCheck = await session.run(
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

    const result = await session.run(
      `
      MATCH (rt:RangeringType {id: $id})
      OPTIONAL MATCH (rt)-[r:INKLUDERER_POENGTYPE]->()
      DELETE r, rt
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
  } finally {
    await session.close();
  }
}
