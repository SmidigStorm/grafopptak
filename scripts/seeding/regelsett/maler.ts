import { getSession } from '../../../lib/neo4j';

/**
 * Seeder regelsett-maler som kan brukes som basis for konkrete regelsett
 * Maler inneholder standardiserte opptaksveier for ulike studietyper
 */
export async function seedRegelsettMaler() {
  const session = getSession();

  try {
    console.log('📋 Oppretter regelsett-maler...');

    // ========== REGELSETT-MALER ==========
    await session.run(`
      CREATE (ingeniorStandard:Regelsett {
        id: 'ingenior-standard',
        navn: 'Ingeniørutdanning standard',
        beskrivelse: 'Standard mal for ingeniørutdanninger med matematikk og fysikk-krav',
        versjon: '1.0',
        erMal: true,
        basertPå: null,
        gyldigFra: date('2024-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
      CREATE (laererStandard:Regelsett {
        id: 'laerer-standard',
        navn: 'Lærerutdanning standard',
        beskrivelse: 'Standard mal for lærerutdanninger med norsk og matematikk karakterkrav',
        versjon: '1.0',
        erMal: true,
        basertPå: null,
        gyldigFra: date('2024-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
      CREATE (okonomiStandard:Regelsett {
        id: 'okonomi-standard',
        navn: 'Økonomi/business standard',
        beskrivelse: 'Standard mal for økonomi og business-utdanninger',
        versjon: '1.0',
        erMal: true,
        basertPå: null,
        gyldigFra: date('2024-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
      CREATE (helseStandard:Regelsett {
        id: 'helse-standard',
        navn: 'Helseutdanning standard',
        beskrivelse: 'Standard mal for helsefagutdanninger med politiattest og praksis-krav',
        versjon: '1.0',
        erMal: true,
        basertPå: null,
        gyldigFra: date('2024-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Return summary
    const result = await session.run(`
      MATCH (r:Regelsett {erMal: true})
      RETURN count(r) as antallMaler, collect(r.navn) as malerNavn
    `);

    const antall = result.records[0].get('antallMaler').toNumber();
    const navn = result.records[0].get('malerNavn');

    console.log('✅ Opprettet regelsett-maler');
    console.log(`\\n📊 ${antall} maler opprettet:`);
    navn.forEach((malNavn: string) => {
      console.log(`  - ${malNavn}`);
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle regelsett-maler
 */
export async function clearRegelsettMaler() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Regelsett {erMal: true}) DETACH DELETE n`);
    console.log('🗑️ Slettet regelsett-maler');
  } finally {
    await session.close();
  }
}
