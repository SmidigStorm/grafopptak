import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/utdanningstilbud/[id] - Hent spesifikt utdanningstilbud
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:Utdanningstilbud {id: $id})
      OPTIONAL MATCH (i:Institusjon)-[:TILBYR]->(u)
      OPTIONAL MATCH (u)-[:HAR_REGELSETT]->(r:Regelsett)
      RETURN u, i, collect(r) as regelsett
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Utdanningstilbud not found' }, { status: 404 });
    }

    const record = result.records[0];
    const utdanningstilbud = record.get('u').properties;
    const institusjon = record.get('i')?.properties || null;
    const regelsett = record.get('regelsett').map((r: any) => r.properties);

    return NextResponse.json({
      ...utdanningstilbud,
      institusjon,
      regelsett,
    });
  } catch (error) {
    console.error('Error fetching utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to fetch utdanningstilbud' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// PUT /api/utdanningstilbud/[id] - Oppdater utdanningstilbud
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      aktiv,
    } = body;

    // Valider required fields
    if (!navn || !studienivaa) {
      return NextResponse.json({ error: 'Navn og studienivå er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (u:Utdanningstilbud {id: $id})
      SET u.navn = $navn,
          u.studienivaa = $studienivaa,
          u.studiepoeng = $studiepoeng,
          u.varighet = $varighet,
          u.semester = $semester,
          u.aar = $aar,
          u.studiested = $studiested,
          u.undervisningssprak = $undervisningssprak,
          u.maxAntallStudenter = $maxAntallStudenter,
          u.beskrivelse = $beskrivelse,
          u.aktiv = $aktiv
      RETURN u
    `,
      {
        id,
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
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Utdanningstilbud not found' }, { status: 404 });
    }

    const utdanningstilbud = result.records[0].get('u').properties;

    return NextResponse.json(utdanningstilbud);
  } catch (error: any) {
    console.error('Error updating utdanningstilbud:', error);

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

    return NextResponse.json({ error: 'Failed to update utdanningstilbud' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/utdanningstilbud/[id] - Slett utdanningstilbud
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:Utdanningstilbud {id: $id})
      DETACH DELETE u
      RETURN count(u) as deleted
    `,
      { id }
    );

    const deletedCount = result.records[0].get('deleted').toNumber();

    if (deletedCount === 0) {
      return NextResponse.json({ error: 'Utdanningstilbud not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to delete utdanningstilbud' }, { status: 500 });
  } finally {
    await session.close();
  }
}
