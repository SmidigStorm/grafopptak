import { Session } from 'neo4j-driver';

export interface LogicalExpression {
  type: 'GROUP' | 'REQUIREMENT';
  operator?: 'AND' | 'OR'; // for GROUP type
  children?: LogicalExpression[]; // for GROUP type
  requirementId?: string; // for REQUIREMENT type
  requirementName?: string; // for display purposes
}

/**
 * Recursively saves a LogicalExpression as nested LogicalNodes in the database
 * Returns the ID of the root LogicalNode
 */
export async function saveLogicalExpression(
  session: Session,
  expression: LogicalExpression,
  expressionName?: string
): Promise<string> {
  if (expression.type === 'REQUIREMENT') {
    // For single requirements, create a simple LogicalNode that EVALUERER the requirement
    if (!expression.requirementId) {
      throw new Error(`Missing requirementId for REQUIREMENT: ${expression.requirementName}`);
    }

    const result = await session.run(
      `
      CREATE (ln:LogicalNode {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        type: 'REQUIREMENT',
        opprettet: datetime()
      })
      WITH ln
      MATCH (k:Kravelement {id: $requirementId})
      CREATE (ln)-[:EVALUERER]->(k)
      RETURN ln.id as logicalNodeId
      `,
      {
        navn: expressionName || `Krav: ${expression.requirementName || 'Ukjent'}`,
        beskrivelse: `LogicalNode for ${expression.requirementName || 'ukjent krav'}`,
        requirementId: expression.requirementId,
      }
    );

    return result.records[0].get('logicalNodeId');
  }

  if (expression.type === 'GROUP') {
    // Create the group LogicalNode
    const result = await session.run(
      `
      CREATE (ln:LogicalNode {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        type: $operator,
        opprettet: datetime()
      })
      RETURN ln.id as logicalNodeId
      `,
      {
        navn: expressionName || `${expression.operator || 'AND'} gruppe`,
        beskrivelse: `LogicalNode gruppe med ${expression.operator || 'AND'} operator`,
        operator: expression.operator || 'AND',
      }
    );

    const parentLogicalNodeId = result.records[0].get('logicalNodeId');

    // Recursively create child LogicalNodes
    if (expression.children && expression.children.length > 0) {
      for (let i = 0; i < expression.children.length; i++) {
        const child = expression.children[i];
        const childName =
          child.type === 'REQUIREMENT'
            ? `Krav: ${child.requirementName || 'Ukjent'}`
            : `${child.operator || 'AND'} undergruppe ${i + 1}`;

        const childLogicalNodeId = await saveLogicalExpression(session, child, childName);

        // Connect parent to child
        await session.run(
          `
          MATCH (parent:LogicalNode {id: $parentId})
          MATCH (child:LogicalNode {id: $childId})
          CREATE (parent)-[:EVALUERER]->(child)
          `,
          {
            parentId: parentLogicalNodeId,
            childId: childLogicalNodeId,
          }
        );
      }
    }

    return parentLogicalNodeId;
  }

  throw new Error(`Unknown LogicalExpression type: ${expression.type}`);
}

/**
 * Recursively builds a LogicalExpression from a LogicalNode ID in the database
 */
