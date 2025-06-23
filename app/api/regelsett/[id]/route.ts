import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    // Først hent regelsett
    const regelSettResult = await session.run(`MATCH (r:Regelsett {id: $id}) RETURN r`, { id });

    if (regelSettResult.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    // Så hent OpptaksVeier separat
    const opptaksVeierResult = await session.run(
      `
      MATCH (r:Regelsett {id: $id})-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
      OPTIONAL MATCH (ov)-[:BASERT_PÅ]->(g:Grunnlag)
      OPTIONAL MATCH (ov)-[:GIR_TILGANG_TIL]->(kvote:KvoteType)
      OPTIONAL MATCH (ov)-[:BRUKER_RANGERING]->(r_type:RangeringType)
      OPTIONAL MATCH (ov)-[:HAR_REGEL]->(ln:LogicalNode)
      OPTIONAL MATCH (ln)-[:EVALUERER]->(k:Kravelement)
      RETURN ov, g.navn as grunnlag, kvote.navn as kvote, r_type.navn as rangering,
             ln.navn as logicalNode, ln.beskrivelse as logicalNodeBeskrivelse,
             collect(DISTINCT k.navn) as krav
      ORDER BY ov.navn
      `,
      { id }
    );

    const regelSettData = regelSettResult.records[0].get('r').properties;

    // Bygg OpptaksVeier fra separat query
    const opptaksVeier = opptaksVeierResult.records.map((record) => ({
      id: record.get('ov').properties.id,
      navn: record.get('ov').properties.navn,
      beskrivelse: record.get('ov').properties.beskrivelse,
      aktiv: record.get('ov').properties.aktiv,
      grunnlag: record.get('grunnlag'),
      kvote: record.get('kvote'),
      rangering: record.get('rangering'),
      logicalNode: record.get('logicalNode'),
      logicalNodeBeskrivelse: record.get('logicalNodeBeskrivelse'),
      krav: record.get('krav').filter((k: string) => k !== null),
    }));

    const regelsett = {
      ...regelSettData,
      opptaksVeier,
    };

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
    // Sjekk om regelsettet har tilknyttede OpptaksVeier
    const checkResult = await session.run(
      `
      MATCH (r:Regelsett {id: $id})
      OPTIONAL MATCH (r)-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
      RETURN r, count(ov) as antallOpptaksVeier
    `,
      { id }
    );

    if (checkResult.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    const antallOpptaksVeier = checkResult.records[0].get('antallOpptaksVeier').toNumber();

    if (antallOpptaksVeier > 0) {
      return NextResponse.json(
        { error: 'Kan ikke slette regelsett som har tilknyttede OpptaksVeier' },
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
