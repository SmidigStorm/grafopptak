import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { navn, beskrivelse, grunnlagId, kravIds, kvoteId, rangeringId, aktiv } = body;

    // Check if opptaksvei exists
    const opptaksVeiCheck = await session.run('MATCH (ov:OpptaksVei {id: $id}) RETURN ov', { id });

    if (opptaksVeiCheck.records.length === 0) {
      return NextResponse.json({ error: 'OpptaksVei ikke funnet' }, { status: 404 });
    }

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const queryParams: any = { id };

    if (navn !== undefined) {
      updateFields.push('ov.navn = $navn');
      queryParams.navn = navn;
    }
    if (beskrivelse !== undefined) {
      updateFields.push('ov.beskrivelse = $beskrivelse');
      queryParams.beskrivelse = beskrivelse;
    }
    if (aktiv !== undefined) {
      updateFields.push('ov.aktiv = $aktiv');
      queryParams.aktiv = aktiv;
    }

    // Update basic properties
    if (updateFields.length > 0) {
      const updateQuery = `
        MATCH (ov:OpptaksVei {id: $id})
        SET ${updateFields.join(', ')}
        RETURN ov
      `;
      await session.run(updateQuery, queryParams);
    }

    // Update relationships if provided
    if (grunnlagId !== undefined) {
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $id})
        OPTIONAL MATCH (ov)-[r:BASERT_PÅ]->()
        DELETE r
        WITH ov
        MATCH (g:Grunnlag {id: $grunnlagId})
        CREATE (ov)-[:BASERT_PÅ]->(g)
      `,
        { id, grunnlagId }
      );
    }

    if (kvoteId !== undefined) {
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $id})
        OPTIONAL MATCH (ov)-[r:GIR_TILGANG_TIL]->()
        DELETE r
        WITH ov
        MATCH (kv:KvoteType {id: $kvoteId})
        CREATE (ov)-[:GIR_TILGANG_TIL]->(kv)
      `,
        { id, kvoteId }
      );
    }

    if (rangeringId !== undefined) {
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $id})
        OPTIONAL MATCH (ov)-[r:BRUKER_RANGERING]->()
        DELETE r
        WITH ov
        MATCH (rt:RangeringType {id: $rangeringId})
        CREATE (ov)-[:BRUKER_RANGERING]->(rt)
      `,
        { id, rangeringId }
      );
    }

    if (kravIds !== undefined) {
      // Remove existing krav relationships
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $id})-[r:KREVER]->()
        DELETE r
      `,
        { id }
      );

      // Add new krav relationships
      if (kravIds.length > 0) {
        await session.run(
          `
          MATCH (ov:OpptaksVei {id: $id})
          UNWIND $kravIds as kravId
          MATCH (k:Kravelement {id: kravId})
          CREATE (ov)-[:KREVER]->(k)
        `,
          { id, kravIds }
        );
      }
    }

    // Get updated opptaksvei with all relationships
    const updatedResult = await session.run(
      `
      MATCH (ov:OpptaksVei {id: $id})
      OPTIONAL MATCH (ov)-[:BASERT_PÅ]->(g:Grunnlag)
      OPTIONAL MATCH (ov)-[:KREVER]->(k:Kravelement)
      OPTIONAL MATCH (ov)-[:GIR_TILGANG_TIL]->(kv:KvoteType)
      OPTIONAL MATCH (ov)-[:BRUKER_RANGERING]->(rt:RangeringType)
      RETURN ov, g.id as grunnlag, collect(k.id) as krav, kv.id as kvote, rt.id as rangering
    `,
      { id }
    );

    const record = updatedResult.records[0];
    const opptaksVei = record.get('ov').properties;

    return NextResponse.json({
      id: opptaksVei.id,
      navn: opptaksVei.navn,
      beskrivelse: opptaksVei.beskrivelse,
      grunnlag: record.get('grunnlag'),
      krav: record.get('krav').filter((k: string) => k),
      kvote: record.get('kvote'),
      rangering: record.get('rangering'),
      aktiv: opptaksVei.aktiv,
      opprettet: opptaksVei.opprettet,
    });
  } catch (error) {
    console.error('Feil ved oppdatering av opptaksvei:', error);
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 });
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
    // Check if opptaksvei exists
    const opptaksVeiCheck = await session.run('MATCH (ov:OpptaksVei {id: $id}) RETURN ov', { id });

    if (opptaksVeiCheck.records.length === 0) {
      return NextResponse.json({ error: 'OpptaksVei ikke funnet' }, { status: 404 });
    }

    // Delete the opptaksvei and all its relationships
    await session.run(
      `
      MATCH (ov:OpptaksVei {id: $id})
      DETACH DELETE ov
    `,
      { id }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Feil ved sletting av opptaksvei:', error);
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 });
  } finally {
    await session.close();
  }
}
