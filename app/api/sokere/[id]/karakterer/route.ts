import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const { searchParams } = new URL(request.url);
    const fagkodeKode = searchParams.get('fagkode');
    const gruppering = searchParams.get('gruppering') || 'fagkode'; // 'fagkode' eller 'dokument'

    let query: string;

    if (gruppering === 'dokument') {
      // Gruppering per dokument
      query = `
        MATCH (p:Person {id: $personId})-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
        ${fagkodeKode ? 'WHERE fk.kode = $fagkodeKode' : ''}
        WITH d, collect({
          fagkode: fk,
          karakter: r.karakter,
          karaktersystem: r.karaktersystem,
          dato: r.dato,
          kommentar: r.kommentar
        }) as karakterer
        RETURN d, karakterer
        ORDER BY d.utstedt DESC
      `;
    } else {
      // Gruppering per fagkode (viser historikk)
      query = `
        MATCH (p:Person {id: $personId})-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
        ${fagkodeKode ? 'WHERE fk.kode = $fagkodeKode' : ''}
        WITH fk, collect({
          dokumentasjon: d,
          karakter: r.karakter,
          karaktersystem: r.karaktersystem,
          dato: r.dato,
          kommentar: r.kommentar
        }) as historikk
        RETURN fk, historikk
        ORDER BY fk.kode
      `;
    }

    const result = await session.run(query, { personId: id, fagkodeKode });

    if (gruppering === 'dokument') {
      const dokumenter = result.records.map((record) => ({
        dokumentasjon: record.get('d').properties,
        karakterer: record
          .get('karakterer')
          .filter((k: any) => k.fagkode)
          .map((k: any) => ({
            ...k.fagkode.properties,
            karakter: k.karakter,
            karaktersystem: k.karaktersystem,
            dato: k.dato,
            kommentar: k.kommentar,
          })),
      }));

      return NextResponse.json(dokumenter);
    } else {
      const fagkoder = result.records.map((record) => ({
        fagkode: record.get('fk').properties,
        historikk: record
          .get('historikk')
          .map((h: any) => ({
            dokumentasjon: h.dokumentasjon.properties,
            karakter: h.karakter,
            karaktersystem: h.karaktersystem,
            dato: h.dato,
            kommentar: h.kommentar,
          }))
          .sort((a: any, b: any) => new Date(b.dato).getTime() - new Date(a.dato).getTime()),
      }));

      return NextResponse.json(fagkoder);
    }
  } catch (error) {
    console.error('Error fetching karakterer:', error);
    return NextResponse.json({ error: 'Failed to fetch karakterer' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// Hent beste karakter for hver fagkode
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { fagkoder } = body; // Array av fagkode-koder å sjekke

    const query = `
      MATCH (p:Person {id: $personId})-[:HAR_DOKUMENTASJON]->(d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
      ${fagkoder ? 'WHERE fk.kode IN $fagkoder' : ''}
      WITH fk, r
      ORDER BY 
        CASE r.karaktersystem 
          WHEN '1-6' THEN toInteger(r.karakter) 
          WHEN 'bestått/ikke bestått' THEN CASE r.karakter WHEN 'bestått' THEN 1 ELSE 0 END
        END DESC,
        r.dato DESC
      WITH fk, collect(r)[0] as besteKarakter
      RETURN fk, besteKarakter
    `;

    const result = await session.run(query, { personId: id, fagkoder });

    const besteKarakterer = result.records.map((record) => ({
      fagkode: record.get('fk').properties,
      karakter: record.get('besteKarakter').properties.karakter,
      karaktersystem: record.get('besteKarakter').properties.karaktersystem,
      dato: record.get('besteKarakter').properties.dato,
      kommentar: record.get('besteKarakter').properties.kommentar,
    }));

    return NextResponse.json(besteKarakterer);
  } catch (error) {
    console.error('Error fetching beste karakterer:', error);
    return NextResponse.json({ error: 'Failed to fetch beste karakterer' }, { status: 500 });
  } finally {
    await session.close();
  }
}
