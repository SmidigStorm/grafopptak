import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/institusjoner - Hent alle institusjoner
export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (i:Institusjon)
      OPTIONAL MATCH (i)-[:TILBYR]->(u:Utdanningstilbud)
      RETURN i, count(u) as antallUtdanningstilbud
      ORDER BY i.navn
    `);

    const institusjoner = result.records.map((record) => {
      const institusjon = record.get('i').properties;
      const antallUtdanningstilbud = record.get('antallUtdanningstilbud').toNumber();

      return {
        ...institusjon,
        antallUtdanningstilbud,
      };
    });

    return NextResponse.json(institusjoner);
  } catch (error) {
    console.error('Error fetching institusjoner:', error);
    return NextResponse.json({ error: 'Failed to fetch institusjoner' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/institusjoner - Opprett ny institusjon
export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, kortNavn, type, institusjonsnummer, adresse, nettside } = body;

    // Valider required fields
    if (!navn || !type) {
      return NextResponse.json({ error: 'Navn og type er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (i:Institusjon {
        id: randomUUID(),
        navn: $navn,
        kortNavn: $kortNavn,
        type: $type,
        institusjonsnummer: $institusjonsnummer,
        adresse: $adresse,
        nettside: $nettside,
        aktiv: true
      })
      RETURN i
    `,
      {
        navn,
        kortNavn: kortNavn || null,
        type,
        institusjonsnummer: institusjonsnummer || null,
        adresse: adresse || null,
        nettside: nettside || null,
      }
    );

    const institusjon = result.records[0].get('i').properties;

    return NextResponse.json(institusjon, { status: 201 });
  } catch (error: any) {
    console.error('Error creating institusjon:', error);

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

    return NextResponse.json({ error: 'Failed to create institusjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}
