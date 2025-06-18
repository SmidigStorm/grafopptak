import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/utdanningstilbud - Hent alle utdanningstilbud
export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (u:Utdanningstilbud)
      OPTIONAL MATCH (i:Institusjon)-[:TILBYR]->(u)
      OPTIONAL MATCH (u)-[:HAR_REGELSETT]->(r:Regelsett)
      RETURN u, i.navn as institusjonNavn, count(r) as antallRegelsett
      ORDER BY u.navn
    `);

    const utdanningstilbud = result.records.map((record) => {
      const tilbud = record.get('u').properties;
      const institusjonNavn = record.get('institusjonNavn');
      const antallRegelsett = record.get('antallRegelsett').toNumber();

      return {
        ...tilbud,
        institusjonNavn,
        antallRegelsett,
      };
    });

    return NextResponse.json(utdanningstilbud);
  } catch (error) {
    console.error('Error fetching utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to fetch utdanningstilbud' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/utdanningstilbud - Opprett nytt utdanningstilbud
export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const {
      navn,
      studienivaa,
      studiepoeng,
      varighet,
      semester,
      aar,
      studiested,
      undervisningssprak,
      maxAntallStudenter,
      beskrivelse,
      institusjonId,
    } = body;

    // Valider required fields
    if (!navn || !studienivaa) {
      return NextResponse.json({ error: 'Navn og studienivå er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (u:Utdanningstilbud {
        id: randomUUID(),
        navn: $navn,
        studienivaa: $studienivaa,
        studiepoeng: $studiepoeng,
        varighet: $varighet,
        semester: $semester,
        aar: $aar,
        studiested: $studiested,
        undervisningssprak: $undervisningssprak,
        maxAntallStudenter: $maxAntallStudenter,
        beskrivelse: $beskrivelse,
        aktiv: true
      })
      WITH u
      ${
        institusjonId
          ? `
        MATCH (i:Institusjon {id: $institusjonId})
        CREATE (i)-[:TILBYR]->(u)
      `
          : ''
      }
      RETURN u
    `,
      {
        navn,
        studienivaa,
        studiepoeng: studiepoeng || null,
        varighet: varighet || null,
        semester: semester || null,
        aar: aar || null,
        studiested: studiested || null,
        undervisningssprak: undervisningssprak || 'Norsk',
        maxAntallStudenter: maxAntallStudenter || null,
        beskrivelse: beskrivelse || null,
        institusjonId: institusjonId || null,
      }
    );

    const utdanningstilbud = result.records[0].get('u').properties;

    return NextResponse.json(utdanningstilbud, { status: 201 });
  } catch (error: any) {
    console.error('Error creating utdanningstilbud:', error);

    // Check if it's a constraint violation (duplicate navn)
    if (
      error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed' &&
      error.message.includes('navn')
    ) {
      return NextResponse.json(
        { error: 'Et utdanningstilbud med dette navnet eksisterer allerede' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create utdanningstilbud' }, { status: 500 });
  } finally {
    await session.close();
  }
}
