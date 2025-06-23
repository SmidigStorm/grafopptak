import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const query = `
      MATCH (ov:OpptaksVei {id: $id})
      OPTIONAL MATCH (r:Regelsett)-[:HAR_OPPTAKSVEI]->(ov)
      OPTIONAL MATCH (ov)-[:BASERT_PÅ]->(g:Grunnlag)
      OPTIONAL MATCH (ov)-[:GIR_TILGANG_TIL]->(kv:KvoteType)
      OPTIONAL MATCH (ov)-[:BRUKER_RANGERING]->(rt:RangeringType)
      OPTIONAL MATCH (ov)-[:HAR_REGEL]->(ln:LogicalNode)
      OPTIONAL MATCH (ln)-[:EVALUERER]->(k:Kravelement)
      RETURN ov, r, g, kv, rt, ln, collect(DISTINCT k.id) as krav
    `;

    const result = await session.run(query, { id });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Opptaksvei ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const opptaksvei = record.get('ov').properties;
    const regelsett = record.get('r')?.properties;
    const grunnlag = record.get('g')?.properties;
    const kvotetype = record.get('kv')?.properties;
    const rangeringstype = record.get('rt')?.properties;
    const logicalNode = record.get('ln')?.properties;
    const krav = record.get('krav').filter((k: string) => k);

    return NextResponse.json({
      ...opptaksvei,
      regelsett,
      grunnlag,
      kvotetype,
      rangeringstype,
      logicalNode,
      krav,
      logicalNodeType: logicalNode?.type || 'AND',
    });
  } catch (error) {
    console.error('Error fetching opptaksvei:', error);
    return NextResponse.json({ error: 'Failed to fetch opptaksvei' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const {
      navn,
      beskrivelse,
      grunnlagId,
      kravIds,
      kvoteId,
      rangeringId,
      aktiv,
      logicalNodeType = 'AND',
    } = body;

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
      // Remove existing LogicalNode and relationships
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $id})-[r:HAR_REGEL]->(ln:LogicalNode)
        DETACH DELETE ln
      `,
        { id }
      );

      // Create new LogicalNode with requirements if any exist
      if (kravIds.length > 0) {
        await session.run(
          `
          MATCH (ov:OpptaksVei {id: $id})
          CREATE (ln:LogicalNode {
            id: randomUUID(),
            navn: ov.navn + " - LogicalNode",
            beskrivelse: "Automatisk opprettet logical node for " + ov.navn,
            type: $logicalNodeType,
            opprettet: datetime()
          })
          CREATE (ov)-[:HAR_REGEL]->(ln)
          WITH ln
          UNWIND $kravIds as kravId
          MATCH (k:Kravelement {id: kravId})
          CREATE (ln)-[:EVALUERER]->(k)
        `,
          { id, kravIds, logicalNodeType }
        );
      }
    }

    // Get updated opptaksvei with all relationships
    const updatedResult = await session.run(
      `
      MATCH (ov:OpptaksVei {id: $id})
      OPTIONAL MATCH (ov)-[:BASERT_PÅ]->(g:Grunnlag)
      OPTIONAL MATCH (ov)-[:HAR_REGEL]->(ln:LogicalNode)
      OPTIONAL MATCH (ln)-[:EVALUERER]->(k:Kravelement)
      OPTIONAL MATCH (ov)-[:GIR_TILGANG_TIL]->(kv:KvoteType)
      OPTIONAL MATCH (ov)-[:BRUKER_RANGERING]->(rt:RangeringType)
      RETURN ov, g.id as grunnlag, collect(DISTINCT k.id) as krav, kv.id as kvote, rt.id as rangering, ln.type as logicalNodeType
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
      logicalNodeType: record.get('logicalNodeType') || 'AND',
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
