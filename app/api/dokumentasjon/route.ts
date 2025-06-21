import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  const session = getSession();

  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    const query = `
      MATCH (d:Dokumentasjon)
      ${personId ? 'MATCH (p:Person {id: $personId})-[:HAR_DOKUMENTASJON]->(d)' : ''}
      OPTIONAL MATCH (d)-[r:INNEHOLDER]->(fk:Fagkode)
      WITH d, collect({
        fagkode: fk,
        karakter: r.karakter,
        karaktersystem: r.karaktersystem,
        dato: r.dato,
        kommentar: r.kommentar
      }) as fagkoder
      RETURN d, fagkoder
      ORDER BY d.utstedt DESC
    `;

    const result = await session.run(query, { personId });

    const dokumenter = result.records.map((record) => {
      const dok = record.get('d').properties;
      const fagkoder = record
        .get('fagkoder')
        .filter((f: any) => f.fagkode)
        .map((f: any) => ({
          ...f.fagkode.properties,
          karakter: f.karakter,
          karaktersystem: f.karaktersystem,
          dato: f.dato,
          kommentar: f.kommentar,
        }));

      return {
        ...dok,
        fagkoder,
      };
    });

    return NextResponse.json(dokumenter);
  } catch (error) {
    console.error('Error fetching dokumentasjon:', error);
    return NextResponse.json({ error: 'Failed to fetch dokumentasjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { personId, type, navn, utstedt, utsteder, utdanningsnivaa, gyldigTil } = body;

    if (!personId || !type || !navn) {
      return NextResponse.json({ error: 'personId, type og navn er påkrevd' }, { status: 400 });
    }

    const query = `
      MATCH (p:Person {id: $personId})
      CREATE (d:Dokumentasjon {
        id: randomUUID(),
        type: $type,
        navn: $navn,
        utstedt: ${utstedt ? 'date($utstedt)' : 'null'},
        utsteder: $utsteder,
        utdanningsnivaa: $utdanningsnivaa,
        gyldigTil: ${gyldigTil ? 'date($gyldigTil)' : 'null'},
        opprettet: datetime(),
        aktiv: true
      })
      CREATE (p)-[:HAR_DOKUMENTASJON]->(d)
      RETURN d
    `;

    const result = await session.run(query, {
      personId,
      type,
      navn,
      utstedt,
      utsteder,
      utdanningsnivaa,
      gyldigTil,
    });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Person ikke funnet' }, { status: 404 });
    }

    const dokumentasjon = result.records[0].get('d').properties;

    return NextResponse.json(dokumentasjon, { status: 201 });
  } catch (error) {
    console.error('Error creating dokumentasjon:', error);
    return NextResponse.json({ error: 'Failed to create dokumentasjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}
