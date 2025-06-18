import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (rm:RegelsettMal {id: $id})
      OPTIONAL MATCH (rm)-[:INNEHOLDER]->(g:Grunnlag)
      OPTIONAL MATCH (g)-[:KREVER]->(ke:Kravelement)
      OPTIONAL MATCH (g)-[:GIR_TILGANG_TIL]->(kt:KvoteType)
      OPTIONAL MATCH (g)-[:BRUKER_RANGERING]->(rt:RangeringType)
      
      WITH rm, g,
           collect(DISTINCT {
             id: ke.id,
             navn: ke.navn,
             type: ke.type,
             beskrivelse: ke.beskrivelse,
             aktiv: ke.aktiv
           }) as krav,
           collect(DISTINCT {
             id: kt.id,
             navn: kt.navn,
             type: kt.type,
             beskrivelse: kt.beskrivelse,
             aktiv: kt.aktiv
           }) as kvoter,
           collect(DISTINCT {
             id: rt.id,
             navn: rt.navn,
             type: rt.type,
             formelMal: rt.formelMal,
             beskrivelse: rt.beskrivelse,
             aktiv: rt.aktiv
           }) as rangeringer
      
      WITH rm, 
           collect(DISTINCT {
             id: g.id,
             navn: g.navn,
             type: g.type,
             beskrivelse: g.beskrivelse,
             aktiv: g.aktiv,
             krav: [x IN krav WHERE x.id IS NOT NULL],
             kvoter: [x IN kvoter WHERE x.id IS NOT NULL],
             rangeringer: [x IN rangeringer WHERE x.id IS NOT NULL]
           }) as opptaksveier
      
      RETURN {
        id: rm.id,
        navn: rm.navn,
        beskrivelse: rm.beskrivelse,
        versjon: rm.versjon,
        opprettet: rm.opprettet,
        aktiv: rm.aktiv,
        opptaksveier: [x IN opptaksveier WHERE x.id IS NOT NULL]
      } as regelsettMal
    `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Regelsett-mal ikke funnet',
        },
        { status: 404 }
      );
    }

    const regelsettMal = result.records[0].get('regelsettMal');

    return NextResponse.json({
      success: true,
      data: regelsettMal,
    });
  } catch (error) {
    console.error('Feil ved henting av regelsett-mal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kunne ikke hente regelsett-mal',
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
