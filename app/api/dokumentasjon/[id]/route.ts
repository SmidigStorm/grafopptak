import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const query = `
      MATCH (d:Dokumentasjon {id: $id})
      OPTIONAL MATCH (p:Person)-[:EIER]->(d)
      OPTIONAL MATCH (d)-[r:INNEHOLDER]->(fk:Fagkode)
      WITH d, p, collect({
        fagkode: fk,
        karakter: r.karakter,
        karaktersystem: r.karaktersystem,
        dato: r.dato,
        kommentar: r.kommentar
      }) as fagkoder
      RETURN d, p, fagkoder
    `;

    const result = await session.run(query, { id });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Dokumentasjon ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const dokumentasjon = record.get('d').properties;
    const eier = record.get('p')?.properties;
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

    return NextResponse.json({
      ...dokumentasjon,
      eier,
      fagkoder,
    });
  } catch (error) {
    console.error('Error fetching dokumentasjon:', error);
    return NextResponse.json({ error: 'Failed to fetch dokumentasjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSession();

  try {
    const body = await request.json();
    const { type, navn, utstedt, utsteder, utdanningsnivaa, gyldigTil, aktiv } = body;

    const query = `
      MATCH (d:Dokumentasjon {id: $id})
      SET d.type = $type,
          d.navn = $navn,
          d.utstedt = ${utstedt ? 'date($utstedt)' : 'null'},
          d.utsteder = $utsteder,
          d.utdanningsnivaa = $utdanningsnivaa,
          d.gyldigTil = ${gyldigTil ? 'date($gyldigTil)' : 'null'},
          d.aktiv = $aktiv
      RETURN d
    `;

    const result = await session.run(query, {
      id,
      type,
      navn,
      utstedt,
      utsteder,
      utdanningsnivaa,
      gyldigTil,
      aktiv,
    });

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Dokumentasjon ikke funnet' }, { status: 404 });
    }

    const dokumentasjon = result.records[0].get('d').properties;

    return NextResponse.json(dokumentasjon);
  } catch (error) {
    console.error('Error updating dokumentasjon:', error);
    return NextResponse.json({ error: 'Failed to update dokumentasjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession();

  try {
    const query = `
      MATCH (d:Dokumentasjon {id: $id})
      DETACH DELETE d
      RETURN count(d) as deleted
    `;

    const result = await session.run(query, { id });
    const deleted = result.records[0].get('deleted').toNumber();

    if (deleted === 0) {
      return NextResponse.json({ error: 'Dokumentasjon ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Dokumentasjon slettet' });
  } catch (error) {
    console.error('Error deleting dokumentasjon:', error);
    return NextResponse.json({ error: 'Failed to delete dokumentasjon' }, { status: 500 });
  } finally {
    await session.close();
  }
}
