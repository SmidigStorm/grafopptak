import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'utdanning';

  const session = getSession();

  try {
    // Hent noder og relasjoner basert på søk
    const result = await session.run(
      `
      MATCH (n)
      WHERE n.name CONTAINS $query OR labels(n)[0] CONTAINS $query
      WITH n LIMIT 50
      OPTIONAL MATCH (n)-[r]-(m)
      RETURN 
        collect(DISTINCT n) as nodes1,
        collect(DISTINCT m) as nodes2,
        collect(DISTINCT r) as relationships
      `,
      { query }
    );

    const record = result.records[0];
    const nodes1 = record.get('nodes1') || [];
    const nodes2 = record.get('nodes2') || [];
    const relationships = record.get('relationships') || [];

    // Kombiner og formater noder
    const allNodes = [...nodes1, ...nodes2];
    const uniqueNodes = new Map();

    allNodes.forEach((node) => {
      if (node && node.identity) {
        const id = node.identity.toString();
        if (!uniqueNodes.has(id)) {
          uniqueNodes.set(id, {
            id,
            labels: node.labels,
            properties: node.properties,
            // NVL format
            name: node.properties.name || node.labels[0] || 'Node',
            color: getColorByLabel(node.labels[0]),
            size: 30,
          });
        }
      }
    });

    // Formater relasjoner
    const formattedRelationships = relationships
      .filter((rel: any) => rel && rel.identity)
      .map((rel: any) => ({
        id: rel.identity.toString(),
        from: rel.start.toString(),
        to: rel.end.toString(),
        type: rel.type,
        properties: rel.properties,
        // NVL format
        caption: rel.type,
      }));

    await session.close();

    return NextResponse.json({
      nodes: Array.from(uniqueNodes.values()),
      relationships: formattedRelationships,
    });
  } catch (error) {
    await session.close();
    console.error('Graph query error:', error);
    return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 });
  }
}

function getColorByLabel(label: string): string {
  const colors: Record<string, string> = {
    Person: '#10b981',
    Utdanning: '#3b82f6',
    Institusjon: '#8b5cf6',
    Opptak: '#f59e0b',
    Søknad: '#ef4444',
    Regelsett: '#6366f1',
  };
  return colors[label] || '#64748b';
}
