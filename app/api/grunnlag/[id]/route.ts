import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession();

  try {
    const { id } = await params;

    const result = await session.run(
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
    // Sjekk om grunnlaget er i bruk
    const usageCheck = await session.run(
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

    const result = await session.run(
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
  } finally {
    await session.close();
  }
}
