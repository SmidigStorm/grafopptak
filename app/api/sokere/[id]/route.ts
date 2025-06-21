import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/sokere/[id] - Hent spesifikk søker
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
      OPTIONAL MATCH (p)-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)
      OPTIONAL MATCH (p)-[:SØKER_MED]->(s:Søknad)
      RETURN p, collect(d) as dokumenter, collect(s) as soknader
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Søker not found' }, { status: 404 });
    }

    const record = result.records[0];
    const soker = record.get('p').properties;
    const dokumenter = record.get('dokumenter').map((d: any) => d.properties);
    const soknader = record.get('soknader').map((s: any) => s.properties);

    return NextResponse.json({
      ...soker,
      dokumenter,
      soknader,
    });
  } catch (error) {
    console.error('Error fetching søker:', error);
    return NextResponse.json({ error: 'Failed to fetch søker' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// PUT /api/sokere/[id] - Oppdater søker
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const {
      fornavn,
      etternavn,
      fodselsdato,
      fodselsnummer,
      epost,
      telefon,
      adresse,
      postnummer,
      poststed,
      statsborgerskap,
      aktiv,
    } = body;

    // Valider required fields
    if (!fornavn || !etternavn || !epost) {
      return NextResponse.json(
        { error: 'Fornavn, etternavn og e-post er påkrevd' },
        { status: 400 }
      );
    }

    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
      SET p.fornavn = $fornavn,
          p.etternavn = $etternavn,
          p.fodselsdato = $fodselsdato,
          p.fodselsnummer = $fodselsnummer,
          p.epost = $epost,
          p.telefon = $telefon,
          p.adresse = $adresse,
          p.postnummer = $postnummer,
          p.poststed = $poststed,
          p.statsborgerskap = $statsborgerskap,
          p.aktiv = $aktiv
      RETURN p
    `,
      {
        id,
        fornavn,
        etternavn,
        fodselsdato: fodselsdato || null,
        fodselsnummer: fodselsnummer || null,
        epost,
        telefon: telefon || null,
        adresse: adresse || null,
        postnummer: postnummer || null,
        poststed: poststed || null,
        statsborgerskap: statsborgerskap || 'Norge',
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Søker not found' }, { status: 404 });
    }

    const soker = result.records[0].get('p').properties;

    return NextResponse.json(soker);
  } catch (error: any) {
    console.error('Error updating søker:', error);

    // Check if it's a constraint violation (duplicate epost)
    if (
      error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed' &&
      error.message.includes('epost')
    ) {
      return NextResponse.json(
        { error: 'En søker med denne e-postadressen eksisterer allerede' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update søker' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/sokere/[id] - Slett søker
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (p:Person {id: $id})
      DETACH DELETE p
      RETURN count(p) as deleted
    `,
      { id }
    );

    const deletedCount = result.records[0].get('deleted').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Søker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting søker:', error);
    return NextResponse.json({ error: 'Failed to delete søker' }, { status: 500 });
  } finally {
    await session.close();
  }
}
