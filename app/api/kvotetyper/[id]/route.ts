import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession();

  try {
    const { id } = await params;

    const result = await session.run(
      `
      MATCH (kt:KvoteType {id: $id})
      RETURN kt
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Kvotetype ikke funnet' }, { status: 404 });
    }

    const kvotetype = result.records[0].get('kt').properties;

    return NextResponse.json(kvotetype);
  } catch (error) {
    console.error('Feil ved henting av kvotetype:', error);
    return NextResponse.json({ error: 'Feil ved henting av kvotetype' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, beskrivelse, aktiv } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (kt:KvoteType {id: $id})
      SET kt.navn = $navn,
          kt.type = $type,
          kt.beskrivelse = $beskrivelse,
          kt.aktiv = $aktiv,
          kt.sistEndret = datetime()
      RETURN kt
      `,
      { id, navn, type, beskrivelse: beskrivelse || '', aktiv: aktiv ?? true }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Kvotetype ikke funnet' }, { status: 404 });
    }

    const kvotetype = result.records[0].get('kt').properties;

    return NextResponse.json(kvotetype);
  } catch (error) {
    console.error('Feil ved oppdatering av kvotetype:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av kvotetype' }, { status: 500 });
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
    // Sjekk om kvotetypen er i bruk
    const usageCheck = await session.run(
      `
      MATCH (kt:KvoteType {id: $id})
      OPTIONAL MATCH (kt)-[r]-()
      RETURN count(r) as relationshipCount
      `,
      { id }
    );

    const relationshipCount = usageCheck.records[0]?.get('relationshipCount')?.toNumber() || 0;

    if (relationshipCount > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette kvotetype som er i bruk' },
        { status: 400 }
      );
    }

    const result = await session.run(
      `
      MATCH (kt:KvoteType {id: $id})
      DELETE kt
      RETURN count(kt) as deletedCount
      `,
      { id }
    );

    const deletedCount = result.records[0]?.get('deletedCount')?.toNumber() || 0;

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Kvotetype ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Kvotetype slettet' });
  } catch (error) {
    console.error('Feil ved sletting av kvotetype:', error);
    return NextResponse.json({ error: 'Feil ved sletting av kvotetype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
