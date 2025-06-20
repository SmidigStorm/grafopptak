import { getSession } from '../../../lib/neo4j';

/**
 * Seeder konkrete regelsett basert på maler
 * Konkrete regelsett inneholder faktiske opptaksveier for spesifikke utdanningstilbud
 */
export async function seedKonkreteRegelsett() {
  const session = getSession();

  try {
    console.log('🎯 Oppretter konkrete regelsett...');

    // ========== KONKRETE REGELSETT ==========

    // UiO Informatikk H25 (basert på Ingeniør mal)
    await session.run(`
      CREATE (uioInformatikk:Regelsett {
        id: randomUUID(),
        navn: 'UiO Informatikk H25',
        beskrivelse: 'Regelsett for Bachelor i informatikk ved UiO, høst 2025',
        versjon: '1.0',
        erMal: false,
        basertPå: 'ingenior-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Opprett OpptaksVeier for UiO Informatikk
    await session.run(`
      MATCH (uioInformatikk:Regelsett {navn: 'UiO Informatikk H25'})
      
      // Hent alle nødvendige elementer
      MATCH (gsk:Kravelement {type: 'gsk'})
      MATCH (matteR1:Kravelement {type: 'matematikk-r1'})
      MATCH (alderFgv:Kravelement {type: 'alder-forstegangsvitnemaal'})
      
      MATCH (grunnlagFgv:Grunnlag {type: 'forstegangsvitnemaal'})
      MATCH (grunnlagOrdinaert:Grunnlag {type: 'ordinaert-vitnemaal'})
      MATCH (grunnlag235:Grunnlag {type: '23-5-regel'})
      
      MATCH (kvoteFgv:KvoteType {type: 'forstegangsvitnemaal'})
      MATCH (kvoteOrdinaer:KvoteType {type: 'ordinaer'})
      
      MATCH (rangeringKarakter:RangeringType {type: 'karaktersnitt-realfag'})
      MATCH (rangeringErfaring:RangeringType {type: 'erfaring-fagkompetanse'})
      
      // OpptaksVei 1: Førstegangsvitnemål
      CREATE (vei1:OpptaksVei {
        id: 'forstegangsvitnemaal-uio-informatikk-h25',
        navn: 'Førstegangsvitnemål - UiO Informatikk H25',
        beskrivelse: 'Vei for søkere med førstegangsvitnemål til UiO informatikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioInformatikk)-[:HAR_OPPTAKSVEI]->(vei1)
      CREATE (vei1)-[:BASERT_PÅ]->(grunnlagFgv)
      CREATE (vei1)-[:KREVER]->(gsk)
      CREATE (vei1)-[:KREVER]->(matteR1)
      CREATE (vei1)-[:KREVER]->(alderFgv)
      CREATE (vei1)-[:GIR_TILGANG_TIL]->(kvoteFgv)
      CREATE (vei1)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 2: Ordinært vitnemål
      CREATE (vei2:OpptaksVei {
        id: 'ordinaert-vitnemaal-uio-informatikk-h25',
        navn: 'Ordinært vitnemål - UiO Informatikk H25',
        beskrivelse: 'Vei for søkere med ordinært vitnemål til UiO informatikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioInformatikk)-[:HAR_OPPTAKSVEI]->(vei2)
      CREATE (vei2)-[:BASERT_PÅ]->(grunnlagOrdinaert)
      CREATE (vei2)-[:KREVER]->(gsk)
      CREATE (vei2)-[:KREVER]->(matteR1)
      CREATE (vei2)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei2)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 3: 23/5-regel
      CREATE (vei3:OpptaksVei {
        id: '23-5-regel-uio-informatikk-h25',
        navn: '23/5-regel - UiO Informatikk H25',
        beskrivelse: 'Vei for søkere med 23/5-regel til UiO informatikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioInformatikk)-[:HAR_OPPTAKSVEI]->(vei3)
      CREATE (vei3)-[:BASERT_PÅ]->(grunnlag235)
      CREATE (vei3)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei3)-[:BRUKER_RANGERING]->(rangeringErfaring)
    `);

    // NTNU Bygg- og miljøteknikk H25 (basert på Ingeniør mal)
    await session.run(`
      CREATE (ntnuBygg:Regelsett {
        id: randomUUID(),
        navn: 'NTNU Bygg- og miljøteknikk H25',
        beskrivelse: 'Regelsett for Bachelor i Bygg- og miljøteknikk ved NTNU, høst 2025',
        versjon: '1.0',
        erMal: false,
        basertPå: 'ingenior-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Opprett OpptaksVeier for NTNU Bygg
    await session.run(`
      MATCH (ntnuBygg:Regelsett {navn: 'NTNU Bygg- og miljøteknikk H25'})
      
      // Hent alle nødvendige elementer
      MATCH (gsk:Kravelement {type: 'gsk'})
      MATCH (matteR1R2:Kravelement {type: 'matematikk-r1r2'})
      MATCH (fysikk1:Kravelement {type: 'fysikk-1'})
      MATCH (alderFgv:Kravelement {type: 'alder-forstegangsvitnemaal'})
      MATCH (forkursFullfort:Kravelement {type: 'forkurs-fullfort'})
      
      MATCH (grunnlagFgv:Grunnlag {type: 'forstegangsvitnemaal'})
      MATCH (grunnlagOrdinaert:Grunnlag {type: 'ordinaert-vitnemaal'})
      MATCH (grunnlagFagbrev:Grunnlag {type: 'fagbrev'})
      MATCH (grunnlagForkurs:Grunnlag {type: 'y-veien'})
      
      MATCH (kvoteFgv:KvoteType {type: 'forstegangsvitnemaal'})
      MATCH (kvoteOrdinaer:KvoteType {type: 'ordinaer'})
      MATCH (kvoteForkurs:KvoteType {type: 'forkurs'})
      
      MATCH (rangeringKarakter:RangeringType {type: 'karaktersnitt-realfag'})
      MATCH (rangeringFagbrev:RangeringType {type: 'fagbrev-realfag'})
      MATCH (rangeringForkurs:RangeringType {type: 'forkurs'})
      
      // OpptaksVei 1: Førstegangsvitnemål
      CREATE (vei1:OpptaksVei {
        id: 'forstegangsvitnemaal-ntnu-bygg-h25',
        navn: 'Førstegangsvitnemål - NTNU Bygg H25',
        beskrivelse: 'Vei for søkere med førstegangsvitnemål til NTNU Bygg- og miljøteknikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuBygg)-[:HAR_OPPTAKSVEI]->(vei1)
      CREATE (vei1)-[:BASERT_PÅ]->(grunnlagFgv)
      CREATE (vei1)-[:KREVER]->(gsk)
      CREATE (vei1)-[:KREVER]->(matteR1R2)
      CREATE (vei1)-[:KREVER]->(fysikk1)
      CREATE (vei1)-[:KREVER]->(alderFgv)
      CREATE (vei1)-[:GIR_TILGANG_TIL]->(kvoteFgv)
      CREATE (vei1)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 2: Ordinært vitnemål
      CREATE (vei2:OpptaksVei {
        id: 'ordinaert-vitnemaal-ntnu-bygg-h25',
        navn: 'Ordinært vitnemål - NTNU Bygg H25',
        beskrivelse: 'Vei for søkere med ordinært vitnemål til NTNU Bygg- og miljøteknikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuBygg)-[:HAR_OPPTAKSVEI]->(vei2)
      CREATE (vei2)-[:BASERT_PÅ]->(grunnlagOrdinaert)
      CREATE (vei2)-[:KREVER]->(gsk)
      CREATE (vei2)-[:KREVER]->(matteR1R2)
      CREATE (vei2)-[:KREVER]->(fysikk1)
      CREATE (vei2)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei2)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 3: Fagbrev
      CREATE (vei3:OpptaksVei {
        id: 'fagbrev-ntnu-bygg-h25',
        navn: 'Fagbrev - NTNU Bygg H25',
        beskrivelse: 'Vei for søkere med fagbrev til NTNU Bygg- og miljøteknikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuBygg)-[:HAR_OPPTAKSVEI]->(vei3)
      CREATE (vei3)-[:BASERT_PÅ]->(grunnlagFagbrev)
      CREATE (vei3)-[:KREVER]->(gsk)
      CREATE (vei3)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei3)-[:BRUKER_RANGERING]->(rangeringFagbrev)
      
      // OpptaksVei 4: Forkurs
      CREATE (vei4:OpptaksVei {
        id: 'forkurs-ntnu-bygg-h25',
        navn: 'Forkurs - NTNU Bygg H25',
        beskrivelse: 'Vei for søkere med fullført forkurs til NTNU Bygg- og miljøteknikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuBygg)-[:HAR_OPPTAKSVEI]->(vei4)
      CREATE (vei4)-[:BASERT_PÅ]->(grunnlagForkurs)
      CREATE (vei4)-[:KREVER]->(forkursFullfort)
      CREATE (vei4)-[:GIR_TILGANG_TIL]->(kvoteForkurs)
      CREATE (vei4)-[:BRUKER_RANGERING]->(rangeringForkurs)
    `);

    // UiO Lærerutdanning H25 (basert på Lærerutdanning mal)
    await session.run(`
      CREATE (uioLaerer:Regelsett {
        id: randomUUID(),
        navn: 'UiO Lærerutdanning 1-7 H25',
        beskrivelse: 'Regelsett for Grunnskolelærerutdanning 1-7 ved UiO, høst 2025',
        versjon: '1.0',
        erMal: false,
        basertPå: 'laerer-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Opprett OpptaksVeier for UiO Lærer
    await session.run(`
      MATCH (uioLaerer:Regelsett {navn: 'UiO Lærerutdanning 1-7 H25'})
      
      // Hent alle nødvendige elementer
      MATCH (gsk:Kravelement {type: 'gsk'})
      MATCH (norskKarakter:Kravelement {type: 'norsk-karakter-30'})
      MATCH (matteKarakter:Kravelement {type: 'matematikk-karakter-40'})
      MATCH (alderFgv:Kravelement {type: 'alder-forstegangsvitnemaal'})
      
      MATCH (grunnlagFgv:Grunnlag {type: 'forstegangsvitnemaal'})
      MATCH (grunnlagOrdinaert:Grunnlag {type: 'ordinaert-vitnemaal'})
      MATCH (grunnlagRealkompetanse:Grunnlag {type: 'realkompetanse-uh'})
      
      MATCH (kvoteFgv:KvoteType {type: 'forstegangsvitnemaal'})
      MATCH (kvoteOrdinaer:KvoteType {type: 'ordinaer'})
      
      MATCH (rangeringKarakter:RangeringType {type: 'karaktersnitt-realfag'})
      MATCH (rangeringErfaring:RangeringType {type: 'erfaring-fagkompetanse'})
      
      // OpptaksVei 1: Førstegangsvitnemål
      CREATE (vei1:OpptaksVei {
        id: 'forstegangsvitnemaal-uio-laerer-h25',
        navn: 'Førstegangsvitnemål - UiO Lærerutdanning H25',
        beskrivelse: 'Vei for søkere med førstegangsvitnemål til UiO lærerutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioLaerer)-[:HAR_OPPTAKSVEI]->(vei1)
      CREATE (vei1)-[:BASERT_PÅ]->(grunnlagFgv)
      CREATE (vei1)-[:KREVER]->(gsk)
      CREATE (vei1)-[:KREVER]->(norskKarakter)
      CREATE (vei1)-[:KREVER]->(matteKarakter)
      CREATE (vei1)-[:KREVER]->(alderFgv)
      CREATE (vei1)-[:GIR_TILGANG_TIL]->(kvoteFgv)
      CREATE (vei1)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 2: Ordinært vitnemål
      CREATE (vei2:OpptaksVei {
        id: 'ordinaert-vitnemaal-uio-laerer-h25',
        navn: 'Ordinært vitnemål - UiO Lærerutdanning H25',
        beskrivelse: 'Vei for søkere med ordinært vitnemål til UiO lærerutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioLaerer)-[:HAR_OPPTAKSVEI]->(vei2)
      CREATE (vei2)-[:BASERT_PÅ]->(grunnlagOrdinaert)
      CREATE (vei2)-[:KREVER]->(gsk)
      CREATE (vei2)-[:KREVER]->(norskKarakter)
      CREATE (vei2)-[:KREVER]->(matteKarakter)
      CREATE (vei2)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei2)-[:BRUKER_RANGERING]->(rangeringKarakter)
      
      // OpptaksVei 3: Realkompetanse
      CREATE (vei3:OpptaksVei {
        id: 'realkompetanse-uio-laerer-h25',
        navn: 'Realkompetanse - UiO Lærerutdanning H25',
        beskrivelse: 'Vei for søkere med realkompetanse til UiO lærerutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioLaerer)-[:HAR_OPPTAKSVEI]->(vei3)
      CREATE (vei3)-[:BASERT_PÅ]->(grunnlagRealkompetanse)
      CREATE (vei3)-[:KREVER]->(norskKarakter)
      CREATE (vei3)-[:GIR_TILGANG_TIL]->(kvoteOrdinaer)
      CREATE (vei3)-[:BRUKER_RANGERING]->(rangeringErfaring)
    `);

    console.log('✅ Opprettet konkrete regelsett');

    // Return summary
    const result = await session.run(`
      MATCH (r:Regelsett {erMal: false})
      OPTIONAL MATCH (r)-[:HAR_OPPTAKSVEI]->(o:OpptaksVei)
      WITH r, count(o) as antallOpptaksveier
      RETURN r.navn as navn, antallOpptaksveier
      ORDER BY r.navn
    `);

    console.log('\\n📊 Konkrete regelsett opprettet:');
    result.records.forEach((record) => {
      const navn = record.get('navn');
      const antall = record.get('antallOpptaksveier').toNumber();
      console.log(`  ${navn}: ${antall} opptaksveier`);
    });
  } finally {
    await session.close();
  }
}

/**
 * Fjerner alle konkrete regelsett og deres opptaksveier
 */
export async function clearKonkreteRegelsett() {
  const session = getSession();

  try {
    await session.run(`MATCH (n:OpptaksVei) DETACH DELETE n`);
    await session.run(`MATCH (n:Regelsett {erMal: false}) DETACH DELETE n`);
    console.log('🗑️ Slettet konkrete regelsett og opptaksveier');
  } finally {
    await session.close();
  }
}
