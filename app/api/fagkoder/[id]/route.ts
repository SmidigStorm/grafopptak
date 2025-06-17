import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/fagkoder/[id] - Hent spesifikk fagkode
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (fk:Fagkode {id: $id})
      OPTIONAL MATCH (fk)-[:KVALIFISERER_FOR]->(fg:Faggruppe)
      RETURN fk, collect(fg) as faggrupper
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Fagkode not found' }, { status: 404 });
    }

    const record = result.records[0];
    const fagkode = record.get('fk').properties;
    const faggrupper = record
      .get('faggrupper')
      .filter((fg: any) => fg !== null)
      .map((fg: any) => fg.properties);

    return NextResponse.json({ ...fagkode, faggrupper });
  } catch (error) {
    console.error('Error fetching fagkode:', error);
    return NextResponse.json({ error: 'Failed to fetch fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// PUT /api/fagkoder/[id] - Oppdater fagkode
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { kode, navn, beskrivelse, gyldigFra, gyldigTil, aktiv } = body;

    const result = await session.run(
      `
      MATCH (fk:Fagkode {id: $id})
      SET fk.kode = $kode,
          fk.navn = $navn,
          fk.beskrivelse = $beskrivelse,
          fk.gyldigFra = date($gyldigFra),
          fk.gyldigTil = CASE WHEN $gyldigTil IS NOT NULL THEN date($gyldigTil) ELSE NULL END,
          fk.aktiv = $aktiv
      RETURN fk
    `,
      {
        id,
        kode,
        navn,
        beskrivelse: beskrivelse || null,
        gyldigFra: gyldigFra || new Date().toISOString().split('T')[0],
        gyldigTil: gyldigTil || null,
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Fagkode not found' }, { status: 404 });
    }

    const fagkode = result.records[0].get('fk').properties;
    return NextResponse.json(fagkode);
  } catch (error) {
    console.error('Error updating fagkode:', error);
    return NextResponse.json({ error: 'Failed to update fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/fagkoder/[id] - Slett fagkode
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (fk:Fagkode {id: $id})
      DETACH DELETE fk
      RETURN count(fk) as deletedCount
    `,
      { id }
    );

    const deletedCount = result.records[0].get('deletedCount').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Fagkode not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fagkode deleted successfully' });
  } catch (error) {
    console.error('Error deleting fagkode:', error);
    return NextResponse.json({ error: 'Failed to delete fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}
