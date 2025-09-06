import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import {
  LogicalExpression,
  saveLogicalExpression,
  extractRequirementIds,
} from '@/lib/logicalExpression';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: regelsetId } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const {
      navn,
      beskrivelse,
      grunnlagId,
      kravIds = [],
      kvoteId,
      rangeringId,
      aktiv = true,
      logicalNodeType = 'AND',
      logicalExpression,
    } = body;

    // Validate required fields
    if (!navn || !grunnlagId || !kvoteId || !rangeringId) {
      return NextResponse.json(
        { error: 'Navn, grunnlagId, kvoteId og rangeringId er påkrevde felter' },
        { status: 400 }
      );
    }

    // Check if regelsett exists
    const regelsetCheck = await session.run('MATCH (r:Regelsett {id: $id}) RETURN r', {
      id: regelsetId,
    });

    if (regelsetCheck.records.length === 0) {
      return NextResponse.json({ error: 'Regelsett ikke funnet' }, { status: 404 });
    }

    // Validate that referenced components exist
    const componentCheck = await session.run(
      `
      MATCH (g:Grunnlag {id: $grunnlagId})
      OPTIONAL MATCH (kv:KvoteType {id: $kvoteId})
      OPTIONAL MATCH (rt:RangeringType {id: $rangeringId})
      RETURN g, kv, rt
    `,
      { grunnlagId, kvoteId, rangeringId }
    );

    if (
      componentCheck.records.length === 0 ||
      !componentCheck.records[0].get('g') ||
      !componentCheck.records[0].get('kv') ||
      !componentCheck.records[0].get('rt')
    ) {
      return NextResponse.json(
        { error: 'En eller flere refererte komponenter finnes ikke' },
        { status: 400 }
      );
    }

    // Determine final kravIds and LogicalExpression to use
    let finalKravIds = kravIds;
    let finalLogicalExpression = logicalExpression;

    // If logicalExpression is provided, use that and extract kravIds from it
    if (logicalExpression) {
      finalKravIds = extractRequirementIds(logicalExpression);
      finalLogicalExpression = logicalExpression;
    } else if (kravIds.length > 0) {
      // If only kravIds provided, create simple LogicalExpression
      finalLogicalExpression = {
        type: 'GROUP' as const,
        operator: logicalNodeType as 'AND' | 'OR',
        children: finalKravIds.map((kravId: string) => ({
          type: 'REQUIREMENT' as const,
          requirementId: kravId,
          requirementName: `Krav ${kravId}`, // Will be updated when we validate
        })),
      };
    }

    // Validate krav if provided
    if (finalKravIds.length > 0) {
      const kravCheck = await session.run(
        `
        UNWIND $kravIds as kravId
        MATCH (k:Kravelement {id: kravId})
        RETURN count(k) as count
      `,
        { kravIds: finalKravIds }
      );

      const foundKrav = kravCheck.records[0].get('count').toNumber();
      if (foundKrav !== finalKravIds.length) {
        return NextResponse.json({ error: 'En eller flere krav finnes ikke' }, { status: 400 });
      }
    }

    // Create the OpptaksVei first
    const createOpptaksVeiQuery = `
      MATCH (r:Regelsett {id: $regelsetId}),
            (g:Grunnlag {id: $grunnlagId}),
            (kv:KvoteType {id: $kvoteId}),
            (rt:RangeringType {id: $rangeringId})
      CREATE (ov:OpptaksVei {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        aktiv: $aktiv,
        opprettet: datetime()
      })
      CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)
      CREATE (ov)-[:BASERT_PÅ]->(g)
      CREATE (ov)-[:GIR_TILGANG_TIL]->(kv)
      CREATE (ov)-[:BRUKER_RANGERING]->(rt)
      RETURN ov
    `;

    const result = await session.run(createOpptaksVeiQuery, {
      regelsetId,
      navn,
      beskrivelse,
      grunnlagId,
      kvoteId,
      rangeringId,
      aktiv,
    });

    const opptaksVei = result.records[0].get('ov').properties;

    // Add LogicalNode with requirements if any exist
    if (finalLogicalExpression && finalKravIds.length > 0) {
      const logicalNodeId = await saveLogicalExpression(
        session,
        finalLogicalExpression,
        `${navn} - Krav`
      );

      // Connect the OpptaksVei to the root LogicalNode
      await session.run(
        `
        MATCH (ov:OpptaksVei {id: $opptaksVeiId})
        MATCH (ln:LogicalNode {id: $logicalNodeId})
        CREATE (ov)-[:HAR_REGEL]->(ln)
        `,
        {
          opptaksVeiId: opptaksVei.id,
          logicalNodeId,
        }
      );
    }

    // Return the created OpptaksVei with relationships
    return NextResponse.json(
      {
        id: opptaksVei.id,
        navn: opptaksVei.navn,
        beskrivelse: opptaksVei.beskrivelse,
        grunnlag: grunnlagId,
        krav: finalKravIds,
        kvote: kvoteId,
        rangering: rangeringId,
        logicalNodeType: logicalNodeType,
        logicalExpression: finalLogicalExpression,
        aktiv: opptaksVei.aktiv,
        opprettet: opptaksVei.opprettet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feil ved opprettelse av opptaksvei:', error);
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 });
  } finally {
    await session.close();
  }
}
