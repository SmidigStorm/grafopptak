import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  const session = getSession();

  try {
    const { searchParams } = new URL(request.url);
    const regelssettId = searchParams.get('regelssett');

    const query = `
      MATCH (ov:OpptaksVei)
      OPTIONAL MATCH (r:Regelsett)-[:HAR_OPPTAKSVEI]->(ov)
      OPTIONAL MATCH (ov)-[:BASERT_PÅ]->(g:Grunnlag)
      OPTIONAL MATCH (ov)-[:GIR_TILGANG_TIL]->(kv:KvoteType)
      OPTIONAL MATCH (ov)-[:BRUKER_RANGERING]->(rt:RangeringType)
      ${regelssettId ? 'WHERE r.id = $regelssettId' : ''}
      RETURN ov, r, g, kv, rt
      ORDER BY r.navn, ov.navn
    `;

    const result = await session.run(query, { regelssettId });

    const opptaksveier = result.records.map((record) => {
      const opptaksvei = record.get('ov').properties;
      const regelsett = record.get('r')?.properties;
      const grunnlag = record.get('g')?.properties;
      const kvotetype = record.get('kv')?.properties;
      const rangeringstype = record.get('rt')?.properties;

      return {
        ...opptaksvei,
        regelsett,
        grunnlag,
        kvotetype,
        rangeringstype
      };
    });

    return NextResponse.json(opptaksveier);
  } catch (error) {
    console.error('Error fetching opptaksveier:', error);
    return NextResponse.json({ error: 'Failed to fetch opptaksveier' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { regelssettId, navn, beskrivelse, grunnlagId, kvotetypeId, rangeringstypeId } = body;

    if (!regelssettId || !navn) {
      return NextResponse.json({ error: 'regelssettId og navn er påkrevd' }, { status: 400 });
    }

    const query = `
      MATCH (r:Regelsett {id: $regelssettId})
      ${grunnlagId ? 'OPTIONAL MATCH (g:Grunnlag {id: $grunnlagId})' : ''}
      ${kvotetypeId ? 'OPTIONAL MATCH (kv:KvoteType {id: $kvotetypeId})' : ''}
      ${rangeringstypeId ? 'OPTIONAL MATCH (rt:RangeringType {id: $rangeringstypeId})' : ''}
      
      CREATE (ov:OpptaksVei {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      
      CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)
      ${grunnlagId ? 'FOREACH (g IN CASE WHEN g IS NOT NULL THEN [g] ELSE [] END | CREATE (ov)-[:BASERT_PÅ]->(g))' : ''}
      ${kvotetypeId ? 'FOREACH (kv IN CASE WHEN kv IS NOT NULL THEN [kv] ELSE [] END | CREATE (ov)-[:GIR_TILGANG_TIL]->(kv))' : ''}
      ${rangeringstypeId ? 'FOREACH (rt IN CASE WHEN rt IS NOT NULL THEN [rt] ELSE [] END | CREATE (ov)-[:BRUKER_RANGERING]->(rt))' : ''}
      
      RETURN ov
    `;

    const result = await session.run(query, {
      regelssettId,
      navn,
      beskrivelse: beskrivelse || null,
      grunnlagId: grunnlagId || null,
      kvotetypeId: kvotetypeId || null,
      rangeringstypeId: rangeringstypeId || null
    });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    const opptaksvei = result.records[0].get('ov').properties;

    return NextResponse.json(opptaksvei, { status: 201 });
  } catch (error) {
    console.error('Error creating opptaksvei:', error);
    return NextResponse.json({ error: 'Failed to create opptaksvei' }, { status: 500 });
  } finally {
    await session.close();
  }
}