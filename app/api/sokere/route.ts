import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/sokere - Hent alle søkere
export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (p:Person)
      OPTIONAL MATCH (p)-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)
      OPTIONAL MATCH (p)-[:SØKER_MED]->(s:Søknad)
      RETURN p, count(d) as antallDokumenter, count(s) as antallSøknader
      ORDER BY p.etternavn, p.fornavn
    `);

    const sokere = result.records.map((record) => {
      const person = record.get('p').properties;
      const antallDokumenter = record.get('antallDokumenter').toNumber();
      const antallSøknader = record.get('antallSøknader').toNumber();

      return {
        ...person,
        antallDokumenter,
        antallSøknader,
      };
    });

    return NextResponse.json(sokere);
  } catch (error) {
    console.error('Error fetching søkere:', error);
    return NextResponse.json({ error: 'Failed to fetch søkere' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/sokere - Opprett ny søker
export async function POST(request: NextRequest) {
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
      CREATE (p:Person {
        id: randomUUID(),
        fornavn: $fornavn,
        etternavn: $etternavn,
        fodselsdato: $fodselsdato,
        fodselsnummer: $fodselsnummer,
        epost: $epost,
        telefon: $telefon,
        adresse: $adresse,
        postnummer: $postnummer,
        poststed: $poststed,
        statsborgerskap: $statsborgerskap,
        aktiv: true
      })
      RETURN p
    `,
      {
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
      }
    );

    const soker = result.records[0].get('p').properties;

    return NextResponse.json(soker, { status: 201 });
  } catch (error: any) {
    console.error('Error creating søker:', error);

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

    return NextResponse.json({ error: 'Failed to create søker' }, { status: 500 });
  } finally {
    await session.close();
  }
}
