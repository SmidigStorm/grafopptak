import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    // Hent opptaksvei med LogicalNode struktur
    const query = `
      MATCH (ov:OpptaksVei {id: $id})
      OPTIONAL MATCH (ov)-[:HAR_REGEL]->(root:LogicalNode)
      RETURN ov, root
    `;

    const result = await session.run(query, { id });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Opptaksvei ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const opptaksvei = record.get('ov').properties;
    const rootNode = record.get('root')?.properties;

    if (!rootNode) {
      return NextResponse.json({
        opptaksvei,
        krav: null,
        regeluttrykk: 'Ingen krav definert'
      });
    }

    // Bygg regeluttrykk rekursivt
    const regeluttrykk = await buildRegeluttrykk(session, rootNode.navn);
    const detaljertKrav = await buildDetaljertKrav(session, rootNode.navn);

    return NextResponse.json({
      opptaksvei,
      krav: detaljertKrav,
      regeluttrykk
    });

  } catch (error) {
    console.error('Error fetching krav for opptaksvei:', error);
    return NextResponse.json({ error: 'Failed to fetch krav' }, { status: 500 });
  } finally {
    await session.close();
  }
}

async function buildRegeluttrykk(session: any, nodeName: string): Promise<string> {
  const query = `
    MATCH (node:LogicalNode {navn: $nodeName})
    OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
    OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
    RETURN 
      node,
      collect(DISTINCT krav) as kravelementer,
      collect(DISTINCT childNode) as childNodes
  `;

  const result = await session.run(query, { nodeName });
  if (result.records.length === 0) return '';

  const record = result.records[0];
  const node = record.get('node').properties;
  const kravelementer = record.get('kravelementer').filter((k: any) => k);
  const childNodes = record.get('childNodes').filter((n: any) => n);

  const parts: string[] = [];

  // Legg til direkte kravelementer
  kravelementer.forEach((krav: any) => {
    parts.push(krav.properties.navn);
  });

  // Legg til child nodes rekursivt
  for (const childNode of childNodes) {
    const childExpr = await buildRegeluttrykk(session, childNode.properties.navn);
    if (childExpr) {
      parts.push(`(${childExpr})`);
    }
  }

  // Bygg uttrykk basert på node type
  let expression = '';
  
  if (node.type === 'AND') {
    expression = parts.join(' OG ');
  } else if (node.type === 'OR') {
    expression = parts.join(' ELLER ');
  } else if (node.type === 'NOT') {
    expression = `IKKE (${parts.join(' OG ')})`;
  }

  return expression;
}

async function buildDetaljertKrav(session: any, nodeName: string): Promise<any> {
  const query = `
    MATCH (node:LogicalNode {navn: $nodeName})
    OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
    OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
    RETURN 
      node,
      collect(DISTINCT krav) as kravelementer,
      collect(DISTINCT childNode) as childNodes
  `;

  const result = await session.run(query, { nodeName });
  if (result.records.length === 0) return null;

  const record = result.records[0];
  const node = record.get('node').properties;
  const kravelementer = record.get('kravelementer').filter((k: any) => k).map((k: any) => k.properties);
  const childNodes = record.get('childNodes').filter((n: any) => n);

  const detaljert: any = {
    node: node,
    kravelementer,
    childNodes: []
  };

  // Rekursivt bygg child nodes
  for (const childNode of childNodes) {
    const childDetaljert = await buildDetaljertKrav(session, childNode.properties.navn);
    if (childDetaljert) {
      detaljert.childNodes.push(childDetaljert);
    }
  }

  return detaljert;
}