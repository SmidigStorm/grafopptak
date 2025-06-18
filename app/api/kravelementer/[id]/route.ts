import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession();

  try {
    const { id } = await params;

    const result = await session.run(
      `
      MATCH (ke:Kravelement {id: $id})
      RETURN ke
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Kravelement ikke funnet' }, { status: 404 });
    }

    const kravelement = result.records[0].get('ke').properties;

    return NextResponse.json(kravelement);
  } catch (error) {
    console.error('Feil ved henting av kravelement:', error);
    return NextResponse.json({ error: 'Feil ved henting av kravelement' }, { status: 500 });
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
      MATCH (ke:Kravelement {id: $id})
      SET ke.navn = $navn,
          ke.type = $type,
          ke.beskrivelse = $beskrivelse,
          ke.aktiv = $aktiv,
          ke.sistEndret = datetime()
      RETURN ke
      `,
      { id, navn, type, beskrivelse: beskrivelse || '', aktiv: aktiv ?? true }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Kravelement ikke funnet' }, { status: 404 });
    }

    const kravelement = result.records[0].get('ke').properties;

    return NextResponse.json(kravelement);
  } catch (error) {
    console.error('Feil ved oppdatering av kravelement:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av kravelement' }, { status: 500 });
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
    // Sjekk om kravelementet er i bruk
    const usageCheck = await session.run(
      `
      MATCH (ke:Kravelement {id: $id})
      OPTIONAL MATCH (ke)-[r]-()
      RETURN count(r) as relationshipCount
      `,
      { id }
    );

    const relationshipCount = usageCheck.records[0]?.get('relationshipCount')?.toNumber() || 0;

    if (relationshipCount > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette kravelement som er i bruk' },
        { status: 400 }
      );
    }

    const result = await session.run(
      `
      MATCH (ke:Kravelement {id: $id})
      DELETE ke
      RETURN count(ke) as deletedCount
      `,
      { id }
    );

    const deletedCount = result.records[0]?.get('deletedCount')?.toNumber() || 0;

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Kravelement ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Kravelement slettet' });
  } catch (error) {
    console.error('Feil ved sletting av kravelement:', error);
    return NextResponse.json({ error: 'Feil ved sletting av kravelement' }, { status: 500 });
  } finally {
    await session.close();
  }
}
