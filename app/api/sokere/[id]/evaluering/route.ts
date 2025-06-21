import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { evaluateOpptaksVei, getSokerProfile, OpptaksVeiEvaluering } from '@/lib/evaluering';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sokerId } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { regelsettId, utdanningstilbudId } = body;

    if (!regelsettId && !utdanningstilbudId) {
      return NextResponse.json(
        { error: 'Enten regelsettId eller utdanningstilbudId må oppgis' },
        { status: 400 }
      );
    }

    // Sjekk at søker eksisterer
    const sokerProfile = await getSokerProfile(sokerId);
    if (!sokerProfile) {
      return NextResponse.json({ error: 'Søker ikke funnet' }, { status: 404 });
    }

    let opptaksVeier: any[] = [];

    if (regelsettId) {
      // Hent opptaksveier for regelsett (støtter både id og navn)
      const regelssettQuery = `
        MATCH (r:Regelsett)-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
        WHERE r.id = $regelsettId OR r.navn = $regelsettId
        RETURN ov, r
        ORDER BY ov.navn
      `;
      const regelssettResult = await session.run(regelssettQuery, { regelsettId });
      opptaksVeier = regelssettResult.records.map((record) => record.get('ov').properties);
    } else if (utdanningstilbudId) {
      // Hent opptaksveier via utdanningstilbud -> regelsett
      const tilbudQuery = `
        MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})-[:HAR_REGELSETT]->(r:Regelsett)-[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
        RETURN ov, r
        ORDER BY ov.navn
      `;
      const tilbudResult = await session.run(tilbudQuery, { utdanningstilbudId });
      opptaksVeier = tilbudResult.records.map((record) => record.get('ov').properties);
    }

    if (opptaksVeier.length === 0) {
      return NextResponse.json({
        soker: {
          id: sokerProfile.id,
          navn: `${sokerProfile.fornavn} ${sokerProfile.etternavn}`,
          alder: sokerProfile.alder,
        },
        kvalifiserteOpptaksVeier: [],
        ikkeKvalifiserteOpptaksVeier: [],
        sammendrag: {
          totaltAntallOpptaksVeier: 0,
          kvalifisert: 0,
          ikkeKvalifisert: 0,
        },
      });
    }

    // Evaluer hver opptaksvei
    const evalueringer: OpptaksVeiEvaluering[] = [];

    for (const opptaksVei of opptaksVeier) {
      const evaluering = await evaluateOpptaksVei(sokerId, opptaksVei.id);
      if (evaluering) {
        evalueringer.push(evaluering);
      }
    }

    // Separer kvalifiserte og ikke-kvalifiserte
    const kvalifiserteOpptaksVeier = evalueringer.filter((e) => e.oppfylt);
    const ikkeKvalifiserteOpptaksVeier = evalueringer.filter((e) => !e.oppfylt);

    // Lag sammendrag
    const sammendrag = {
      totaltAntallOpptaksVeier: evalueringer.length,
      kvalifisert: kvalifiserteOpptaksVeier.length,
      ikkeKvalifisert: ikkeKvalifiserteOpptaksVeier.length,
    };

    return NextResponse.json({
      soker: {
        id: sokerProfile.id,
        navn: `${sokerProfile.fornavn} ${sokerProfile.etternavn}`,
        alder: sokerProfile.alder,
        dokumentasjon: sokerProfile.dokumentasjon.map((d) => ({
          type: d.type,
          antallFagkoder: d.fagkoder.length,
        })),
      },
      kvalifiserteOpptaksVeier: kvalifiserteOpptaksVeier.map((e) => ({
        opptaksVei: e.opptaksVei,
        regeluttrykk: e.regeluttrykk,
        oppfylteKrav: e.evaluering.oppfylteKrav,
        evaluering: e.evaluering.detaljer,
      })),
      ikkeKvalifiserteOpptaksVeier: ikkeKvalifiserteOpptaksVeier.map((e) => ({
        opptaksVei: e.opptaksVei,
        regeluttrykk: e.regeluttrykk,
        manglendeFagkoder: e.evaluering.manglendeFagkoder,
        evaluering: e.evaluering.detaljer,
      })),
      sammendrag,
    });
  } catch (error) {
    console.error('Error evaluating søker:', error);
    return NextResponse.json({ error: 'Failed to evaluate søker' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sokerId } = await params;
  const { searchParams } = new URL(request.url);
  const opptaksVeiId = searchParams.get('opptaksVeiId');

  if (!opptaksVeiId) {
    return NextResponse.json({ error: 'opptaksVeiId query parameter er påkrevd' }, { status: 400 });
  }

  try {
    // Evaluer søker mot spesifikk opptaksvei
    const evaluering = await evaluateOpptaksVei(sokerId, opptaksVeiId);

    if (!evaluering) {
      return NextResponse.json({ error: 'Søker eller opptaksvei ikke funnet' }, { status: 404 });
    }

    return NextResponse.json(evaluering);
  } catch (error) {
    console.error('Error evaluating søker against opptaksvei:', error);
    return NextResponse.json({ error: 'Failed to evaluate søker' }, { status: 500 });
  }
}
