import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  const session = getSession();

  try {
    const { searchParams } = new URL(request.url);
    const maler = searchParams.get('maler') === 'true';

    let query;
    if (maler) {
      // Hent kun regelsett-maler
      query = `
        MATCH (r:Regelsett)
        WHERE r.erMal = true
        RETURN r.id as id, r.navn as navn, r.beskrivelse as beskrivelse, r.malType as malType
        ORDER BY r.navn
      `;
    } else {
      // Hent alle regelsett med opptaksveier
      query = `
        MATCH (r:Regelsett)
        OPTIONAL MATCH (r)-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
        RETURN r, count(ov) as antallOpptaksVeier
        ORDER BY r.opprettet DESC
      `;
    }

    const result = await session.run(query);

    let regelsett;
    if (maler) {
      regelsett = result.records.map((record: any) => ({
        id: record.get('id'),
        navn: record.get('navn'),
        beskrivelse: record.get('beskrivelse'),
        malType: record.get('malType'),
      }));
    } else {
      regelsett = result.records.map((record: any) => ({
        ...record.get('r').properties,
        antallOpptaksVeier: record.get('antallOpptaksVeier').toNumber(),
      }));
    }

    return NextResponse.json(regelsett);
  } catch (error) {
    console.error('Feil ved henting av regelsett:', error);
    return NextResponse.json({ error: 'Feil ved henting av regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, versjon, beskrivelse, gyldigFra } = body;

    if (!navn || !versjon) {
      return NextResponse.json({ error: 'Navn og versjon er påkrevd' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (r:Regelsett {
        id: randomUUID(),
        navn: $navn,
        versjon: $versjon,
        gyldigFra: date($gyldigFra),
        gyldigTil: null,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      RETURN r
    `,
      {
        navn,
        versjon,
        beskrivelse: beskrivelse || null,
        gyldigFra: gyldigFra || new Date().toISOString().split('T')[0],
      }
    );

    const nyRegelsett = result.records[0].get('r').properties;

    return NextResponse.json(nyRegelsett, { status: 201 });
  } catch (error) {
    console.error('Feil ved opprettelse av regelsett:', error);
    return NextResponse.json({ error: 'Feil ved opprettelse av regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}
