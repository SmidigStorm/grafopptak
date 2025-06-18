import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/institusjoner/[id] - Hent spesifikk institusjon
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (i:Institusjon {id: $id})
      OPTIONAL MATCH (i)-[:TILBYR]->(u:Utdanningstilbud)
      RETURN i, collect(u) as utdanningstilbud
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Institusjon not found' }, { status: 404 });
    }

    const record = result.records[0];
    const institusjon = record.get('i').properties;
    const utdanningstilbud = record.get('utdanningstilbud').map((u: any) => u.properties);

    return NextResponse.json({
      ...institusjon,
      utdanningstilbud,
    });
  } catch (error) {
    console.error('Error fetching institusjon:', error);
    return NextResponse.json({ error: 'Failed to fetch institusjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// PUT /api/institusjoner/[id] - Oppdater institusjon
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, kortNavn, type, institusjonsnummer, adresse, nettside, aktiv } = body;

    // Valider required fields
    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (i:Institusjon {id: $id})
      SET i.navn = $navn,
          i.kortNavn = $kortNavn,
          i.type = $type,
          i.institusjonsnummer = $institusjonsnummer,
          i.adresse = $adresse,
          i.nettside = $nettside,
          i.aktiv = $aktiv
      RETURN i
    `,
      {
        id,
        navn,
        kortNavn: kortNavn || null,
        type,
        institusjonsnummer: institusjonsnummer || null,
        adresse: adresse || null,
        nettside: nettside || null,
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Institusjon not found' }, { status: 404 });
    }

    const institusjon = result.records[0].get('i').properties;

    return NextResponse.json(institusjon);
  } catch (error: any) {
    console.error('Error updating institusjon:', error);

    // Check if it's a constraint violation (duplicate navn)
    if (
      error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed' &&
      error.message.includes('navn')
    ) {
      return NextResponse.json(
        { error: 'En institusjon med dette navnet eksisterer allerede' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update institusjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/institusjoner/[id] - Slett institusjon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (i:Institusjon {id: $id})
      DETACH DELETE i
      RETURN count(i) as deleted
    `,
      { id }
    );

    const deletedCount = result.records[0].get('deleted').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Institusjon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting institusjon:', error);
    return NextResponse.json({ error: 'Failed to delete institusjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}
