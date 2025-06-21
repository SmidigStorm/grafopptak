import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/kravelementer/{id}/fagkoder - Hent fagkoder som kvalifiserer for dette kravelementet
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: kravelementId } = await params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (ke:Kravelement {id: $kravelementId})
      OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER]->(ke)
      RETURN ke, collect({
        id: fk.id,
        kode: fk.kode,
        navn: fk.navn,
        type: fk.type,
        omfang: fk.omfang
      }) as fagkoder
    `,
      { kravelementId }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Kravelement ikke funnet' }, { status: 404 });
    }

    const record = result.records[0];
    const kravelement = record.get('ke').properties;
    const fagkoder = record.get('fagkoder').filter((fk: any) => fk.id); // Filtrer bort tomme relasjoner

    return NextResponse.json({
      kravelement,
      fagkoder,
    });
  } catch (error) {
    console.error('Error fetching fagkoder for kravelement:', error);
    return NextResponse.json({ error: 'Failed to fetch fagkoder' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/kravelementer/{id}/fagkoder - Legg til fagkode som kvalifiserer for kravelementet
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: kravelementId } = await params;
  const session = getSession();

  try {
    const { fagkodeId } = await request.json();

    if (!fagkodeId) {
      return NextResponse.json({ error: 'fagkodeId er påkrevd' }, { status: 400 });
    }

    // Sjekk at både kravelement og fagkode eksisterer
    const checkResult = await session.run(
      `
      MATCH (ke:Kravelement {id: $kravelementId})
      MATCH (fk:Fagkode {id: $fagkodeId})
      RETURN ke, fk
    `,
      { kravelementId, fagkodeId }
    );

    if (checkResult.records.length === 0) {
      return NextResponse.json({ error: 'Kravelement eller fagkode ikke funnet' }, { status: 404 });
    }

    // Sjekk om relasjonen allerede eksisterer
    const existingResult = await session.run(
      `
      MATCH (fk:Fagkode {id: $fagkodeId})-[:KVALIFISERER]->(ke:Kravelement {id: $kravelementId})
      RETURN fk
    `,
      { kravelementId, fagkodeId }
    );

    if (existingResult.records.length > 0) {
      return NextResponse.json(
        { error: 'Fagkoden kvalifiserer allerede for dette kravelementet' },
        { status: 409 }
      );
    }

    // Opprett relasjonen
    await session.run(
      `
      MATCH (fk:Fagkode {id: $fagkodeId})
      MATCH (ke:Kravelement {id: $kravelementId})
      CREATE (fk)-[:KVALIFISERER]->(ke)
    `,
      { kravelementId, fagkodeId }
    );

    return NextResponse.json({ message: 'Fagkode lagt til som kvalifiserende' });
  } catch (error) {
    console.error('Error adding fagkode to kravelement:', error);
    return NextResponse.json({ error: 'Failed to add fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// DELETE /api/kravelementer/{id}/fagkoder - Fjern fagkode fra kravelement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kravelementId } = await params;
  const session = getSession();

  try {
    const { fagkodeId } = await request.json();

    if (!fagkodeId) {
      return NextResponse.json({ error: 'fagkodeId er påkrevd' }, { status: 400 });
    }

    // Fjern relasjonen
    const result = await session.run(
      `
      MATCH (fk:Fagkode {id: $fagkodeId})-[r:KVALIFISERER]->(ke:Kravelement {id: $kravelementId})
      DELETE r
      RETURN count(r) as slettet
    `,
      { kravelementId, fagkodeId }
    );

    const slettet = result.records[0].get('slettet').toNumber();

    if (slettet === 0) {
      return NextResponse.json({ error: 'Relasjon ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fagkode fjernet fra kravelement' });
  } catch (error) {
    console.error('Error removing fagkode from kravelement:', error);
    return NextResponse.json({ error: 'Failed to remove fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}
