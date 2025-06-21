import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const query = `
      MATCH (d:Dokumentasjon {id: $id})-[r:INNEHOLDER]->(fk:Fagkode)
      RETURN fk, r
      ORDER BY r.dato DESC, fk.kode
    `;

    const result = await session.run(query, { id });

    const karakterer = result.records.map((record) => ({
      fagkode: record.get('fk').properties,
      karakter: record.get('r').properties.karakter,
      karaktersystem: record.get('r').properties.karaktersystem,
      dato: record.get('r').properties.dato,
      kommentar: record.get('r').properties.kommentar,
    }));

    return NextResponse.json(karakterer);
  } catch (error) {
    console.error('Error fetching karakterer:', error);
    return NextResponse.json({ error: 'Failed to fetch karakterer' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { fagkodeId, karakter, karaktersystem, dato, kommentar } = body;

    if (!fagkodeId || !karakter || !karaktersystem || !dato) {
      return NextResponse.json(
        { error: 'fagkodeId, karakter, karaktersystem og dato er påkrevd' },
        { status: 400 }
      );
    }

    // Valider karakterverdi basert på karaktersystem
    if (karaktersystem === '1-6' && !['1', '2', '3', '4', '5', '6'].includes(karakter)) {
      return NextResponse.json({ error: 'Ugyldig karakter for 1-6 system' }, { status: 400 });
    }

    if (
      karaktersystem === 'bestått/ikke bestått' &&
      !['bestått', 'ikke bestått'].includes(karakter)
    ) {
      return NextResponse.json(
        { error: 'Ugyldig karakter for bestått/ikke bestått system' },
        { status: 400 }
      );
    }

    // Sjekk om det allerede finnes en karakter for samme dato
    const checkQuery = `
      MATCH (d:Dokumentasjon {id: $dokumentId})-[r:INNEHOLDER]->(fk:Fagkode {id: $fagkodeId})
      WHERE r.dato = date($dato)
      RETURN count(r) as eksisterer
    `;

    const checkResult = await session.run(checkQuery, {
      dokumentId: id,
      fagkodeId,
      dato,
    });

    if (checkResult.records[0].get('eksisterer').toNumber() > 0) {
      return NextResponse.json(
        { error: 'Det finnes allerede en karakter for denne fagkoden på denne datoen' },
        { status: 400 }
      );
    }

    // Opprett ny karakter
    const query = `
      MATCH (d:Dokumentasjon {id: $dokumentId})
      MATCH (fk:Fagkode {id: $fagkodeId})
      CREATE (d)-[r:INNEHOLDER {
        karakter: $karakter,
        karaktersystem: $karaktersystem,
        dato: date($dato),
        kommentar: $kommentar
      }]->(fk)
      RETURN d, fk, r
    `;

    const result = await session.run(query, {
      dokumentId: id,
      fagkodeId,
      karakter,
      karaktersystem,
      dato,
      kommentar: kommentar || null,
    });

    if (result.records.length === 0) {
      return NextResponse.json(
        { error: 'Dokumentasjon eller fagkode ikke funnet' },
        { status: 404 }
      );
    }

    const record = result.records[0];
    const response = {
      dokumentasjon: record.get('d').properties,
      fagkode: record.get('fk').properties,
      karakter: record.get('r').properties.karakter,
      karaktersystem: record.get('r').properties.karaktersystem,
      dato: record.get('r').properties.dato,
      kommentar: record.get('r').properties.kommentar,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating karakter:', error);
    return NextResponse.json({ error: 'Failed to create karakter' }, { status: 500 });
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
    const { searchParams } = new URL(request.url);
    const fagkodeId = searchParams.get('fagkodeId');
    const dato = searchParams.get('dato');

    if (!fagkodeId || !dato) {
      return NextResponse.json(
        { error: 'fagkodeId og dato er påkrevd som query parameters' },
        { status: 400 }
      );
    }

    const query = `
      MATCH (d:Dokumentasjon {id: $dokumentId})-[r:INNEHOLDER]->(fk:Fagkode {id: $fagkodeId})
      WHERE r.dato = date($dato)
      DELETE r
      RETURN count(r) as deleted
    `;

    const result = await session.run(query, {
      dokumentId: id,
      fagkodeId,
      dato,
    });

    const deleted = result.records[0].get('deleted').toNumber();

    if (deleted === 0) {
      return NextResponse.json({ error: 'Karakter ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Karakter slettet' });
  } catch (error) {
    console.error('Error deleting karakter:', error);
    return NextResponse.json({ error: 'Failed to delete karakter' }, { status: 500 });
  } finally {
    await session.close();
  }
}
