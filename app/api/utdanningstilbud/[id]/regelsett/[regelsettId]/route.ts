import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; regelsettId: string }> }
) {
  const { id: utdanningstilbudId, regelsettId } = await params;
  const session = getSession();

  try {
    // Sjekk at relasjonen eksisterer
    const checkQuery = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})-[rel:HAR_REGELSETT]->(r:Regelsett {id: $regelsettId})
      RETURN rel
    `;

    const checkResult = await session.run(checkQuery, { utdanningstilbudId, regelsettId });
    if (checkResult.records.length === 0) {
      return NextResponse.json(
        { error: 'Regelsett er ikke knyttet til dette utdanningstilbudet' },
        { status: 404 }
      );
    }

    // Slett relasjonen
    const deleteQuery = `
      MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})-[rel:HAR_REGELSETT]->(r:Regelsett {id: $regelsettId})
      DELETE rel
      RETURN r.navn as navn
    `;

    const deleteResult = await session.run(deleteQuery, { utdanningstilbudId, regelsettId });
    const regelsettnavn = deleteResult.records[0].get('navn');

    return NextResponse.json({
      message: `Regelsett "${regelsettnavn}" er ikke lenger knyttet til utdanningstilbudet`,
    });
  } catch (error) {
    console.error('Error disconnecting regelsett from utdanningstilbud:', error);
    return NextResponse.json({ error: 'Failed to disconnect regelsett' }, { status: 500 });
  } finally {
    await session.close();
  }
}
