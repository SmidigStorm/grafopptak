import { getSession } from '../lib/neo4j';
import { LogicalExpression, saveLogicalExpression } from '../lib/logicalExpression';

/**
 * Script to add better nested LogicalExpression examples to the existing seeded data
 * This demonstrates complex requirements like "GSK AND (R1 OR S2)" and "(Fagbrev AND Experience) OR (Age 25+ AND Study Competence)"
 */

export async function addNestedExamples() {
  const session = getSession();

  try {
    console.log('🌳 Adding nested LogicalExpression examples...');

    // First, find the NTNU Avansert regelsett to add a new complex opptaksvei
    const regelsetQuery = await session.run(`
      MATCH (regelsett:Regelsett {navn: 'NTNU Ingeniør Avansert H25'})
      RETURN regelsett.id as regelsetId
    `);

    if (regelsetQuery.records.length === 0) {
      console.error('❌ Could not find NTNU Ingeniør Avansert H25 regelsett');
      return;
    }

    const regelsetId = regelsetQuery.records[0].get('regelsetId');

    // Get required entities for the new opptaksvei
    const entitiesQuery = await session.run(`
      MATCH (grunnlag:Grunnlag {type: '23-5-regel'})
      MATCH (kvote:KvoteType {type: 'fagbrev'})
      MATCH (rangering:RangeringType {type: 'konkurransepoeng'})
      RETURN grunnlag.id as grunnlagId, kvote.id as kvoteId, rangering.id as rangeringId
    `);

    if (entitiesQuery.records.length === 0) {
      console.error('❌ Could not find required entities for nested example');
      return;
    }

    const { grunnlagId, kvoteId, rangeringId } = entitiesQuery.records[0].toObject();

    // Get kravelement IDs for our nested examples
    const kravQuery = await session.run(`
      MATCH (gsk:Kravelement {navn: 'Generell studiekompetanse'})
      MATCH (matR1:Kravelement {navn: 'Matematikk R1'}) 
      MATCH (matR2:Kravelement {navn: 'Matematikk R2'})
      MATCH (fagbrev:Kravelement {navn: 'Fagbrev'})
      MATCH (arbeidserfaring:Kravelement {navn: 'Arbeidserfaring 2 år'})
      MATCH (alder25:Kravelement {navn: 'Alder 25 år eller eldre'})
      RETURN 
        gsk.id as gskId, gsk.navn as gskNavn,
        matR1.id as matR1Id, matR1.navn as matR1Navn,
        matR2.id as matR2Id, matR2.navn as matR2Navn,
        fagbrev.id as fagbrevId, fagbrev.navn as fagbrevNavn,
        arbeidserfaring.id as arbeidsfaringId, arbeidserfaring.navn as arbeidsfaringNavn,
        alder25.id as alder25Id, alder25.navn as alder25Navn
    `);

    if (kravQuery.records.length === 0) {
      console.error('❌ Could not find required kravelementer for nested examples');
      return;
    }

    const krav = kravQuery.records[0].toObject();

    // Example 1: GSK AND (Matematikk R1 OR Matematikk R2)
    const example1: LogicalExpression = {
      type: 'GROUP',
      operator: 'AND',
      children: [
        {
          type: 'REQUIREMENT',
          requirementId: krav.gskId,
          requirementName: krav.gskNavn,
        },
        {
          type: 'GROUP',
          operator: 'OR',
          children: [
            {
              type: 'REQUIREMENT',
              requirementId: krav.matR1Id,
              requirementName: krav.matR1Navn,
            },
            {
              type: 'REQUIREMENT',
              requirementId: krav.matR2Id,
              requirementName: krav.matR2Navn,
            },
          ],
        },
      ],
    };

    // Example 2: (Fagbrev AND Arbeidserfaring) OR (Alder 25+ AND GSK)
    const example2: LogicalExpression = {
      type: 'GROUP',
      operator: 'OR',
      children: [
        {
          type: 'GROUP',
          operator: 'AND',
          children: [
            {
              type: 'REQUIREMENT',
              requirementId: krav.fagbrevId,
              requirementName: krav.fagbrevNavn,
            },
            {
              type: 'REQUIREMENT',
              requirementId: krav.arbeidsfaringId,
              requirementName: krav.arbeidsfaringNavn,
            },
          ],
        },
        {
          type: 'GROUP',
          operator: 'AND',
          children: [
            {
              type: 'REQUIREMENT',
              requirementId: krav.alder25Id,
              requirementName: krav.alder25Navn,
            },
            {
              type: 'REQUIREMENT',
              requirementId: krav.gskId,
              requirementName: krav.gskNavn,
            },
          ],
        },
      ],
    };

    // Create LogicalNodes for both examples
    console.log('🔧 Creating nested LogicalExpression 1: GSK AND (R1 OR R2)...');
    const logicalNode1Id = await saveLogicalExpression(
      session,
      example1,
      'Nested Demo 1 - GSK AND (R1 OR R2)'
    );

    console.log(
      '🔧 Creating nested LogicalExpression 2: (Fagbrev AND Experience) OR (Age25+ AND GSK)...'
    );
    const logicalNode2Id = await saveLogicalExpression(
      session,
      example2,
      'Nested Demo 2 - (Fagbrev AND Experience) OR (Age25+ AND GSK)'
    );

    // Create the first demo opptaksvei: GSK AND (R1 OR S2)
    const opptaksVei1Result = await session.run(
      `
      MATCH (regelsett:Regelsett {id: $regelsetId})
      MATCH (grunnlag:Grunnlag {id: $grunnlagId})
      MATCH (kvote:KvoteType {id: $kvoteId})
      MATCH (rangering:RangeringType {id: $rangeringId})
      MATCH (logicalNode:LogicalNode {id: $logicalNodeId})
      
      CREATE (opptaksVei:OpptaksVei {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      
      CREATE (regelsett)-[:HAR_OPPTAKSVEI]->(opptaksVei)
      CREATE (opptaksVei)-[:BASERT_PÅ]->(grunnlag)
      CREATE (opptaksVei)-[:HAR_REGEL]->(logicalNode)
      CREATE (opptaksVei)-[:GIR_TILGANG_TIL]->(kvote)
      CREATE (opptaksVei)-[:BRUKER_RANGERING]->(rangering)
      
      RETURN opptaksVei.id as opptaksVeiId
    `,
      {
        regelsetId,
        grunnlagId,
        kvoteId,
        rangeringId,
        logicalNodeId: logicalNode1Id,
        navn: 'Demo Nested: GSK og (R1 eller R2)',
        beskrivelse: 'Demonstrasjon av nested logic: GSK AND (Matematikk R1 OR Matematikk R2)',
      }
    );

    // Create the second demo opptaksvei: (Fagbrev AND Experience) OR (Age25+ AND GSK)
    const opptaksVei2Result = await session.run(
      `
      MATCH (regelsett:Regelsett {id: $regelsetId})
      MATCH (grunnlag:Grunnlag {id: $grunnlagId})
      MATCH (kvote:KvoteType {id: $kvoteId})
      MATCH (rangering:RangeringType {id: $rangeringId})
      MATCH (logicalNode:LogicalNode {id: $logicalNodeId})
      
      CREATE (opptaksVei:OpptaksVei {
        id: randomUUID(),
        navn: $navn,
        beskrivelse: $beskrivelse,
        aktiv: true,
        opprettet: datetime()
      })
      
      CREATE (regelsett)-[:HAR_OPPTAKSVEI]->(opptaksVei)
      CREATE (opptaksVei)-[:BASERT_PÅ]->(grunnlag)
      CREATE (opptaksVei)-[:HAR_REGEL]->(logicalNode)
      CREATE (opptaksVei)-[:GIR_TILGANG_TIL]->(kvote)
      CREATE (opptaksVei)-[:BRUKER_RANGERING]->(rangering)
      
      RETURN opptaksVei.id as opptaksVeiId
    `,
      {
        regelsetId,
        grunnlagId,
        kvoteId,
        rangeringId,
        logicalNodeId: logicalNode2Id,
        navn: 'Demo Nested: (Fagbrev og Experience) eller (Alder25+ og GSK)',
        beskrivelse:
          'Demonstrasjon av complex nested logic: (Fagbrev AND Arbeidserfaring) OR (Alder 25+ AND GSK)',
      }
    );

    const vei1Id = opptaksVei1Result.records[0].get('opptaksVeiId');
    const vei2Id = opptaksVei2Result.records[0].get('opptaksVeiId');

    console.log('✅ Created nested LogicalExpression demo opptaksveier:');
    console.log(`   🌳 OpptaksVei 1: ${vei1Id} - GSK AND (R1 OR R2)`);
    console.log(`   🌳 OpptaksVei 2: ${vei2Id} - (Fagbrev AND Experience) OR (Age25+ AND GSK)`);

    // Verify the created structures
    console.log('🔍 Verifying nested structures...');

    const verifyQuery = await session.run(
      `
      MATCH (ov:OpptaksVei)-[:HAR_REGEL]->(ln:LogicalNode)
      WHERE ov.id IN [$vei1Id, $vei2Id]
      OPTIONAL MATCH (ln)-[:EVALUERER*]->(related)
      RETURN 
        ov.id as opptaksVeiId,
        ov.navn as opptaksVeiNavn,
        ln.id as rootLogicalNodeId,
        ln.navn as rootLogicalNodeNavn,
        count(related) as totalRelatedNodes
      ORDER BY ov.navn
    `,
      { vei1Id, vei2Id }
    );

    verifyQuery.records.forEach((record) => {
      console.log(
        `   ✅ ${record.get('opptaksVeiNavn')}: ${record.get('totalRelatedNodes')} related nodes`
      );
    });
  } catch (error) {
    console.error('❌ Error adding nested examples:', error);
  } finally {
    await session.close();
  }
}

// Run the function if called directly
if (require.main === module) {
  addNestedExamples()
    .then(() => {
      console.log('🎉 Successfully added nested LogicalExpression examples!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Failed to add nested examples:', error);
      process.exit(1);
    });
}