export async function buildLogicalExpression(
  session: Session,
  logicalNodeId: string
): Promise<LogicalExpression | null> {
  const query = `
    MATCH (node:LogicalNode {id: $logicalNodeId})
    OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
    OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
    RETURN 
      node,
      collect(DISTINCT krav) as kravelementer,
      collect(DISTINCT childNode) as childNodes
  `;

  const result = await session.run(query, { logicalNodeId });

  if (result.records.length === 0) {
    return null;
  }

  const record = result.records[0];
  const node = record.get('node').properties;
  const kravelementer = record
    .get('kravelementer')
    .filter((k: any) => k)
    .map((k: any) => k.properties);
  const childNodes = record.get('childNodes').filter((n: any) => n);

  // If this node directly references requirements and has no child LogicalNodes,
  // and there's only one requirement, return it as a REQUIREMENT type
  if (kravelementer.length === 1 && childNodes.length === 0) {
    const krav = kravelementer[0];
    return {
      type: 'REQUIREMENT',
      requirementId: krav.id,
      requirementName: krav.navn,
    };
  }

  // If this node has multiple requirements or child nodes, it's a GROUP
  const children: LogicalExpression[] = [];

  // Add direct requirements as REQUIREMENT children
  for (const krav of kravelementer) {
    children.push({
      type: 'REQUIREMENT',
      requirementId: krav.id,
      requirementName: krav.navn,
    });
  }

  // Recursively add child LogicalNodes
  for (const childNode of childNodes) {
    const childExpression = await buildLogicalExpression(session, childNode.properties.id);
    if (childExpression) {
      children.push(childExpression);
    }
  }

  return {
    type: 'GROUP',
    operator: node.type === 'AND' || node.type === 'OR' ? node.type : 'AND',
    children,
  };
}

/**
 * Alternative version that uses LogicalNode navn instead of id (for backwards compatibility)
 */
export async function buildLogicalExpressionByName(
  session: Session,
  logicalNodeName: string
): Promise<LogicalExpression | null> {
  const query = `
    MATCH (node:LogicalNode {navn: $logicalNodeName})
    OPTIONAL MATCH (node)-[:EVALUERER]->(krav:Kravelement)
    OPTIONAL MATCH (node)-[:EVALUERER]->(childNode:LogicalNode)
    RETURN 
      node,
      collect(DISTINCT krav) as kravelementer,
      collect(DISTINCT childNode) as childNodes
  `;

  const result = await session.run(query, { logicalNodeName });

  if (result.records.length === 0) {
    return null;
  }

  const record = result.records[0];
  const node = record.get('node').properties;
  const kravelementer = record
    .get('kravelementer')
    .filter((k: any) => k)
    .map((k: any) => k.properties);
  const childNodes = record.get('childNodes').filter((n: any) => n);

  // If this node directly references requirements and has no child LogicalNodes,
  // and there's only one requirement, return it as a REQUIREMENT type
  if (kravelementer.length === 1 && childNodes.length === 0) {
    const krav = kravelementer[0];
    return {
      type: 'REQUIREMENT',
      requirementId: krav.id,
      requirementName: krav.navn,
    };
  }

  // If this node has multiple requirements or child nodes, it's a GROUP
  const children: LogicalExpression[] = [];

  // Add direct requirements as REQUIREMENT children
  for (const krav of kravelementer) {
    children.push({
      type: 'REQUIREMENT',
      requirementId: krav.id,
      requirementName: krav.navn,
    });
  }

  // Recursively add child LogicalNodes
  for (const childNode of childNodes) {
    const childExpression = await buildLogicalExpressionByName(session, childNode.properties.navn);
    if (childExpression) {
      children.push(childExpression);
    }
  }

  return {
    type: 'GROUP',
    operator: node.type === 'AND' || node.type === 'OR' ? node.type : 'AND',
    children,
  };
}

/**
 * Utility function to extract all requirement IDs from a LogicalExpression
 */
export function extractRequirementIds(expression: LogicalExpression): string[] {
  if (expression.type === 'REQUIREMENT') {
    return expression.requirementId ? [expression.requirementId] : [];
  }

  if (expression.type === 'GROUP' && expression.children) {
    return expression.children.flatMap((child) => extractRequirementIds(child));
  }

  return [];
}

/**
 * Deletes a LogicalNode and all its nested children recursively
 */
export async function deleteLogicalExpression(
  session: Session,
  logicalNodeId: string
): Promise<void> {
  await session.run(
    `
    MATCH (ln:LogicalNode {id: $logicalNodeId})
    OPTIONAL MATCH (ln)-[:EVALUERER*]->(childNode:LogicalNode)
    DETACH DELETE ln, childNode
    `,
    { logicalNodeId }
  );
}
