import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (r:Regelsett {id: $id})
      RETURN r
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    const regelsett = result.records[0].get('r').properties;

    return NextResponse.json(regelsett);
  } catch (error) {
    console.error('Feil ved henting av regelsett:', error);
    return NextResponse.json({ error: 'Feil ved henting av regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, versjon, beskrivelse, gyldigFra, gyldigTil, aktiv } = body;

    if (!navn || !versjon) {
      return NextResponse.json({ error: 'Navn og versjon er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      MATCH (r:Regelsett {id: $id})
      SET r.navn = $navn,
          r.versjon = $versjon,
          r.beskrivelse = $beskrivelse,
          r.gyldigFra = date($gyldigFra),
          r.gyldigTil = CASE WHEN $gyldigTil IS NOT NULL THEN date($gyldigTil) ELSE null END,
          r.aktiv = $aktiv
      RETURN r
    `,
      {
        id,
        navn,
        versjon,
        beskrivelse: beskrivelse || null,
        gyldigFra,
        gyldigTil: gyldigTil || null,
        aktiv: aktiv !== undefined ? aktiv : true,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    const oppdatertRegelsett = result.records[0].get('r').properties;

    return NextResponse.json(oppdatertRegelsett);
  } catch (error) {
    console.error('Feil ved oppdatering av regelsett:', error);
    return NextResponse.json({ error: 'Feil ved oppdatering av regelsett' }, { status: 500 });
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
    // Sjekk om regelsettet har tilknyttede implementeringer
    const checkResult = await session.run(
      `
      MATCH (r:Regelsett {id: $id})
      OPTIONAL MATCH (r)-[:INNEHOLDER]->(impl)
      WHERE impl:GrunnlagImplementering OR impl:KravImplementering OR impl:KvoteImplementering OR impl:RangeringImplementering
      RETURN r, count(impl) as antallImplementeringer
    `,
      { id }
    );

    if (checkResult.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    const antallImplementeringer = checkResult.records[0].get('antallImplementeringer').toNumber();

    if (antallImplementeringer > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette regelsett som har tilknyttede implementeringer' },
        { status: 400 }
      );
    }

    await session.run(
      `
      MATCH (r:Regelsett {id: $id})
      DETACH DELETE r
    `,
      { id }
    );

    return NextResponse.json({ message: 'Regelsett slettet' });
  } catch (error) {
    console.error('Feil ved sletting av regelsett:', error);
    return NextResponse.json({ error: 'Feil ved sletting av regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}
