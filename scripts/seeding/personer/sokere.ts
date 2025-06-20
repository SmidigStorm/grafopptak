import { getSession } from '../../../lib/neo4j';

/**
 * Seeder testpersoner som kan brukes som søkere
 * Disse personene får dokumentasjon og karakterer gjennom andre moduler
 */
export async function seedSokere() {
  const session = getSession();

  try {
    console.log('👥 Oppretter søkere...');

    // ========== SØKERE ==========
    await session.run(`
      CREATE (anna:Person {
        id: randomUUID(),
        fornavn: 'Anna',
        etternavn: 'Hansen',
        fodselsdato: date('2003-05-15'),
        fodselsnummer: '15050312345',
        epost: 'anna.hansen@example.no',
        telefon: '12345678',
        adresse: 'Storgata 15\\n0180 Oslo',
        postnummer: '0180',
        poststed: 'Oslo',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (erik:Person {
        id: randomUUID(),
        fornavn: 'Erik',
        etternavn: 'Johnsen',
        fodselsdato: date('2002-09-23'),
        fodselsnummer: '23090234567',
        epost: 'erik.johnsen@example.no',
        telefon: '23456789',
        adresse: 'Elvegata 42\\n7030 Trondheim',
        postnummer: '7030',
        poststed: 'Trondheim',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (maria:Person {
        id: randomUUID(),
        fornavn: 'Maria',
        etternavn: 'Andersen',
        fodselsdato: date('1998-12-08'),
        fodselsnummer: '08129812345',
        epost: 'maria.andersen@example.no',
        telefon: '34567890',
        adresse: 'Fjellveien 8\\n5020 Bergen',
        postnummer: '5020',
        poststed: 'Bergen',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (lars:Person {
        id: randomUUID(),
        fornavn: 'Lars',
        etternavn: 'Olsen',
        fodselsdato: date('1995-07-14'),
        fodselsnummer: '14079512345',
        epost: 'lars.olsen@example.no',
        telefon: '45678901',
        adresse: 'Industriveien 99\\n4020 Stavanger',
        postnummer: '4020',
        poststed: 'Stavanger',
        statsborgerskap: 'Norge',
        aktiv: true
      })
      CREATE (sophie:Person {
        id: randomUUID(),
        fornavn: 'Sophie',
        etternavn: 'Müller',
        fodselsdato: date('2001-03-25'),
        fodselsnummer: '25030123456',
        epost: 'sophie.muller@example.de',
        telefon: '56789012',
        adresse: 'Universitetsveien 12\\n0315 Oslo',
        postnummer: '0315',
        poststed: 'Oslo',
        statsborgerskap: 'Tyskland',
        aktiv: true
      })
    `);

    // Return summary
    const result = await session.run(`
      MATCH (p:Person)
      RETURN count(p) as antallSokere, collect(p.fornavn + ' ' + p.etternavn) as navn
    `);

    const antall = result.records[0].get('antallSokere').toNumber();
    const navn = result.records[0].get('navn');

    console.log('✅ Opprettet søkere');
    console.log(`\\n📊 ${antall} søkere opprettet:`);
    navn.forEach((sokernavn: string) => {
      console.log(`  - ${sokernavn}`);
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle søkere
 */
export async function clearSokere() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Person) DETACH DELETE n`);
    console.log('🗑️ Slettet søkere');
  } finally {
    await session.close();
  }
}
