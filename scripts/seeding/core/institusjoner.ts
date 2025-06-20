import { getSession } from '../../../lib/neo4j';

/**
 * Seeder institusjoner og utdanningstilbud
 * Institusjoner må eksistere før utdanningstilbud kan opprettes
 */
export async function seedInstitusjoner() {
  const session = getSession();

  try {
    // ========== INSTITUSJONER ==========
    console.log('🏢 Oppretter institusjoner...');

    await session.run(`
      CREATE (uio:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Oslo',
        kortNavn: 'UiO',
        type: 'Universitet',
        institusjonsnummer: '0150',
        adresse: 'Problemveien 7, 0313 Oslo',
        nettside: 'https://www.uio.no',
        latitude: 59.9373,
        longitude: 10.7199,
        by: 'Oslo',
        fylke: 'Oslo',
        aktiv: true
      })
      CREATE (ntnu:Institusjon {
        id: randomUUID(),
        navn: 'Norges teknisk-naturvitenskapelige universitet',
        kortNavn: 'NTNU',
        type: 'Universitet',
        institusjonsnummer: '0194',
        adresse: 'Høgskoleringen 1, 7491 Trondheim',
        nettside: 'https://www.ntnu.no',
        latitude: 63.4178,
        longitude: 10.4018,
        by: 'Trondheim',
        fylke: 'Trøndelag',
        aktiv: true
      })
      CREATE (uib:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Bergen',
        kortNavn: 'UiB',
        type: 'Universitet',
        institusjonsnummer: '0163',
        adresse: 'Muséplass 1, 5007 Bergen',
        nettside: 'https://www.uib.no',
        latitude: 60.3862,
        longitude: 5.3204,
        by: 'Bergen',
        fylke: 'Vestland',
        aktiv: true
      })
      CREATE (uit:Institusjon {
        id: randomUUID(),
        navn: 'UiT Norges arktiske universitet',
        kortNavn: 'UiT',
        type: 'Universitet',
        institusjonsnummer: '0174',
        adresse: 'Hansine Hansens veg 18, 9019 Tromsø',
        nettside: 'https://www.uit.no',
        latitude: 69.6489,
        longitude: 18.9551,
        by: 'Tromsø',
        fylke: 'Troms og Finnmark',
        aktiv: true
      })
      CREATE (oslomet:Institusjon {
        id: randomUUID(),
        navn: 'OsloMet - storbyuniversitetet',
        kortNavn: 'OsloMet',
        type: 'Høgskole',
        institusjonsnummer: '0202',
        adresse: 'Pilestredet 35, 0166 Oslo',
        nettside: 'https://www.oslomet.no',
        latitude: 59.9200,
        longitude: 10.7350,
        by: 'Oslo',
        fylke: 'Oslo',
        aktiv: true
      })
      CREATE (kristiania:Institusjon {
        id: randomUUID(),
        navn: 'Høyskolen Kristiania',
        kortNavn: 'Kristiania',
        type: 'Privat høgskole',
        institusjonsnummer: '1502',
        adresse: 'Prinsensgate 7-9, 0152 Oslo',
        nettside: 'https://www.kristiania.no',
        latitude: 59.9150,
        longitude: 10.7500,
        by: 'Oslo',
        fylke: 'Oslo',
        aktiv: true
      })
      CREATE (uia:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Agder',
        kortNavn: 'UiA',
        type: 'Universitet',
        institusjonsnummer: '0232',
        adresse: 'Universitetsveien 25, 4630 Kristiansand',
        nettside: 'https://www.uia.no',
        latitude: 58.1467,
        longitude: 7.9956,
        by: 'Kristiansand',
        fylke: 'Agder',
        aktiv: true
      })
      CREATE (uis:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Stavanger',
        kortNavn: 'UiS',
        type: 'Universitet',
        institusjonsnummer: '0215',
        adresse: 'Kjell Arholms gate 41, 4021 Stavanger',
        nettside: 'https://www.uis.no',
        latitude: 58.8700,
        longitude: 5.6900,
        by: 'Stavanger',
        fylke: 'Rogaland',
        aktiv: true
      })
      CREATE (hvl:Institusjon {
        id: randomUUID(),
        navn: 'Høgskulen på Vestlandet',
        kortNavn: 'HVL',
        type: 'Høgskole',
        institusjonsnummer: '0217',
        adresse: 'Inndalsveien 28, 5063 Bergen',
        nettside: 'https://www.hvl.no',
        latitude: 60.3700,
        longitude: 5.3500,
        by: 'Bergen',
        fylke: 'Vestland',
        aktiv: true
      })
      CREATE (inn:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Innlandet',
        kortNavn: 'HiNN',
        type: 'Høgskole',
        institusjonsnummer: '0283',
        adresse: 'Terningen Arena, 2418 Elverum',
        nettside: 'https://www.inn.no',
        latitude: 60.8811,
        longitude: 11.5644,
        by: 'Elverum',
        fylke: 'Innlandet',
        aktiv: true
      })
      CREATE (himolde:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Molde',
        kortNavn: 'HiMolde',
        type: 'Høgskole',
        institusjonsnummer: '0181',
        adresse: 'Britvegen 2, 6410 Molde',
        nettside: 'https://www.himolde.no',
        latitude: 62.7372,
        longitude: 7.1574,
        by: 'Molde',
        fylke: 'Møre og Romsdal',
        aktiv: true
      })
      CREATE (bi:Institusjon {
        id: randomUUID(),
        navn: 'BI Norges Handelshøyskole',
        kortNavn: 'BI',
        type: 'Privat høgskole',
        institusjonsnummer: '1541',
        adresse: 'Nydalsveien 37, 0484 Oslo',
        nettside: 'https://www.bi.no',
        latitude: 59.9500,
        longitude: 10.7700,
        by: 'Oslo',
        fylke: 'Oslo',
        aktiv: true
      })
    `);
    console.log('✅ Opprettet institusjoner');

    // ========== UTDANNINGSTILBUD ==========
    console.log('🎓 Oppretter utdanningstilbud...');

    await session.run(`
      MATCH (uio:Institusjon {kortNavn: 'UiO'})
      MATCH (ntnu:Institusjon {kortNavn: 'NTNU'})
      MATCH (oslomet:Institusjon {kortNavn: 'OsloMet'})
      MATCH (kristiania:Institusjon {kortNavn: 'Kristiania'})
      
      CREATE (informatikk:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i informatikk',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 200,
        beskrivelse: 'Tredelt bachelorprogram i informatikk med spesialisering innen programmering, algoritmer og datastrukturer.',
        aktiv: true
      })
      CREATE (bygg:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Sivilingeniør i bygg- og miljøteknikk',
        studienivaa: 'Master',
        studiepoeng: 300,
        varighet: '5 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Trondheim',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 150,
        beskrivelse: 'Integrert masterprogram innen bygg- og miljøteknikk med fokus på bærekraftige løsninger.',
        aktiv: true
      })
      CREATE (sykepleie:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i sykepleie',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Begge',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Norsk',
        maxAntallStudenter: 120,
        beskrivelse: 'Profesjonsutdanning som kvalifiserer for autorisasjon som sykepleier.',
        aktiv: true
      })
      CREATE (markedsforing:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i markedsføring og merkevareledelse',
        studienivaa: 'Bachelor',
        studiepoeng: 180,
        varighet: '3 år',
        semester: 'Høst',
        aar: 2024,
        studiested: 'Oslo',
        undervisningssprak: 'Engelsk',
        maxAntallStudenter: 80,
        beskrivelse: 'Moderne markedsføringsutdanning med fokus på digital markedsføring og merkevarebygging.',
        aktiv: true
      })
      
      // Koble utdanningstilbud til institusjoner
      CREATE (uio)-[:TILBYR]->(informatikk)
      CREATE (ntnu)-[:TILBYR]->(bygg)
      CREATE (oslomet)-[:TILBYR]->(sykepleie)
      CREATE (kristiania)-[:TILBYR]->(markedsforing)
    `);
    console.log('✅ Opprettet utdanningstilbud');

    // Return summary
    const result = await session.run(`
      MATCH (i:Institusjon)
      OPTIONAL MATCH (i)-[:TILBYR]->(u:Utdanningstilbud)
      WITH i, count(u) as antallTilbud
      RETURN i.kortNavn as kortNavn, i.navn as navn, antallTilbud
      ORDER BY antallTilbud DESC, i.kortNavn
    `);

    console.log('\n📊 Institusjoner opprettet:');
    result.records.forEach((record) => {
      const kortNavn = record.get('kortNavn');
      const navn = record.get('navn');
      const antall = record.get('antallTilbud').toNumber();
      console.log(`  ${kortNavn} (${navn}): ${antall} tilbud`);
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle institusjoner og utdanningstilbud
 */
export async function clearInstitusjoner() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:Utdanningstilbud) DETACH DELETE n`);
    await session.run(`MATCH (n:Institusjon) DETACH DELETE n`);
    console.log('🗑️ Slettet institusjoner og utdanningstilbud');
  } finally {
    await session.close();
  }
}
