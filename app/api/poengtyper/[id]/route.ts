import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (pt:PoengType {id: $id})
      RETURN pt
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Poengtype ikke funnet' }, { status: 404 });
    }

    const poengtype = result.records[0].get('pt').properties;

    return NextResponse.json(poengtype);
  } catch (error) {
    console.error('Feil ved henting av poengtype:', error);
    return NextResponse.json({ error: 'Feil ved henting av poengtype' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, type, beskrivelse, beregningsmåte, aktiv } = body;

    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (pt:PoengType {id: $id})
      SET pt.navn = $navn,
          pt.type = $type,
          pt.beskrivelse = $beskrivelse,
          pt.beregningsmåte = $beregningsmåte,
          pt.aktiv = $aktiv
      RETURN pt
      `,
      {
        id,
        navn,
        type,
        beskrivelse: beskrivelse || '',
        beregningsmåte: beregningsmåte || '',
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Poengtype ikke funnet' }, { status: 404 });
    }

    const poengtype = result.records[0].get('pt').properties;

    return NextResponse.json(poengtype);
  } catch (error) {
    console.error('Feil ved oppdatering av poengtype:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av poengtype' }, { status: 500 });
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
    const result = await session.run(
      `
      MATCH (pt:PoengType {id: $id})
      DETACH DELETE pt
      RETURN count(pt) as deletedCount
      `,
      { id }
    );

    const deletedCount = result.records[0].get('deletedCount').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Poengtype ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Poengtype slettet' });
  } catch (error) {
    console.error('Feil ved sletting av poengtype:', error);
    return NextResponse.json({ error: 'Feil ved sletting av poengtype' }, { status: 500 });
  } finally {
    await session.close();
  }
}
