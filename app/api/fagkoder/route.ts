import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

// GET /api/fagkoder - Hent alle fagkoder
export async function GET() {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (fk:Fagkode)
      OPTIONAL MATCH (fk)-[:KVALIFISERER_FOR]->(fg:Faggruppe)
      RETURN fk, collect(fg.navn) as faggrupper
      ORDER BY fk.navn
    `);

    const fagkoder = result.records.map((record) => {
      const fagkode = record.get('fk').properties;
      const faggrupper = record.get('faggrupper');

      return {
        ...fagkode,
        faggrupper: faggrupper.filter((fg: string) => fg !== null),
      };
    });

    return NextResponse.json(fagkoder);
  } catch (error) {
    console.error('Error fetching fagkoder:', error);
    return NextResponse.json({ error: 'Failed to fetch fagkoder' }, { status: 500 });
  } finally {
    await session.close();
  }
}

// POST /api/fagkoder - Opprett ny fagkode
export async function POST(request: NextRequest) {
  const session = getSession();

  try {
    const body = await request.json();
    const { kode, navn, beskrivelse, gyldigFra, gyldigTil } = body;

    // Valider required fields
    if (!kode || !navn) {
      return NextResponse.json({ error: 'Kode and navn are required' }, { status: 400 });
    }

    const result = await session.run(
      `
      CREATE (fk:Fagkode {
        id: randomUUID(),
        kode: $kode,
        navn: $navn,
        beskrivelse: $beskrivelse,
        gyldigFra: date($gyldigFra),
        gyldigTil: CASE WHEN $gyldigTil IS NOT NULL THEN date($gyldigTil) ELSE NULL END,
        aktiv: true
      })
      RETURN fk
    `,
      {
        kode,
        navn,
        beskrivelse: beskrivelse || null,
        gyldigFra: gyldigFra || new Date().toISOString().split('T')[0],
        gyldigTil: gyldigTil || null,
      }
    );

    const fagkode = result.records[0].get('fk').properties;

    return NextResponse.json(fagkode, { status: 201 });
  } catch (error: any) {
    console.error('Error creating fagkode:', error);

    // Check if it's a constraint violation (duplicate kode)
    if (
      error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed' &&
      error.message.includes('kode')
    ) {
      return NextResponse.json(
        { error: 'En fagkode med denne koden eksisterer allerede' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create fagkode' }, { status: 500 });
  } finally {
    await session.close();
  }
}
