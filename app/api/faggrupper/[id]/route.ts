import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/faggrupper/[id] - Hent spesifikk faggruppe med tilhørende fagkoder
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (fg:Faggruppe {id: $id})
      OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg)
      RETURN fg, collect(fk) as fagkoder
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Faggruppe not found' }, { status: 404 });
    }

    const record = result.records[0];
    const faggruppe = record.get('fg').properties;
    const fagkoder = record
      .get('fagkoder')
      .filter((fk: any) => fk !== null)
      .map((fk: any) => fk.properties);

    return NextResponse.json({ ...faggruppe, fagkoder });
  } catch (error) {
    console.error('Error fetching faggruppe:', error);
    return NextResponse.json({ error: 'Failed to fetch faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// PUT /api/faggrupper/[id] - Oppdater faggruppe
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, beskrivelse, type, aktiv } = body;

    const result = await session.run(
      `
      MATCH (fg:Faggruppe {id: $id})
      SET fg.navn = $navn,
          fg.beskrivelse = $beskrivelse,
          fg.type = $type,
          fg.aktiv = $aktiv
      RETURN fg
    `,
      {
        id,
        navn,
        beskrivelse: beskrivelse || null,
        type: type || null,
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Faggruppe not found' }, { status: 404 });
    }

    const faggruppe = result.records[0].get('fg').properties;
    return NextResponse.json(faggruppe);
  } catch (error) {
    console.error('Error updating faggruppe:', error);
    return NextResponse.json({ error: 'Failed to update faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/faggrupper/[id] - Slett faggruppe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    // Sjekk først om faggruppen har tilknyttede fagkoder
    const checkResult = await session.run(
      `
      MATCH (fg:Faggruppe {id: $id})
      OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg)
      RETURN fg, count(fk) as fagkodeCount
    `,
      { id }
    );

    if (checkResult.records.length === 0) {
      return NextResponse.json({ error: 'Faggruppe not found' }, { status: 404 });
    }

    const fagkodeCount = checkResult.records[0].get('fagkodeCount').toNumber();

    if (fagkodeCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete faggruppe with associated fagkoder' },
        { status: 400 }
      );
    }

    const result = await session.run(
      `
      MATCH (fg:Faggruppe {id: $id})
      DETACH DELETE fg
      RETURN count(fg) as deletedCount
    `,
      { id }
    );

    return NextResponse.json({ message: 'Faggruppe deleted successfully' });
  } catch (error) {
    console.error('Error deleting faggruppe:', error);
    return NextResponse.json({ error: 'Failed to delete faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}
