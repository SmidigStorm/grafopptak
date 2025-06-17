import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// POST /api/faggrupper/[id]/fagkoder - Koble fagkode til faggruppe
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { fagkodeId, kreverKombinasjon } = body;

    if (!fagkodeId) {
      return NextResponse.json({ error: 'fagkodeId is required' }, { status: 400 });
    }

    // Sjekk at både faggruppe og fagkode eksisterer
    const checkResult = await session.run(
      `
      MATCH (fg:Faggruppe {id: $faggruppeId})
      MATCH (fk:Fagkode {id: $fagkodeId})
      RETURN fg, fk
    `,
      {
        faggruppeId: id,
        fagkodeId,
      }
    );

    if (checkResult.records.length === 0) {
      return NextResponse.json({ error: 'Faggruppe or fagkode not found' }, { status: 404 });
    }

    // Opprett relasjonen
    const result = await session.run(
      `
      MATCH (fg:Faggruppe {id: $faggruppeId})
      MATCH (fk:Fagkode {id: $fagkodeId})
      MERGE (fk)-[r:KVALIFISERER_FOR]->(fg)
      SET r.kreverKombinasjon = $kreverKombinasjon
      RETURN fk, r, fg
    `,
      {
        faggruppeId: id,
        fagkodeId,
        kreverKombinasjon: kreverKombinasjon || null,
      }
    );

    const fagkode = result.records[0].get('fk').properties;
    const relasjon = result.records[0].get('r').properties;
    const faggruppe = result.records[0].get('fg').properties;

    return NextResponse.json(
      {
        fagkode,
        faggruppe,
        relasjon,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error linking fagkode to faggruppe:', error);
    return NextResponse.json({ error: 'Failed to link fagkode to faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/faggrupper/[id]/fagkoder - Fjern kobling mellom fagkode og faggruppe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const { searchParams } = new URL(request.url);
    const fagkodeId = searchParams.get('fagkodeId');

    if (!fagkodeId) {
      return NextResponse.json(
        { error: 'fagkodeId is required as query parameter' },
        { status: 400 }
      );
    }

    const result = await session.run(
      `
      MATCH (fk:Fagkode {id: $fagkodeId})-[r:KVALIFISERER_FOR]->(fg:Faggruppe {id: $faggruppeId})
      DELETE r
      RETURN count(r) as deletedCount
    `,
      {
        faggruppeId: id,
        fagkodeId,
      }
    );

    const deletedCount = result.records[0].get('deletedCount').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Relationship not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Relationship deleted successfully' });
  } catch (error) {
    console.error('Error unlinking fagkode from faggruppe:', error);
    return NextResponse.json({ error: 'Failed to unlink fagkode from faggruppe' }, { status: 500 });
  } finally {
    await session.close();
  }
}
