import { getSession } from '../lib/neo4j';

/**
 * VIKTIG: ALL SEEDING SKAL SKJE I DENNE FILEN
 *
 * Grunner for monolitisk struktur:
 * 1. Enklere å holde oversikt over rekkefølge og avhengigheter
 * 2. Lettere å se sammenhenger mellom entiteter
 * 3. Færre filer å holde styr på
 * 4. Avhengigheter mellom entiteter er lettere å håndtere
 *
 * Rekkefølge er viktig:
 * 1. Fagkoder (grunnleggende referansedata)
 * 2. Kravelementer, grunnlag, kvotetyper (regelkomponenter)
 * 3. PoengTyper (må finnes før RangeringType)
 * 4. RangeringTyper med relasjoner til PoengTyper
 * 5. Institusjoner og utdanningstilbud
 * 6. Regelsett og opptaksveier
 * 7. Personer og dokumentasjon (testdata)
 */

export async function seedAll() {
  const session = getSession();

  try {
    console.log('🌱 Starter full seeding av databasen...');

    // ========== FAGKODER ==========

    console.log('📋 Oppretter fagkoder...');

    await session.run(`
      // Matematikk R1
      CREATE (fk1:Fagkode {
        id: randomUUID(),
        kode: 'MAT1001',
        navn: 'Matematikk R1',
        type: 'matematikk',
        omfang: 'R1-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk2:Fagkode {
        id: randomUUID(),
        kode: 'REA3022',
        navn: 'Matematikk S1',
        type: 'matematikk',
        omfang: 'S1-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk3:Fagkode {
        id: randomUUID(),
        kode: 'REA3024',
        navn: 'Matematikk S2',
        type: 'matematikk',
        omfang: 'S2-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk4:Fagkode {
        id: randomUUID(),
        kode: 'REA3026',
        navn: 'Matematikk R1',
        type: 'matematikk',
        omfang: 'R1-nivå',
        aktiv: true,
        opprettet: datetime()
      })

      // Matematikk R2
      CREATE (fk5:Fagkode {
        id: randomUUID(),
        kode: 'MAT1002',
        navn: 'Matematikk R2',
        type: 'matematikk',
        omfang: 'R2-nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk6:Fagkode {
        id: randomUUID(),
        kode: 'REA3028',
        navn: 'Matematikk R2',
        type: 'matematikk',
        omfang: 'R2-nivå',
        aktiv: true,
        opprettet: datetime()
      })

      // Norsk
      CREATE (fk7:Fagkode {
        id: randomUUID(),
        kode: 'NOR1211',
        navn: 'Norsk hovedmål',
        type: 'norsk',
        omfang: '393 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk8:Fagkode {
        id: randomUUID(),
        kode: 'NOR1212',
        navn: 'Norsk sidemål',
        type: 'norsk',
        omfang: '393 timer',
        aktiv: true,
        opprettet: datetime()
      })

      // Realfag
      CREATE (fk9:Fagkode {
        id: randomUUID(),
        kode: 'FYS1001',
        navn: 'Fysikk 1',
        type: 'fysikk',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk10:Fagkode {
        id: randomUUID(),
        kode: 'FYS1002',
        navn: 'Fysikk 2',
        type: 'fysikk',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk11:Fagkode {
        id: randomUUID(),
        kode: 'KJE1001',
        navn: 'Kjemi 1',
        type: 'kjemi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk12:Fagkode {
        id: randomUUID(),
        kode: 'KJE1002',
        navn: 'Kjemi 2',
        type: 'kjemi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk13:Fagkode {
        id: randomUUID(),
        kode: 'BIO1001',
        navn: 'Biologi 1',
        type: 'biologi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk14:Fagkode {
        id: randomUUID(),
        kode: 'BIO1002',
        navn: 'Biologi 2',
        type: 'biologi',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fk15:Fagkode {
        id: randomUUID(),
        kode: 'GEO1001',
        navn: 'Geofag 1',
        type: 'geofag',
        omfang: '140 timer',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Videregående fagkoder for nytt vitnemål
      CREATE (vg1200:Fagkode {
        id: randomUUID(),
        kode: 'VG1200',
        navn: 'Engelsk elever',
        type: 'fellesfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg1330:Fagkode {
        id: randomUUID(),
        kode: 'VG1330',
        navn: 'Matematikk 1MX (ny plan)',
        type: 'matematikk',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg1400:Fagkode {
        id: randomUUID(),
        kode: 'VG1400',
        navn: 'Naturfag (elever)',
        type: 'naturfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg2500:Fagkode {
        id: randomUUID(),
        kode: 'VG2500',
        navn: 'Samfunnslære',
        type: 'fellesfag',
        omfang: '2 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg4000:Fagkode {
        id: randomUUID(),
        kode: 'VG4000',
        navn: 'Norsk hovedmål, skriftlig',
        type: 'norsk',
        omfang: '14 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg4001:Fagkode {
        id: randomUUID(),
        kode: 'VG4001',
        navn: 'Norsk sidemål, skriftlig',
        type: 'norsk',
        omfang: 'fritak',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg4005:Fagkode {
        id: randomUUID(),
        kode: 'VG4005',
        navn: 'Norsk, muntlig',
        type: 'norsk',
        omfang: 'muntlig',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vg4600:Fagkode {
        id: randomUUID(),
        kode: 'VG4600',
        navn: 'Nyere historie (ny plan)',
        type: 'samfunnsfag',
        omfang: '4 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vf4700:Fagkode {
        id: randomUUID(),
        kode: 'VF4700',
        navn: 'Religion og etikk (ny læreplan)',
        type: 'fellesfag',
        omfang: '3 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vf4900:Fagkode {
        id: randomUUID(),
        kode: 'VF4900',
        navn: 'Kroppsøving',
        type: 'fellesfag',
        omfang: '6 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vt1110:Fagkode {
        id: randomUUID(),
        kode: 'VT1110',
        navn: 'Fransk B-språk 1 ny plan (4)',
        type: 'fremmedsprak',
        omfang: '4 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vt1121:Fagkode {
        id: randomUUID(),
        kode: 'VT1121',
        navn: 'Fransk B-språk 2 privatister',
        type: 'fremmedsprak',
        omfang: '4 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vt1125:Fagkode {
        id: randomUUID(),
        kode: 'VT1125',
        navn: 'Fransk B-språk 2, muntlig, ny plan (4-4)',
        type: 'fremmedsprak',
        omfang: 'muntlig',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa1010:Fagkode {
        id: randomUUID(),
        kode: 'AA1010',
        navn: 'Økonomi og info.-behandling E',
        type: 'programfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6010:Fagkode {
        id: randomUUID(),
        kode: 'AA6010',
        navn: 'Bedriftsøkonomi I',
        type: 'programfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6210:Fagkode {
        id: randomUUID(),
        kode: 'AA6210',
        navn: 'Fysikk 2FY (ny plan)',
        type: 'programfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6227:Fagkode {
        id: randomUUID(),
        kode: 'AA6227',
        navn: 'Fysikk 3FY (ny plan)',
        type: 'programfag',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6230:Fagkode {
        id: randomUUID(),
        kode: 'AA6230',
        navn: 'Kjemi 2KJ',
        type: 'programfag',
        omfang: '3 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6514:Fagkode {
        id: randomUUID(),
        kode: 'AA6514',
        navn: 'Matematikk 2MX, ny plan',
        type: 'matematikk',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (aa6524:Fagkode {
        id: randomUUID(),
        kode: 'AA6524',
        navn: 'Matematikk 3MX, ny plan',
        type: 'matematikk',
        omfang: '5 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vl1410:Fagkode {
        id: randomUUID(),
        kode: 'VL1410',
        navn: 'Valgfag (lokalt gitt)',
        type: 'valgfag',
        omfang: '1 time',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vl2270:Fagkode {
        id: randomUUID(),
        kode: 'VL2270',
        navn: 'Valgfag (lokalt gitt)',
        type: 'valgfag',
        omfang: '2 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (vl2300:Fagkode {
        id: randomUUID(),
        kode: 'VL2300',
        navn: 'Valgfag (lokalt gitt)',
        type: 'valgfag',
        omfang: '2 timer',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet fagkoder');

    // ========== KRAVELEMENTER ==========
    console.log('🎯 Oppretter kravelementer...');

    await session.run(`
      CREATE (krav1:Kravelement {
        id: randomUUID(),
        navn: 'Generell studiekompetanse',
        type: 'generell-studiekompetanse',
        beskrivelse: 'Fullført og bestått generell studiekompetanse',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav2:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Matematikk R1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav3:Kravelement {
        id: randomUUID(),
        navn: 'Matematikk R2',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Matematikk R2 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav4:Kravelement {
        id: randomUUID(),
        navn: 'Fysikk 1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Fysikk 1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav5:Kravelement {
        id: randomUUID(),
        navn: 'Kjemi 1',
        type: 'spesifikk-fagkrav',
        beskrivelse: 'Kjemi 1 eller tilsvarende',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav6:Kravelement {
        id: randomUUID(),
        navn: 'Norsk 393 timer',
        type: 'sprakkunnskaper',
        beskrivelse: 'Norsk hovedmål eller sidemål, minimum 393 timer',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav7:Kravelement {
        id: randomUUID(),
        navn: 'Arbeidserfaring 5 år',
        type: 'arbeidserfaring',
        beskrivelse: '5 års relevant arbeids- eller utdanningserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav8:Kravelement {
        id: randomUUID(),
        navn: 'Fagbrev',
        type: 'fagkompetanse',
        beskrivelse: 'Fagbrev eller svennebrev i relevant fag',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav9:Kravelement {
        id: randomUUID(),
        navn: 'Politiattest',
        type: 'vandel',
        beskrivelse: 'Politiattest uten anmerkninger',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav10:Kravelement {
        id: randomUUID(),
        navn: 'Helseattest',
        type: 'helse',
        beskrivelse: 'Helseattest som bekrefter skikkethet',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav11:Kravelement {
        id: randomUUID(),
        navn: 'Forkurs ingeniør',
        type: 'spesiell-kompetanse',
        beskrivelse: 'Fullført og bestått forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav12:Kravelement {
        id: randomUUID(),
        navn: 'Bachelorgrad',
        type: 'hoyere-utdanning',
        beskrivelse: 'Fullført bachelorgrad fra akkreditert institusjon',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav13:Kravelement {
        id: randomUUID(),
        navn: 'Praksiserfaring helse',
        type: 'praksis',
        beskrivelse: 'Minimum 6 måneder praksis i helsesektoren',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav14:Kravelement {
        id: randomUUID(),
        navn: 'Minimum karakterkrav norsk 3.0',
        type: 'karakterkrav',
        beskrivelse: 'Minimum karakter 3,0 i norsk hovedmål eller sidemål',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav15:Kravelement {
        id: randomUUID(),
        navn: 'Minimum karakterkrav matematikk 4.0',
        type: 'karakterkrav',
        beskrivelse: 'Minimum karakter 4,0 i matematikk fra videregående',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav16:Kravelement {
        id: randomUUID(),
        navn: 'Minimum karakterkrav matematikk 3.0',
        type: 'karakterkrav',
        beskrivelse: 'Minimum karakter 3,0 i matematikk (ved 40 skulepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav17:Kravelement {
        id: randomUUID(),
        navn: 'Teknisk fagskole 2-årig',
        type: 'spesiell-kompetanse',
        beskrivelse: '2-årig teknisk fagskole fullført før 1999',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav18:Kravelement {
        id: randomUUID(),
        navn: 'Fagbrev teknisk fag',
        type: 'fagkompetanse',
        beskrivelse: 'Fagbrev i relevant teknisk fag for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav19:Kravelement {
        id: randomUUID(),
        navn: 'Karakterkrav fag-/sveineprøve',
        type: 'karakterkrav',
        beskrivelse: 'Minimum karakter "godt" på fag-/sveineprøven',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav20:Kravelement {
        id: randomUUID(),
        navn: 'Minimum 35 skulepoeng',
        type: 'poengkrav',
        beskrivelse: 'Minimum 35 skulepoeng samlet karakterpoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav21:Kravelement {
        id: randomUUID(),
        navn: 'Minimum 40 skulepoeng',
        type: 'poengkrav',
        beskrivelse: 'Minimum 40 skulepoeng samlet karakterpoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav22:Kravelement {
        id: randomUUID(),
        navn: 'Alder under 21 år',
        type: 'alderskrav',
        beskrivelse: 'Søker må være under 21 år (førstegangsvitnemålskvote)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav23:Kravelement {
        id: randomUUID(),
        navn: 'Y-vei kompetanse',
        type: 'spesiell-kompetanse',
        beskrivelse: 'Kompetanse fra Y-vei (25+ år med 5 års arbeidserfaring)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav24:Kravelement {
        id: randomUUID(),
        navn: 'Realkompetansevurdering',
        type: 'spesiell-kompetanse',
        beskrivelse: 'Godkjent realkompetansevurdering',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav25:Kravelement {
        id: randomUUID(),
        navn: 'Arbeidserfaring 2 år',
        type: 'arbeidserfaring',
        beskrivelse: '2 års relevant arbeidserfaring i teknisk fag',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav26:Kravelement {
        id: randomUUID(),
        navn: 'Alder 25 år eller eldre',
        type: 'alderskrav',
        beskrivelse: 'Søker må være 25 år eller eldre',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (krav27:Kravelement {
        id: randomUUID(),
        navn: 'Karaktersnitt forkurs 3.0',
        type: 'karakterkrav',
        beskrivelse: 'Minimum karaktersnitt 3,0 på forkurs ingeniør',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet kravelementer');

    // ========== FAGKODE-KRAVELEMENT RELASJONER ==========
    console.log('🔗 Oppretter fagkode-kravelement relasjoner...');

    // Matematikk R1 kravelement
    await session.run(`
      MATCH (matR1:Kravelement {navn: 'Matematikk R1'})
      MATCH (mat1001:Fagkode {kode: 'MAT1001'})
      MATCH (rea3022:Fagkode {kode: 'REA3022'})
      MATCH (rea3024:Fagkode {kode: 'REA3024'})
      MATCH (rea3026:Fagkode {kode: 'REA3026'})
      MATCH (vg1330:Fagkode {kode: 'VG1330'})
      
      CREATE (mat1001)-[:KVALIFISERER_FOR]->(matR1)
      CREATE (rea3022)-[:KVALIFISERER_FOR]->(matR1)
      CREATE (rea3024)-[:KVALIFISERER_FOR]->(matR1)
      CREATE (rea3026)-[:KVALIFISERER_FOR]->(matR1)
      CREATE (vg1330)-[:KVALIFISERER_FOR]->(matR1)
    `);

    // Matematikk R2 kravelement
    await session.run(`
      MATCH (matR2:Kravelement {navn: 'Matematikk R2'})
      MATCH (rea3028:Fagkode {kode: 'REA3028'})
      MATCH (rea3030:Fagkode {kode: 'REA3030'})
      
      CREATE (rea3028)-[:KVALIFISERER_FOR]->(matR2)
      CREATE (rea3030)-[:KVALIFISERER_FOR]->(matR2)
    `);

    console.log('✅ Opprettet fagkode-kravelement relasjoner');

    // ========== LOGISKE NODER ==========
    console.log('🧠 Oppretter logiske noder...');

    await session.run(`
      // Basis logiske noder for enkle krav
      CREATE (logikk1:LogicalNode {
        id: randomUUID(),
        type: 'AND',
        navn: 'UiO Informatikk Grunnkrav',
        beskrivelse: 'Grunnleggende krav for UiO Informatikk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (logikk2:LogicalNode {
        id: randomUUID(),
        type: 'OR',
        navn: 'Matematikk R1 eller R2',
        beskrivelse: 'Matematikk R1 eller R2 nivå',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (logikk3:LogicalNode {
        id: randomUUID(),
        type: 'OR',
        navn: 'Realfag valgfritt',
        beskrivelse: 'Fysikk 1 eller Biologi 1 eller Kjemi 1',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (logikk4:LogicalNode {
        id: randomUUID(),
        type: 'AND',
        navn: 'NTNU Bygg Grunnkrav',
        beskrivelse: 'Matematikk R1+R2 og Fysikk 1',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (logikk5:LogicalNode {
        id: randomUUID(),
        type: 'AND',
        navn: 'Matematikk R1+R2',
        beskrivelse: 'Både Matematikk R1 og R2',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (logikk6:LogicalNode {
        id: randomUUID(),
        type: 'AND',
        navn: 'OsloMet Lærer Grunnkrav',
        beskrivelse: 'Generell studiekompetanse og norsk',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // Koble LogicalNodes til Kravelementer
    await session.run(`
      MATCH (logikk1:LogicalNode {navn: 'UiO Informatikk Grunnkrav'})
      MATCH (logikk2:LogicalNode {navn: 'Matematikk R1 eller R2'})
      MATCH (logikk3:LogicalNode {navn: 'Realfag valgfritt'})
      MATCH (logikk4:LogicalNode {navn: 'NTNU Bygg Grunnkrav'})
      MATCH (logikk5:LogicalNode {navn: 'Matematikk R1+R2'})
      MATCH (logikk6:LogicalNode {navn: 'OsloMet Lærer Grunnkrav'})
      
      MATCH (gsk:Kravelement {type: 'generell-studiekompetanse'})
      MATCH (matteR1:Kravelement {navn: 'Matematikk R1'})
      MATCH (matteR2:Kravelement {navn: 'Matematikk R2'})
      MATCH (fysikk:Kravelement {navn: 'Fysikk 1'})
      MATCH (kjemi:Kravelement {navn: 'Kjemi 1'})
      MATCH (norsk:Kravelement {type: 'sprakkunnskaper'})
      
      // UiO Informatikk: GSK AND (Matematikk R1 OR R2)
      CREATE (logikk1)-[:EVALUERER]->(gsk)
      CREATE (logikk1)-[:EVALUERER]->(logikk2)
      CREATE (logikk2)-[:EVALUERER]->(matteR1)
      CREATE (logikk2)-[:EVALUERER]->(matteR2)
      
      // NTNU Bygg: GSK AND (Matematikk R1+R2) AND Fysikk 1
      CREATE (logikk4)-[:EVALUERER]->(gsk)
      CREATE (logikk4)-[:EVALUERER]->(logikk5)
      CREATE (logikk4)-[:EVALUERER]->(fysikk)
      CREATE (logikk5)-[:EVALUERER]->(matteR1)
      CREATE (logikk5)-[:EVALUERER]->(matteR2)
      
      // OsloMet Lærer: GSK AND Norsk
      CREATE (logikk6)-[:EVALUERER]->(gsk)
      CREATE (logikk6)-[:EVALUERER]->(norsk)
      
      // Realfag valgfritt eksempel (for fremtidig bruk)
      CREATE (logikk3)-[:EVALUERER]->(fysikk)
      CREATE (logikk3)-[:EVALUERER]->(kjemi)
    `);

    // ========== AVANSERTE LOGISKE NODER ==========
    console.log('🧠 Oppretter avanserte logiske noder...');

    await session.run(`
      MATCH (gsk:Kravelement {navn: 'Generell studiekompetanse'})
      MATCH (matR1:Kravelement {navn: 'Matematikk R1'})
      MATCH (matR2:Kravelement {navn: 'Matematikk R2'})
      MATCH (fysikk:Kravelement {navn: 'Fysikk 1'})
      MATCH (fagbrev:Kravelement {navn: 'Fagbrev teknisk fag'})
      MATCH (forkurs:Kravelement {navn: 'Forkurs ingeniør'})
      MATCH (norsk:Kravelement {navn: 'Norsk 393 timer'})
      MATCH (norskKarak:Kravelement {navn: 'Minimum karakterkrav norsk 3.0'})
      MATCH (matKarak40:Kravelement {navn: 'Minimum karakterkrav matematikk 4.0'})
      MATCH (matKarak30:Kravelement {navn: 'Minimum karakterkrav matematikk 3.0'})
      MATCH (minPoeng35:Kravelement {navn: 'Minimum 35 skulepoeng'})
      MATCH (minPoeng40:Kravelement {navn: 'Minimum 40 skulepoeng'})
      MATCH (arbeidserfaring:Kravelement {navn: 'Arbeidserfaring 5 år'})
      MATCH (arbeidserfaring2:Kravelement {navn: 'Arbeidserfaring 2 år'})
      MATCH (fagbrevKarak:Kravelement {navn: 'Karakterkrav fag-/sveineprøve'})
      MATCH (yVei:Kravelement {navn: 'Y-vei kompetanse'})
      MATCH (aldersKrav:Kravelement {navn: 'Alder under 21 år'})
      MATCH (alder25:Kravelement {navn: 'Alder 25 år eller eldre'})
      MATCH (forkursKarak:Kravelement {navn: 'Karaktersnitt forkurs 3.0'})
      MATCH (realkompetanse:Kravelement {navn: 'Realkompetansevurdering'})

      // NTNU Avansert - Ordinær vei
      CREATE (ntnu_ord:LogicalNode {
        id: randomUUID(),
        navn: 'NTNU Avansert Ordinær',
        type: 'AND',
        beskrivelse: 'GSK + Mat R1+R2 + Fysikk 1 + 35 poeng',
        opprettet: datetime()
      })
      
      // NTNU Avansert - Fagbrev vei
      CREATE (ntnu_fagbrev:LogicalNode {
        id: randomUUID(),
        navn: 'NTNU Avansert Fagbrev',
        type: 'AND',
        beskrivelse: 'Fagbrev teknisk + karakterkrav + 2 års arbeidserfaring + GSK',
        opprettet: datetime()
      })
      
      // NTNU Avansert - Forkurs vei
      CREATE (ntnu_forkurs:LogicalNode {
        id: randomUUID(),
        navn: 'NTNU Avansert Forkurs',
        type: 'AND',
        beskrivelse: 'Forkurs ingeniør + karaktersnitt 3.0 + GSK',
        opprettet: datetime()
      })
      
      // NTNU Avansert - Y-vei
      CREATE (ntnu_yvei:LogicalNode {
        id: randomUUID(),
        navn: 'NTNU Avansert Y-vei',
        type: 'AND',
        beskrivelse: '25+ år + 5 års arbeidserfaring + realkompetansevurdering',
        opprettet: datetime()
      })

      // HiOA Fagbrev - kun fagbrev-veien
      CREATE (hioa_fagbrev:LogicalNode {
        navn: 'HiOA Fagbrev Spesiell',
        type: 'AND',
        beskrivelse: 'Fagbrev teknisk + karakterkrav + arbeidserfaring'
      })

      // UiO Lærer Avansert - Ordinær vei (strenge krav)
      CREATE (uio_laerer_ord:LogicalNode {
        navn: 'UiO Lærer Ordinær Streng',
        type: 'AND',
        beskrivelse: 'GSK + norsk 3.0 + mat 4.0 + 35 poeng'
      })
      
      // UiO Lærer Avansert - Førstegangsvitnemål
      CREATE (uio_laerer_forste:LogicalNode {
        navn: 'UiO Lærer Førstegangsvitnemål',
        type: 'AND',
        beskrivelse: 'GSK + norsk 3.0 + mat 4.0 + under 21 år'
      })

      // Nord Universitet Samisk - Ordinær
      CREATE (nord_samisk_ord:LogicalNode {
        navn: 'Nord Samisk Ordinær',
        type: 'AND',
        beskrivelse: 'GSK + norsk 3.0 + mat 3.0 + 35 poeng'
      })
      
      // Nord Universitet Samisk - Samisk kvote
      CREATE (nord_samisk_kvote:LogicalNode {
        navn: 'Nord Samisk Kvote',
        type: 'AND',
        beskrivelse: 'GSK + norsk 3.0 + mat 3.0 (senket krav)'
      })

      // Koblinger for NTNU Avansert
      // Ordinær vei: GSK + Mat R1+R2 + Fysikk 1 + 35 poeng
      CREATE (ntnu_ord)-[:EVALUERER]->(gsk)
      CREATE (ntnu_ord)-[:EVALUERER]->(matR1)
      CREATE (ntnu_ord)-[:EVALUERER]->(matR2)
      CREATE (ntnu_ord)-[:EVALUERER]->(fysikk)
      CREATE (ntnu_ord)-[:EVALUERER]->(minPoeng35)
      
      // Fagbrev vei: Fagbrev teknisk + karakterkrav + 2 års arbeidserfaring + GSK
      CREATE (ntnu_fagbrev)-[:EVALUERER]->(fagbrev)
      CREATE (ntnu_fagbrev)-[:EVALUERER]->(fagbrevKarak)
      CREATE (ntnu_fagbrev)-[:EVALUERER]->(arbeidserfaring2)
      CREATE (ntnu_fagbrev)-[:EVALUERER]->(gsk)
      
      // Forkurs vei: Forkurs ingeniør + karaktersnitt 3.0 + GSK
      CREATE (ntnu_forkurs)-[:EVALUERER]->(forkurs)
      CREATE (ntnu_forkurs)-[:EVALUERER]->(forkursKarak)
      CREATE (ntnu_forkurs)-[:EVALUERER]->(gsk)
      
      // Y-vei: 25+ år + 5 års erfaring + realkompetansevurdering
      CREATE (ntnu_yvei)-[:EVALUERER]->(alder25)
      CREATE (ntnu_yvei)-[:EVALUERER]->(arbeidserfaring)
      CREATE (ntnu_yvei)-[:EVALUERER]->(realkompetanse)

      // Koblinger for HiOA Fagbrev
      CREATE (hioa_fagbrev)-[:EVALUERER]->(fagbrev)
      CREATE (hioa_fagbrev)-[:EVALUERER]->(fagbrevKarak)
      CREATE (hioa_fagbrev)-[:EVALUERER]->(arbeidserfaring)

      // Koblinger for UiO Lærer Avansert
      CREATE (uio_laerer_ord)-[:EVALUERER]->(gsk)
      CREATE (uio_laerer_ord)-[:EVALUERER]->(norskKarak)
      CREATE (uio_laerer_ord)-[:EVALUERER]->(matKarak40)
      CREATE (uio_laerer_ord)-[:EVALUERER]->(minPoeng35)
      
      CREATE (uio_laerer_forste)-[:EVALUERER]->(gsk)
      CREATE (uio_laerer_forste)-[:EVALUERER]->(norskKarak)
      CREATE (uio_laerer_forste)-[:EVALUERER]->(matKarak40)
      CREATE (uio_laerer_forste)-[:EVALUERER]->(aldersKrav)

      // Koblinger for Nord Samisk
      CREATE (nord_samisk_ord)-[:EVALUERER]->(gsk)
      CREATE (nord_samisk_ord)-[:EVALUERER]->(norskKarak)
      CREATE (nord_samisk_ord)-[:EVALUERER]->(matKarak30)
      CREATE (nord_samisk_ord)-[:EVALUERER]->(minPoeng35)
      
      CREATE (nord_samisk_kvote)-[:EVALUERER]->(gsk)
      CREATE (nord_samisk_kvote)-[:EVALUERER]->(norskKarak)
      CREATE (nord_samisk_kvote)-[:EVALUERER]->(matKarak30)
    `);

    console.log('✅ Opprettet logiske noder');

    // ========== GRUNNLAG ==========
    console.log('🏗️ Oppretter grunnlag...');

    await session.run(`
      CREATE (grunnlag1:Grunnlag {
        id: randomUUID(),
        navn: 'Vitnemål videregående',
        type: 'vitnemaal-vgs',
        beskrivelse: 'Vitnemål fra videregående opplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag2:Grunnlag {
        id: randomUUID(),
        navn: 'Fagbrev/svennebrev',
        type: 'fagbrev',
        beskrivelse: 'Fagbrev eller svennebrev fra fag- og yrkesopplæring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag3:Grunnlag {
        id: randomUUID(),
        navn: 'Privatisteksamen',
        type: 'privatist',
        beskrivelse: 'Vitnemål fra privatisteksamen',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag4:Grunnlag {
        id: randomUUID(),
        navn: 'IB Diploma',
        type: 'ib-diploma',
        beskrivelse: 'International Baccalaureate Diploma',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag5:Grunnlag {
        id: randomUUID(),
        navn: 'Forkurs ingeniør',
        type: 'forkurs-ingenior',
        beskrivelse: 'Fullført forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag6:Grunnlag {
        id: randomUUID(),
        navn: 'Gymnaseksamen før 1994',
        type: 'gammel-gymnaseksamen',
        beskrivelse: 'Artium, examen artium eller gymnaseksamen før 1994',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag7:Grunnlag {
        id: randomUUID(),
        navn: 'Folkehøgskole',
        type: 'folkehogskole',
        beskrivelse: 'Vitnemål fra folkehøgskole (33+ uker)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag8:Grunnlag {
        id: randomUUID(),
        navn: 'Høyere utdanning',
        type: 'hoyere-utdanning',
        beskrivelse: 'Utdanning fra universitet eller høgskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag9:Grunnlag {
        id: randomUUID(),
        navn: 'Fagskole',
        type: 'fagskole',
        beskrivelse: 'Vitnemål fra fagskoleutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag10:Grunnlag {
        id: randomUUID(),
        navn: 'Bachelorgrad',
        type: 'bachelor',
        beskrivelse: 'Fullført bachelorutdanning (180 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag11:Grunnlag {
        id: randomUUID(),
        navn: 'Mastergrad',
        type: 'master',
        beskrivelse: 'Fullført masterutdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag12:Grunnlag {
        id: randomUUID(),
        navn: '23/5-regel',
        type: '23-5-regel',
        beskrivelse: '23 år med 5 års arbeids- eller utdanningserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag13:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse UH',
        type: 'realkompetanse-uh',
        beskrivelse: '25+ år med relevant erfaring for universitet/høgskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag14:Grunnlag {
        id: randomUUID(),
        navn: 'Realkompetanse fagskole',
        type: 'realkompetanse-fagskole',
        beskrivelse: '23+ år med relevant erfaring for fagskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag15:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent fagskole',
        type: 'fagskole-godkjent',
        beskrivelse: 'Fullført fagskoleutdanning (120 studiepoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag16:Grunnlag {
        id: randomUUID(),
        navn: 'Godkjent utenlandsk utdanning',
        type: 'utenlandsk-godkjent',
        beskrivelse: 'Utenlandsk utdanning vurdert som likeverdig',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag17:Grunnlag {
        id: randomUUID(),
        navn: 'Y-veien/ingeniørforberedende',
        type: 'y-veien',
        beskrivelse: 'Spesielle forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (grunnlag18:Grunnlag {
        id: randomUUID(),
        navn: 'Førstegangsvitnemål',
        type: 'forstegangsvitnemaal',
        beskrivelse: 'Nytt vitnemål for søkere 21 år eller yngre',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet grunnlag');

    // ========== KVOTETYPER ==========
    console.log('📊 Oppretter kvotetyper...');

    await session.run(`
      CREATE (kvote1:KvoteType {
        id: randomUUID(),
        navn: 'Ordinær kvote',
        type: 'ordinaer',
        beskrivelse: 'Hovedkvote for alle kvalifiserte søkere',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote2:KvoteType {
        id: randomUUID(),
        navn: 'Førstegangsvitnemål',
        type: 'forstegangsvitnemaal',
        beskrivelse: 'For søkere under 21 år med nytt vitnemål',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote3:KvoteType {
        id: randomUUID(),
        navn: 'Forkurskvote',
        type: 'forkurs',
        beskrivelse: 'For søkere med fullført forkurs ingeniør',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote4:KvoteType {
        id: randomUUID(),
        navn: 'Ordinært vitnemål kvote',
        type: 'ordinaert-vitnemaal',
        beskrivelse: 'For søkere over 21 år med ordinært vitnemål',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote5:KvoteType {
        id: randomUUID(),
        navn: 'Y-vei kvote',
        type: 'y-vei',
        beskrivelse: 'For søkere med 25+ år og arbeidserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote6:KvoteType {
        id: randomUUID(),
        navn: 'Fagbrevkvote',
        type: 'fagbrev',
        beskrivelse: 'For søkere med fagbrev og arbeidserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote7:KvoteType {
        id: randomUUID(),
        navn: 'Samisk kvote',
        type: 'samisk',
        beskrivelse: 'For søkere med samisk bakgrunn',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote8:KvoteType {
        id: randomUUID(),
        navn: 'Nordisk kvote',
        type: 'nordisk',
        beskrivelse: 'For søkere fra andre nordiske land',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kvote9:KvoteType {
        id: randomUUID(),
        navn: 'Realkompetanse kvote',
        type: 'realkompetanse',
        beskrivelse: 'For søkere med godkjent realkompetansevurdering',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet kvotetyper');

    // ========== POENGTYPER ==========
    console.log('📊 Oppretter poengtypene...');

    // Dokumentbaserte poengtyper
    await session.run(`
      CREATE (karaktersnittVitnemaal:PoengType {
        id: randomUUID(),
        navn: 'karaktersnitt-et-vitnemaal',
        type: 'dokumentbasert',
        beskrivelse: 'Karaktersnitt fra ett vitnemål',
        beregningsmåte: 'Snitt av alle tallkarakterer på ett vitnemål, multiplisert med 10 (0-60 poeng)',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // Tilleggspoeng
    await session.run(`
      CREATE (realfagspoeng:PoengType {
        id: randomUUID(),
        navn: 'realfagspoeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for realfag fra videregående',
        beregningsmåte: 'Kompleks tabell per fag, maks 4 poeng totalt (delt med språkpoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (spraakpoeng:PoengType {
        id: randomUUID(),
        navn: 'språkpoeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for fremmedspråk fra videregående',
        beregningsmåte: 'Nivå I/II: 0,5p, Nivå III: 1p, maks 4 poeng totalt (delt med realfagspoeng)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (folkehogskolePoeng:PoengType {
        id: randomUUID(),
        navn: 'folkehøgskole-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for folkehøgskole',
        beregningsmåte: '2 poeng for godkjent folkehøgskole (33+ uker, 90%+ oppmøte)',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (militaertjenestePoeng:PoengType {
        id: randomUUID(),
        navn: 'militærtjeneste-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for militærtjeneste',
        beregningsmåte: '2 poeng for fullført militærtjeneste/befalsskole/FN-tjeneste',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (siviltjenestePoeng:PoengType {
        id: randomUUID(),
        navn: 'siviltjeneste-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for siviltjeneste',
        beregningsmåte: '2 poeng for fullført siviltjeneste',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (fagskolePoeng:PoengType {
        id: randomUUID(),
        navn: 'fagskole-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for fagskole',
        beregningsmåte: '30-59 fagskolepoeng: 1p, 60+ fagskolepoeng: 2p',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hoyereUtdanningPoeng:PoengType {
        id: randomUUID(),
        navn: 'høyere-utdanning-poeng',
        type: 'tilleggspoeng',
        beskrivelse: 'Tilleggspoeng for høyere utdanning',
        beregningsmåte: '30-59 studiepoeng: 1p, 60+ studiepoeng: 2p',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // Automatiske poengtyper
    await session.run(`
      CREATE (kjonnspoeng:PoengType {
        id: randomUUID(),
        navn: 'kjønnspoeng',
        type: 'automatisk',
        beskrivelse: 'Automatiske kjønnspoeng for spesielle studieprogram',
        beregningsmåte: '1-2 poeng automatisk basert på kjønn og studieprogram',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (alderspoeng:PoengType {
        id: randomUUID(),
        navn: 'alderspoeng',
        type: 'automatisk',
        beskrivelse: 'Automatiske alderspoeng',
        beregningsmåte: '2 poeng/år fra 20 år (ordinær) eller 24 år (23/5), maks 8 poeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // Manuelle/vurderte poengtyper
    await session.run(`
      CREATE (opptaksprovePoeng:PoengType {
        id: randomUUID(),
        navn: 'opptaksprøve-poeng',
        type: 'manuell',
        beskrivelse: 'Poeng fra opptaksprøver',
        beregningsmåte: 'Variabel skala avhengig av prøve - kan legges til karakterpoeng eller erstatte dem',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (realkompetansePoeng:PoengType {
        id: randomUUID(),
        navn: 'realkompetansevurderingspoeng',
        type: 'manuell',
        beskrivelse: 'Vurdering av realkompetanse',
        beregningsmåte: 'Saksbehandler setter direkte poengsum 0-60 som erstatning for karakterpoeng',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    console.log('✅ Opprettet poengtypene');

    // ========== RANGERINGSTYPER MED RELASJONER ==========
    console.log('📈 Oppretter rangeringstyper...');

    await session.run(`
      // Opprett rangeringstyper
      CREATE (skolepoeng:RangeringType {
        id: randomUUID(),
        navn: 'Skolepoeng',
        type: 'skolepoeng',
        beskrivelse: 'Grunnleggende skolepoeng uten alderspoeng og andre tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (konkurransepoeng:RangeringType {
        id: randomUUID(),
        navn: 'Konkurransepoeng',
        type: 'konkurransepoeng',
        beskrivelse: 'Full poengberegning med alle tilleggspoeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (realkompetanse:RangeringType {
        id: randomUUID(),
        navn: 'Realkompetanse',
        type: 'realkompetanse',
        beskrivelse: 'Rangering basert kun på realkompetansevurdering',
        aktiv: true,
        opprettet: datetime()
      })
      
      // Hent poengtyper for relasjoner
      WITH skolepoeng, konkurransepoeng, realkompetanse
      MATCH (karaktersnitt:PoengType {navn: 'karaktersnitt-et-vitnemaal'})
      MATCH (realfag:PoengType {navn: 'realfagspoeng'})
      MATCH (spraak:PoengType {navn: 'språkpoeng'})
      MATCH (kjonn:PoengType {navn: 'kjønnspoeng'})
      MATCH (opptaksprove:PoengType {navn: 'opptaksprøve-poeng'})
      MATCH (folkehogskole:PoengType {navn: 'folkehøgskole-poeng'})
      MATCH (militar:PoengType {navn: 'militærtjeneste-poeng'})
      MATCH (sivil:PoengType {navn: 'siviltjeneste-poeng'})
      MATCH (fagskole:PoengType {navn: 'fagskole-poeng'})
      MATCH (hoyere:PoengType {navn: 'høyere-utdanning-poeng'})
      MATCH (alder:PoengType {navn: 'alderspoeng'})
      MATCH (realkompetansePoeng:PoengType {navn: 'realkompetansevurderingspoeng'})
      
      // Skolepoeng relasjoner
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(karaktersnitt)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(realfag)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(spraak)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(kjonn)
      CREATE (skolepoeng)-[:INKLUDERER_POENGTYPE]->(opptaksprove)
      
      // Konkurransepoeng relasjoner (alle fra skolepoeng + tilleggspoeng + alderspoeng)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(karaktersnitt)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(realfag)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(spraak)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(kjonn)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(opptaksprove)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(folkehogskole)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(militar)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(sivil)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(fagskole)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(hoyere)
      CREATE (konkurransepoeng)-[:INKLUDERER_POENGTYPE]->(alder)
      
      // Realkompetanse relasjoner (kun realkompetansevurdering)
      CREATE (realkompetanse)-[:INKLUDERER_POENGTYPE]->(realkompetansePoeng)
    `);
    console.log('✅ Opprettet rangeringstyper med poengtype-relasjoner');

    // ========== REGELSETT-MALER ==========
    console.log('📋 Oppretter regelsett-maler...');

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
    console.log('✅ Opprettet regelsett-maler');

    // ========== KONKRETE REGELSETT ==========
    console.log('🎯 Oppretter konkrete regelsett...');

    // UiO Informatikk H25
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

    // NTNU Bygg- og miljøteknikk H25
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

    // OsloMet Lærerutdanning H25
    await session.run(`
      CREATE (oslometLaerer:Regelsett {
        id: randomUUID(),
        navn: 'OsloMet Lærerutdanning 1-7 H25',
        beskrivelse: 'Regelsett for Grunnskolelærerutdanning 1-7 ved OsloMet, høst 2025',
        versjon: '1.0',
        erMal: false,
        basertPå: 'laerer-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // ========== AVANSERTE INGENIØR REGELSETT ==========
    console.log('🔧 Oppretter avanserte ingeniør regelsett...');

    // NTNU Ingeniør Avansert (med flere opptaksveier)
    await session.run(`
      CREATE (ntnuIngAvansert:Regelsett {
        id: randomUUID(),
        navn: 'NTNU Ingeniør Avansert H25',
        beskrivelse: 'Avansert regelsett for ingeniørutdanning ved NTNU med alle opptaksveier',
        versjon: '2.0',
        erMal: false,
        basertPå: 'ingenior-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // HiOA Ingeniør med fagbrevkrav
    await session.run(`
      CREATE (hioaIngFagbrev:Regelsett {
        id: randomUUID(),
        navn: 'HiOA Ingeniør Fagbrev H25',
        beskrivelse: 'Spesiell ingeniørutdanning for fagarbeidere ved HiOA',
        versjon: '1.0',
        erMal: false,
        basertPå: 'ingenior-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // ========== AVANSERTE LÆRER REGELSETT ==========
    console.log('🍎 Oppretter avanserte lærer regelsett...');

    // UiO Lærerutdanning (strenge krav)
    await session.run(`
      CREATE (uioLaererAvansert:Regelsett {
        id: randomUUID(),
        navn: 'UiO Lærerutdanning Avansert H25',
        beskrivelse: 'Avansert lærerutdanning ved UiO med strenge karakterkrav',
        versjon: '2.0',
        erMal: false,
        basertPå: 'laerer-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    // Nord Universitet Lærer (samisk kvote)
    await session.run(`
      CREATE (nordLaererSamisk:Regelsett {
        id: randomUUID(),
        navn: 'Nord Universitet Lærer Samisk H25',
        beskrivelse: 'Lærerutdanning med samisk kvote ved Nord Universitet',
        versjon: '1.0',
        erMal: false,
        basertPå: 'laerer-standard',
        gyldigFra: date('2025-01-01'),
        opprettet: datetime(),
        aktiv: true
      })
    `);

    console.log('✅ Opprettet avanserte regelsett');

    // ========== INSTITUSJONER ==========
    console.log('🏢 Oppretter institusjoner...');

    await session.run(`
      CREATE (uio:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Oslo',
        kortnavn: 'UiO',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Oslo',
        latitude: 59.9397,
        longitude: 10.7208,
        by: 'Oslo',
        fylke: 'Oslo',
        adresse: 'Karl Johans gate 47, 0162 Oslo',
        nettside: 'https://www.uio.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnu:Institusjon {
        id: randomUUID(),
        navn: 'Norges teknisk-naturvitenskapelige universitet',
        kortnavn: 'NTNU',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Trondheim',
        latitude: 63.4167,
        longitude: 10.4000,
        by: 'Trondheim',
        fylke: 'Trøndelag',
        adresse: 'Høgskoleringen 1, 7491 Trondheim',
        nettside: 'https://www.ntnu.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uib:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Bergen',
        kortnavn: 'UiB',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Bergen',
        latitude: 60.3894,
        longitude: 5.3300,
        by: 'Bergen',
        fylke: 'Vestland',
        adresse: 'Muséplass 1, 5007 Bergen',
        nettside: 'https://www.uib.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uis:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Stavanger',
        kortnavn: 'UiS',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Stavanger',
        latitude: 58.9700,
        longitude: 5.7331,
        by: 'Stavanger',
        fylke: 'Rogaland',
        adresse: 'Kjell Arholms gate 41, 4036 Stavanger',
        nettside: 'https://www.uis.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uit:Institusjon {
        id: randomUUID(),
        navn: 'UiT Norges arktiske universitet',
        kortnavn: 'UiT',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Tromsø',
        latitude: 69.6833,
        longitude: 18.9833,
        by: 'Tromsø',
        fylke: 'Troms og Finnmark',
        adresse: 'Hansine Hansens veg 18, 9019 Tromsø',
        nettside: 'https://www.uit.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uia:Institusjon {
        id: randomUUID(),
        navn: 'Universitetet i Agder',
        kortnavn: 'UiA',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Kristiansand',
        latitude: 58.1467,
        longitude: 7.9956,
        by: 'Kristiansand',
        fylke: 'Agder',
        adresse: 'Universitetsgata 25, 4604 Kristiansand',
        nettside: 'https://www.uia.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (oslomet:Institusjon {
        id: randomUUID(),
        navn: 'OsloMet - storbyuniversitetet',
        kortnavn: 'OsloMet',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Oslo',
        latitude: 59.9522,
        longitude: 10.7595,
        by: 'Oslo',
        fylke: 'Oslo',
        adresse: 'Pilestredet 35, 0166 Oslo',
        nettside: 'https://www.oslomet.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hvl:Institusjon {
        id: randomUUID(),
        navn: 'Høgskulen på Vestlandet',
        kortnavn: 'HVL',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Bergen',
        latitude: 60.3913,
        longitude: 5.3221,
        by: 'Bergen',
        fylke: 'Vestland',
        adresse: 'Inndalsveien 28, 5063 Bergen',
        nettside: 'https://www.hvl.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hinn:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Innlandet',
        kortnavn: 'HiNN',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Lillehammer',
        latitude: 61.1153,
        longitude: 10.4662,
        by: 'Lillehammer',
        fylke: 'Innlandet',
        adresse: 'Postboks 400, 2418 Elverum',
        nettside: 'https://www.inn.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (himolde:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Molde',
        kortnavn: 'HiMolde',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Molde',
        latitude: 62.7372,
        longitude: 7.1607,
        by: 'Molde',
        fylke: 'Møre og Romsdal',
        adresse: 'Britvegen 2, 6410 Molde',
        nettside: 'https://www.himolde.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (bi:Institusjon {
        id: randomUUID(),
        navn: 'BI Norges Handelshøyskole',
        kortnavn: 'BI',
        type: 'høgskole',
        eier: 'privat',
        sted: 'Oslo',
        latitude: 59.9493,
        longitude: 10.7704,
        by: 'Oslo',
        fylke: 'Oslo',
        adresse: 'Nydalsveien 37, 0484 Oslo',
        nettside: 'https://www.bi.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (kristiania:Institusjon {
        id: randomUUID(),
        navn: 'Høyskolen Kristiania',
        kortnavn: 'Kristiania',
        type: 'høgskole',
        eier: 'privat',
        sted: 'Oslo',
        latitude: 59.9138,
        longitude: 10.7522,
        by: 'Oslo',
        fylke: 'Oslo',
        adresse: 'Prinsens gate 7-9, 0152 Oslo',
        nettside: 'https://www.kristiania.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hioa:Institusjon {
        id: randomUUID(),
        navn: 'Høgskolen i Oslo og Akershus',
        kortnavn: 'HiOA',
        type: 'høgskole',
        eier: 'offentlig',
        sted: 'Oslo',
        latitude: 59.9522,
        longitude: 10.7595,
        by: 'Oslo',
        fylke: 'Oslo',
        adresse: 'Pilestredet 35, 0166 Oslo',
        nettside: 'https://www.hioa.no',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (nord:Institusjon {
        id: randomUUID(),
        navn: 'Nord universitet',
        kortnavn: 'Nord',
        type: 'universitet',
        eier: 'offentlig',
        sted: 'Bodø',
        latitude: 67.2804,
        longitude: 14.4040,
        by: 'Bodø',
        fylke: 'Nordland',
        adresse: 'Universitetsalleen 11, 8026 Bodø',
        nettside: 'https://www.nord.no',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet institusjoner');

    // ========== UTDANNINGSTILBUD ==========
    console.log('🎓 Oppretter utdanningstilbud...');

    await session.run(`
      MATCH (uio:Institusjon {kortnavn: 'UiO'})
      MATCH (ntnu:Institusjon {kortnavn: 'NTNU'})
      MATCH (oslomet:Institusjon {kortnavn: 'OsloMet'})
      MATCH (kristiania:Institusjon {kortnavn: 'Kristiania'})

      CREATE (uio)-[:TILBYR]->(informatikk:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Informatikk: programmering og systemarkitektur',
        kortnavn: 'Informatikk',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (ntnu)-[:TILBYR]->(bygg:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Bygg- og miljøteknikk',
        kortnavn: 'Bygg- og miljøteknikk',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Trondheim',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (oslomet)-[:TILBYR]->(larerutdanning:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Grunnskolelærerutdanning 1-7',
        kortnavn: 'Lærerutdanning 1-7',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })

      CREATE (kristiania)-[:TILBYR]->(markedsforing:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Markedsføring og salgsledelse',
        kortnavn: 'Markedsføring',
        studienivaa: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
    `);

    // ========== AVANSERTE UTDANNINGSTILBUD ==========
    console.log('🎯 Oppretter avanserte utdanningstilbud...');

    await session.run(`
      MATCH (ntnu:Institusjon {kortnavn: 'NTNU'})
      MATCH (hioa:Institusjon {kortnavn: 'HiOA'})
      MATCH (uio:Institusjon {kortnavn: 'UiO'})
      MATCH (nord:Institusjon {kortnavn: 'Nord'})

      // NTNU avanserte ingeniørtilbud
      CREATE (ntnuAdvancedEng:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Bachelor i Ingeniørvitenskap - Avansert',
        beskrivelse: 'Avansert ingeniørutdanning med flere opptaksveier inkludert fagbrev og Y-vei',
        grad: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Trondheim',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnu)-[:TILBYR]->(ntnuAdvancedEng)

      // HiOA fagbrev-basert ingeniørutdanning
      CREATE (hioaFagbrevEng:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Ingeniørutdanning for Fagarbeidere',
        beskrivelse: 'Spesielt tilrettelagt 3-årig ingeniørutdanning for fagarbeidere',
        grad: 'bachelor',
        studiepoeng: 180,
        normertid: 3,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hioa)-[:TILBYR]->(hioaFagbrevEng)

      // UiO avansert lærerutdanning
      CREATE (uioAdvancedTeacher:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Master i lærerutdanning for trinn 8-13',
        beskrivelse: 'Avansert lærerutdanning med strenge opptakskrav og flere kvotetyper',
        grad: 'master',
        studiepoeng: 300,
        normertid: 5,
        studiested: 'Oslo',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uio)-[:TILBYR]->(uioAdvancedTeacher)

      // Nord Universitet samisk lærerutdanning
      CREATE (nordSamiTeacher:Utdanningstilbud {
        id: randomUUID(),
        navn: 'Grunnskolelærerutdanning 1-7 med samisk',
        beskrivelse: 'Lærerutdanning med særlig fokus på samisk språk og kultur',
        grad: 'master',
        studiepoeng: 300,
        normertid: 5,
        studiested: 'Bodø',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (nord)-[:TILBYR]->(nordSamiTeacher)
    `);

    console.log('✅ Opprettet utdanningstilbud');

    // ========== PERSONER (TESTDATA) ==========
    console.log('👥 Oppretter søkere...');

    await session.run(`
      CREATE (anna:Person {
        id: randomUUID(),
        fornavn: 'Anna',
        etternavn: 'Hansen',
        fodselsdato: date('2005-03-15'),
        kjonn: 'kvinne',
        telefon: '12345678',
        epost: 'anna.hansen@example.com',
        adresse: 'Storgata 1, 0001 Oslo',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (erik:Person {
        id: randomUUID(),
        fornavn: 'Erik',
        etternavn: 'Johnsen',
        fodselsdato: date('2004-08-22'),
        kjonn: 'mann',
        telefon: '23456789',
        epost: 'erik.johnsen@example.com',
        adresse: 'Parkveien 10, 7030 Trondheim',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (maria:Person {
        id: randomUUID(),
        fornavn: 'Maria',
        etternavn: 'Andersen',
        fodselsdato: date('1995-12-03'),
        kjonn: 'kvinne',
        telefon: '34567890',
        epost: 'maria.andersen@example.com',
        adresse: 'Torgallmenningen 2, 5020 Bergen',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (lars:Person {
        id: randomUUID(),
        fornavn: 'Lars',
        etternavn: 'Olsen',
        fodselsdato: date('2003-06-10'),
        kjonn: 'mann',
        telefon: '45678901',
        epost: 'lars.olsen@example.com',
        adresse: 'Kvadraturen 5, 4612 Kristiansand',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (sophie:Person {
        id: randomUUID(),
        fornavn: 'Sophie',
        etternavn: 'Müller',
        fodselsdato: date('2005-11-18'),
        kjonn: 'kvinne',
        telefon: '56789012',
        epost: 'sophie.muller@example.com',
        adresse: 'Hansastraße 15, 20354 Hamburg',
        statsborgerskap: 'tysk',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (thomas:Person {
        id: randomUUID(),
        fornavn: 'Thomas',
        etternavn: 'Nilsen',
        fodselsdato: date('2004-11-15'),
        kjonn: 'mann',
        telefon: '67890123',
        epost: 'thomas.nilsen@example.com',
        adresse: 'Kirkegata 45, 4611 Kristiansand',
        statsborgerskap: 'norsk',
        aktiv: true,
        opprettet: datetime()
      })
    `);
    console.log('✅ Opprettet søkere');

    // ========== DOKUMENTASJON OG KARAKTERER ==========
    console.log('📄 Oppretter dokumentasjon og karakterdata...');

    await session.run(`
      MATCH (anna:Person {fornavn: 'Anna'})
      MATCH (erik:Person {fornavn: 'Erik'})
      MATCH (maria:Person {fornavn: 'Maria'})
      MATCH (lars:Person {fornavn: 'Lars'})
      MATCH (sophie:Person {fornavn: 'Sophie'})
      MATCH (thomas:Person {fornavn: 'Thomas'})

      // Anna - vitnemål
      CREATE (anna)-[:HAR_DOKUMENTASJON]->(annaVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2023-06-15'),
        utsteder: 'Oslo katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Erik - vitnemål  
      CREATE (erik)-[:HAR_DOKUMENTASJON]->(erikVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2022-06-20'),
        utsteder: 'Trondheim katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Maria - fagbrev og karakterutskrift
      CREATE (maria)-[:HAR_DOKUMENTASJON]->(mariaFagbrev:Dokumentasjon {
        id: randomUUID(),
        type: 'fagbrev',
        navn: 'Fagbrev IKT-servicefag',
        utstedt: date('2016-08-15'),
        utsteder: 'Bergen tekniske fagskole',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (maria)-[:HAR_DOKUMENTASJON]->(mariaKarakter:Dokumentasjon {
        id: randomUUID(),
        type: 'karakterutskrift',
        navn: 'Karakterutskrift påbygging',
        utstedt: date('2017-06-10'),
        utsteder: 'Bergen voksenopplæring',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Lars - vitnemål
      CREATE (lars)-[:HAR_DOKUMENTASJON]->(larsVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2021-06-18'),
        utsteder: 'Kristiansand katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Sophie - IB Diploma
      CREATE (sophie)-[:HAR_DOKUMENTASJON]->(sophieIB:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'IB Diploma Programme',
        utstedt: date('2023-07-05'),
        utsteder: 'International School Hamburg',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Thomas - vitnemål med realfag
      CREATE (thomas)-[:HAR_DOKUMENTASJON]->(thomasVitnemaal:Dokumentasjon {
        id: randomUUID(),
        type: 'vitnemaal',
        navn: 'Vitnemål videregående opplæring',
        utstedt: date('2023-06-20'),
        utsteder: 'Kristiansand katedralskole',
        utdanningsnivaa: 'videregående',
        aktiv: true,
        opprettet: datetime()
      })

      // Karakterer for Anna
      WITH annaVitnemaal
      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})
      MATCH (fk3:Fagkode {kode: 'REA3024'})
      MATCH (fk4:Fagkode {kode: 'REA3026'})
      MATCH (fk5:Fagkode {kode: 'FYS1001'})
      MATCH (fk6:Fagkode {kode: 'KJE1001'})
      MATCH (fk7:Fagkode {kode: 'BIO1001'})

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '5',
        eksamen: null
      }]->(fk1)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-20'),
        standpunkt: '4',
        eksamen: null
      }]->(fk2)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-20'),
        standpunkt: '5',
        eksamen: null
      }]->(fk3)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-25'),
        standpunkt: '4',
        eksamen: null
      }]->(fk4)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-30'),
        standpunkt: '5',
        eksamen: null
      }]->(fk5)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-06-05'),
        standpunkt: '4',
        eksamen: null
      }]->(fk6)

      CREATE (annaVitnemaal)-[:INNEHOLDER {
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: '6',
        eksamen: null
      }]->(fk7)
    `);

    await session.run(`
      // Karakterer for Erik
      MATCH (erik:Person {fornavn: 'Erik'})
      MATCH (erikVitnemaal:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(erik)
      WHERE erikVitnemaal.type = 'vitnemaal'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})
      MATCH (fk3:Fagkode {kode: 'REA3024'})
      MATCH (fk4:Fagkode {kode: 'REA3026'})
      MATCH (fk5:Fagkode {kode: 'FYS1001'})
      MATCH (fk6:Fagkode {kode: 'FYS1002'})
      MATCH (fk7:Fagkode {kode: 'KJE1001'})

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2022-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(fk1)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-05-20'),
        standpunkt: '5',
        eksamen: null
      }]->(fk2)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2022-05-20'),
        standpunkt: '4',
        eksamen: null
      }]->(fk3)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-05-25'),
        standpunkt: '5',
        eksamen: null
      }]->(fk4)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2022-05-30'),
        standpunkt: '6',
        eksamen: null
      }]->(fk5)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2022-06-05'),
        standpunkt: '5',
        eksamen: null
      }]->(fk6)

      CREATE (erikVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2022-06-10'),
        standpunkt: '3',
        eksamen: null
      }]->(fk7)
    `);

    await session.run(`
      // Karakterer for Maria (fagbrev)
      MATCH (maria:Person {fornavn: 'Maria'})
      MATCH (mariaFagbrev:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(maria)
      WHERE mariaFagbrev.type = 'fagbrev'
      MATCH (mariaKarakter:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(maria)
      WHERE mariaKarakter.type = 'karakterutskrift'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})

      CREATE (mariaFagbrev)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2016-06-15'),
        standpunkt: '4',
        eksamen: null
      }]->(fk1)

      CREATE (mariaKarakter)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2017-05-20'),
        standpunkt: '5',
        eksamen: null
      }]->(fk2)
    `);

    await session.run(`
      // Karakterer for Lars
      MATCH (lars:Person {fornavn: 'Lars'})
      MATCH (larsVitnemaal:Dokumentasjon)<-[:HAR_DOKUMENTASJON]-(lars)
      WHERE larsVitnemaal.type = 'vitnemaal'

      MATCH (fk1:Fagkode {kode: 'NOR1211'})
      MATCH (fk2:Fagkode {kode: 'REA3022'})

      CREATE (larsVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2021-05-15'),
        standpunkt: '3',
        eksamen: null
      }]->(fk1)

      CREATE (larsVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2021-05-20'),
        standpunkt: '3',
        eksamen: null
      }]->(fk2)
    `);

    // Karakterer for Thomas - realfagsvitnemål
    await session.run(`
      MATCH (thomas:Person {fornavn: 'Thomas'})
      MATCH (thomas)-[:HAR_DOKUMENTASJON]->(thomasVitnemaal:Dokumentasjon {type: 'vitnemaal'})
      MATCH (vg1200:Fagkode {kode: 'VG1200'})
      MATCH (vg1330:Fagkode {kode: 'VG1330'})
      MATCH (vg1400:Fagkode {kode: 'VG1400'})
      MATCH (vg2500:Fagkode {kode: 'VG2500'})
      MATCH (vg4000:Fagkode {kode: 'VG4000'})
      MATCH (vg4001:Fagkode {kode: 'VG4001'})
      MATCH (vg4005:Fagkode {kode: 'VG4005'})
      MATCH (vg4600:Fagkode {kode: 'VG4600'})
      MATCH (vf4700:Fagkode {kode: 'VF4700'})
      MATCH (vf4900:Fagkode {kode: 'VF4900'})
      MATCH (vt1110:Fagkode {kode: 'VT1110'})
      MATCH (vt1121:Fagkode {kode: 'VT1121'})
      MATCH (vt1125:Fagkode {kode: 'VT1125'})
      MATCH (aa1010:Fagkode {kode: 'AA1010'})
      MATCH (aa6010:Fagkode {kode: 'AA6010'})
      MATCH (aa6210:Fagkode {kode: 'AA6210'})
      MATCH (aa6227:Fagkode {kode: 'AA6227'})
      MATCH (aa6230:Fagkode {kode: 'AA6230'})
      MATCH (aa6514:Fagkode {kode: 'AA6514'})
      MATCH (aa6524:Fagkode {kode: 'AA6524'})
      MATCH (vl1410:Fagkode {kode: 'VL1410'})
      MATCH (vl2270:Fagkode {kode: 'VL2270'})
      MATCH (vl2300:Fagkode {kode: 'VL2300'})

      // Engelsk - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(vg1200)

      // Matematikk 1MX - 6 (standpunkt) og 6 (eksamen)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '6',
        karaktersystem: '1-6',
        dato: date('2023-05-20'),
        standpunkt: '6',
        eksamen: '6'
      }]->(vg1330)

      // Naturfag - 5
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '5',
        eksamen: null
      }]->(vg1400)

      // Samfunnslære - 3
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '3',
        eksamen: null
      }]->(vg2500)

      // Norsk hovedmål - 2 (standpunkt) og 3 (eksamen)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: '2',
        eksamen: '3'
      }]->(vg4000)

      // Norsk sidemål - 2 (begge)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '2',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: '2',
        eksamen: '2'
      }]->(vg4001)

      // Norsk muntlig - 3
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2023-06-15'),
        standpunkt: '3',
        eksamen: null
      }]->(vg4005)

      // Historie - 2
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '2',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '2',
        eksamen: null
      }]->(vg4600)

      // Religion og etikk - 3
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '3',
        eksamen: null
      }]->(vf4700)

      // Kroppsøving - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(vf4900)

      // Fransk 1 - ikke bestått
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: null,
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: null,
        eksamen: null
      }]->(vt1110)

      // Fransk 2 - 2 (eksamen)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '2',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: null,
        eksamen: '2'
      }]->(vt1121)

      // Fransk muntlig - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-06-15'),
        standpunkt: null,
        eksamen: '4'
      }]->(vt1125)

      // Økonomi - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(aa1010)

      // Bedriftsøkonomi - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(aa6010)

      // Fysikk 2FY - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(aa6210)

      // Fysikk 3FY - 2 (standpunkt) og 3 (eksamen)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '3',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: '2',
        eksamen: '3'
      }]->(aa6227)

      // Kjemi 2KJ - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(aa6230)

      // Matematikk 2MX - 5
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '5',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '5',
        eksamen: null
      }]->(aa6514)

      // Matematikk 3MX - 4 (begge)
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-06-10'),
        standpunkt: '4',
        eksamen: '4'
      }]->(aa6524)

      // Valgfag 1 - Deltatt
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: 'Deltatt',
        karaktersystem: 'Bestått/Deltatt',
        dato: date('2023-05-15'),
        standpunkt: 'Deltatt',
        eksamen: null
      }]->(vl1410)

      // Valgfag 2 - Deltatt
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: 'Deltatt',
        karaktersystem: 'Bestått/Deltatt',
        dato: date('2023-05-15'),
        standpunkt: 'Deltatt',
        eksamen: null
      }]->(vl2270)

      // Valgfag 3 - 4
      CREATE (thomasVitnemaal)-[:INNEHOLDER {
        karakter: '4',
        karaktersystem: '1-6',
        dato: date('2023-05-15'),
        standpunkt: '4',
        eksamen: null
      }]->(vl2300)
    `);

    console.log('✅ Opprettet dokumentasjon og karakterdata');

    // ========== OPPTAKSVEIER (BESLUTNINGSTRE) ==========
    console.log('🌳 Oppretter opptaksveier for regelsett...');

    // Opptaksveier for UiO Informatikk
    await session.run(`
      MATCH (uioInformatikk:Regelsett {navn: 'UiO Informatikk H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (logikk1:LogicalNode {navn: 'UiO Informatikk Grunnkrav'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})

      CREATE (vei1:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær vei - UiO Informatikk',
        beskrivelse: 'Standard opptaksvei for informatikk ved UiO',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioInformatikk)-[:HAR_OPPTAKSVEI]->(vei1)
      CREATE (vei1)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (vei1)-[:HAR_REGEL]->(logikk1)
      CREATE (vei1)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (vei1)-[:BRUKER_RANGERING]->(konkurransepoeng)
    `);

    // Opptaksveier for NTNU Bygg
    await session.run(`
      MATCH (ntnuBygg:Regelsett {navn: 'NTNU Bygg- og miljøteknikk H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (logikk4:LogicalNode {navn: 'NTNU Bygg Grunnkrav'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})

      CREATE (vei2:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær vei - NTNU Bygg',
        beskrivelse: 'Standard opptaksvei for bygg- og miljøteknikk ved NTNU',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuBygg)-[:HAR_OPPTAKSVEI]->(vei2)
      CREATE (vei2)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (vei2)-[:HAR_REGEL]->(logikk4)
      CREATE (vei2)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (vei2)-[:BRUKER_RANGERING]->(konkurransepoeng)
    `);

    // Opptaksveier for OsloMet Lærerutdanning
    await session.run(`
      MATCH (oslometLaerer:Regelsett {navn: 'OsloMet Lærerutdanning 1-7 H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (logikk6:LogicalNode {navn: 'OsloMet Lærer Grunnkrav'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})

      CREATE (vei3:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær vei - OsloMet Lærerutdanning',
        beskrivelse: 'Standard opptaksvei for lærerutdanning ved OsloMet',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (oslometLaerer)-[:HAR_OPPTAKSVEI]->(vei3)
      CREATE (vei3)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (vei3)-[:HAR_REGEL]->(logikk6)
      CREATE (vei3)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (vei3)-[:BRUKER_RANGERING]->(konkurransepoeng)
    `);

    // ========== AVANSERTE OPPTAKSVEIER ==========
    console.log('🌲 Oppretter avanserte opptaksveier...');

    // NTNU Ingeniør Avansert - 4 opptaksveier
    await session.run(`
      MATCH (ntnuIngAvansert:Regelsett {navn: 'NTNU Ingeniør Avansert H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (fagbrevGrunnlag:Grunnlag {type: 'fagbrev'})
      MATCH (forkursGrunnlag:Grunnlag {type: 'forkurs-ingenior'})
      MATCH (yVeiGrunnlag:Grunnlag {type: 'y-veien'})
      MATCH (realkompGrunnlag:Grunnlag {type: 'realkompetanse-uh'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (fagbrevKvote:KvoteType {type: 'fagbrev'})
      MATCH (forkursKvote:KvoteType {type: 'forkurs'})
      MATCH (yVeiKvote:KvoteType {type: 'y-vei'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})
      MATCH (realkompetanse:RangeringType {type: 'realkompetanse'})
      
      MATCH (ntnu_ord:LogicalNode {navn: 'NTNU Avansert Ordinær'})
      MATCH (ntnu_fagbrev:LogicalNode {navn: 'NTNU Avansert Fagbrev'})
      MATCH (ntnu_forkurs:LogicalNode {navn: 'NTNU Avansert Forkurs'})
      MATCH (ntnu_yvei:LogicalNode {navn: 'NTNU Avansert Y-vei'})

      // Ordinær vei - vitnemål videregående
      CREATE (ntnu_av_1:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær vei - NTNU Avansert',
        beskrivelse: 'Standard opptaksvei med GSK + Matematikk R1+R2 + Fysikk 1',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuIngAvansert)-[:HAR_OPPTAKSVEI]->(ntnu_av_1)
      CREATE (ntnu_av_1)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (ntnu_av_1)-[:HAR_REGEL]->(ntnu_ord)
      CREATE (ntnu_av_1)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (ntnu_av_1)-[:BRUKER_RANGERING]->(konkurransepoeng)

      // Fagbrev vei - fagbrev/svennebrev
      CREATE (ntnu_av_2:OpptaksVei {
        id: randomUUID(),
        navn: 'Fagbrev vei - NTNU Avansert',
        beskrivelse: 'For fagarbeidere med teknisk fagbrev og arbeidserfaring',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuIngAvansert)-[:HAR_OPPTAKSVEI]->(ntnu_av_2)
      CREATE (ntnu_av_2)-[:BASERT_PÅ]->(fagbrevGrunnlag)
      CREATE (ntnu_av_2)-[:HAR_REGEL]->(ntnu_fagbrev)
      CREATE (ntnu_av_2)-[:GIR_TILGANG_TIL]->(fagbrevKvote)
      CREATE (ntnu_av_2)-[:BRUKER_RANGERING]->(realkompetanse)

      // Forkurs vei - forkurs ingeniør
      CREATE (ntnu_av_3:OpptaksVei {
        id: randomUUID(),
        navn: 'Forkurs vei - NTNU Avansert',
        beskrivelse: 'For søkere med fullført forkurs for ingeniørutdanning',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuIngAvansert)-[:HAR_OPPTAKSVEI]->(ntnu_av_3)
      CREATE (ntnu_av_3)-[:BASERT_PÅ]->(forkursGrunnlag)
      CREATE (ntnu_av_3)-[:HAR_REGEL]->(ntnu_forkurs)
      CREATE (ntnu_av_3)-[:GIR_TILGANG_TIL]->(forkursKvote)
      CREATE (ntnu_av_3)-[:BRUKER_RANGERING]->(konkurransepoeng)

      // Y-vei - realkompetanse 25+ år
      CREATE (ntnu_av_4:OpptaksVei {
        id: randomUUID(),
        navn: 'Y-vei - NTNU Avansert',
        beskrivelse: 'For søkere over 25 år med realkompetanse',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (ntnuIngAvansert)-[:HAR_OPPTAKSVEI]->(ntnu_av_4)
      CREATE (ntnu_av_4)-[:BASERT_PÅ]->(realkompGrunnlag)
      CREATE (ntnu_av_4)-[:HAR_REGEL]->(ntnu_yvei)
      CREATE (ntnu_av_4)-[:GIR_TILGANG_TIL]->(yVeiKvote)
      CREATE (ntnu_av_4)-[:BRUKER_RANGERING]->(realkompetanse)
    `);

    // HiOA Ingeniør Fagbrev - spesiell fagbrev-vei
    await session.run(`
      MATCH (hioaIngFagbrev:Regelsett {navn: 'HiOA Ingeniør Fagbrev H25'})
      MATCH (fagbrevGrunnlag:Grunnlag {type: 'fagbrev'})
      MATCH (fagbrevKvote:KvoteType {type: 'fagbrev'})
      MATCH (realkompetanse:RangeringType {type: 'realkompetanse'})
      MATCH (hioa_fagbrev:LogicalNode {navn: 'HiOA Fagbrev Spesiell'})

      CREATE (hioa_fb_1:OpptaksVei {
        id: randomUUID(),
        navn: 'Fagbrev spesiell - HiOA',
        beskrivelse: 'Spesielt tilrettelagt ingeniørutdanning for fagarbeidere',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (hioaIngFagbrev)-[:HAR_OPPTAKSVEI]->(hioa_fb_1)
      CREATE (hioa_fb_1)-[:BASERT_PÅ]->(fagbrevGrunnlag)
      CREATE (hioa_fb_1)-[:HAR_REGEL]->(hioa_fagbrev)
      CREATE (hioa_fb_1)-[:GIR_TILGANG_TIL]->(fagbrevKvote)
      CREATE (hioa_fb_1)-[:BRUKER_RANGERING]->(realkompetanse)
    `);

    // UiO Lærerutdanning Avansert - 2 opptaksveier (riktig struktur)
    await session.run(`
      MATCH (uioLaererAvansert:Regelsett {navn: 'UiO Lærerutdanning Avansert H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (forstegangsvitnemaal:Grunnlag {type: 'forstegangsvitnemaal'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (forsteKvote:KvoteType {type: 'forstegangsvitnemaal'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})
      
      MATCH (uio_laerer_ord:LogicalNode {navn: 'UiO Lærer Ordinær Streng'})
      MATCH (uio_laerer_forste:LogicalNode {navn: 'UiO Lærer Førstegangsvitnemål'})

      // Ordinær kvote (for alle over 21 år)
      CREATE (uio_la_1:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær kvote - UiO Lærer Avansert',
        beskrivelse: 'Hovedkvote for søkere over 21 år: norsk 3.0, mat 4.0, 35 poeng',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioLaererAvansert)-[:HAR_OPPTAKSVEI]->(uio_la_1)
      CREATE (uio_la_1)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (uio_la_1)-[:HAR_REGEL]->(uio_laerer_ord)
      CREATE (uio_la_1)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (uio_la_1)-[:BRUKER_RANGERING]->(konkurransepoeng)

      // Førstegangsvitnemålskvote (21 år eller yngre)
      CREATE (uio_la_2:OpptaksVei {
        id: randomUUID(),
        navn: 'Førstegangsvitnemål - UiO Lærer Avansert',
        beskrivelse: 'For søkere 21 år eller yngre med nytt vitnemål: norsk 3.0, mat 4.0',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (uioLaererAvansert)-[:HAR_OPPTAKSVEI]->(uio_la_2)
      CREATE (uio_la_2)-[:BASERT_PÅ]->(forstegangsvitnemaal)
      CREATE (uio_la_2)-[:HAR_REGEL]->(uio_laerer_forste)
      CREATE (uio_la_2)-[:GIR_TILGANG_TIL]->(forsteKvote)
      CREATE (uio_la_2)-[:BRUKER_RANGERING]->(konkurransepoeng)
    `);

    // Nord Universitet Samisk - 2 opptaksveier
    await session.run(`
      MATCH (nordLaererSamisk:Regelsett {navn: 'Nord Universitet Lærer Samisk H25'})
      MATCH (vitnemaalVgs:Grunnlag {type: 'vitnemaal-vgs'})
      MATCH (ordinaer:KvoteType {type: 'ordinaer'})
      MATCH (samiskKvote:KvoteType {type: 'samisk'})
      MATCH (konkurransepoeng:RangeringType {type: 'konkurransepoeng'})
      
      MATCH (nord_samisk_ord:LogicalNode {navn: 'Nord Samisk Ordinær'})
      MATCH (nord_samisk_kvote:LogicalNode {navn: 'Nord Samisk Kvote'})

      // Ordinær vei
      CREATE (nord_sa_1:OpptaksVei {
        id: randomUUID(),
        navn: 'Ordinær vei - Nord Samisk',
        beskrivelse: 'Standard lærerutdanning med ordinære krav',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (nordLaererSamisk)-[:HAR_OPPTAKSVEI]->(nord_sa_1)
      CREATE (nord_sa_1)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (nord_sa_1)-[:HAR_REGEL]->(nord_samisk_ord)
      CREATE (nord_sa_1)-[:GIR_TILGANG_TIL]->(ordinaer)
      CREATE (nord_sa_1)-[:BRUKER_RANGERING]->(konkurransepoeng)

      // Samisk kvote (lempede krav)
      CREATE (nord_sa_2:OpptaksVei {
        id: randomUUID(),
        navn: 'Samisk kvote - Nord Samisk',
        beskrivelse: 'Særlig kvote for søkere med samisk bakgrunn',
        aktiv: true,
        opprettet: datetime()
      })
      CREATE (nordLaererSamisk)-[:HAR_OPPTAKSVEI]->(nord_sa_2)
      CREATE (nord_sa_2)-[:BASERT_PÅ]->(vitnemaalVgs)
      CREATE (nord_sa_2)-[:HAR_REGEL]->(nord_samisk_kvote)
      CREATE (nord_sa_2)-[:GIR_TILGANG_TIL]->(samiskKvote)
      CREATE (nord_sa_2)-[:BRUKER_RANGERING]->(konkurransepoeng)
    `);

    console.log('✅ Opprettet opptaksveier');

    // ========== UTDANNINGSTILBUD-REGELSETT KOBLINGER ==========
    console.log('🔗 Kobler utdanningstilbud til regelsett...');

    await session.run(`
      MATCH (uio_utd:Utdanningstilbud {navn: 'Bachelor i Informatikk: programmering og systemarkitektur'})
      MATCH (uio_rs:Regelsett {navn: 'UiO Informatikk H25'})
      CREATE (uio_utd)-[:HAR_REGELSETT]->(uio_rs)
      
      WITH 1 as dummy
      MATCH (ntnu_utd:Utdanningstilbud {navn: 'Bachelor i Bygg- og miljøteknikk'})
      MATCH (ntnu_rs:Regelsett {navn: 'NTNU Bygg- og miljøteknikk H25'})
      CREATE (ntnu_utd)-[:HAR_REGELSETT]->(ntnu_rs)
      
      WITH 1 as dummy
      MATCH (oslomet_utd:Utdanningstilbud {navn: 'Bachelor i Grunnskolelærerutdanning 1-7'})
      MATCH (oslomet_rs:Regelsett {navn: 'OsloMet Lærerutdanning 1-7 H25'})
      CREATE (oslomet_utd)-[:HAR_REGELSETT]->(oslomet_rs)
    `);

    // ========== AVANSERTE UTDANNINGSTILBUD-REGELSETT KOBLINGER ==========
    console.log('🔗 Kobler avanserte utdanningstilbud til regelsett...');

    await session.run(`
      // NTNU Avansert Ingeniør
      MATCH (ntnu_adv_utd:Utdanningstilbud {navn: 'Bachelor i Ingeniørvitenskap - Avansert'})
      MATCH (ntnu_adv_rs:Regelsett {navn: 'NTNU Ingeniør Avansert H25'})
      CREATE (ntnu_adv_utd)-[:HAR_REGELSETT]->(ntnu_adv_rs)
      
      WITH 1 as dummy
      // HiOA Fagbrev Ingeniør
      MATCH (hioa_fb_utd:Utdanningstilbud {navn: 'Ingeniørutdanning for Fagarbeidere'})
      MATCH (hioa_fb_rs:Regelsett {navn: 'HiOA Ingeniør Fagbrev H25'})
      CREATE (hioa_fb_utd)-[:HAR_REGELSETT]->(hioa_fb_rs)
      
      WITH 1 as dummy
      // UiO Avansert Lærer
      MATCH (uio_adv_utd:Utdanningstilbud {navn: 'Master i lærerutdanning for trinn 8-13'})
      MATCH (uio_adv_rs:Regelsett {navn: 'UiO Lærerutdanning Avansert H25'})
      CREATE (uio_adv_utd)-[:HAR_REGELSETT]->(uio_adv_rs)
      
      WITH 1 as dummy
      // Nord Samisk Lærer
      MATCH (nord_sami_utd:Utdanningstilbud {navn: 'Grunnskolelærerutdanning 1-7 med samisk'})
      MATCH (nord_sami_rs:Regelsett {navn: 'Nord Universitet Lærer Samisk H25'})
      CREATE (nord_sami_utd)-[:HAR_REGELSETT]->(nord_sami_rs)
    `);

    console.log('✅ Opprettet utdanningstilbud-regelsett koblinger');

    console.log('✅ Fullført seeding av alle data!');

    // ========== SAMMENDRAG ==========
    console.log('\\n📊 Sammendrag av seeded data:');

    // Kjør separate tellinger for bedre ytelse
    const fagStats = await session.run(`
      MATCH (fk:Fagkode)
      RETURN count(fk) as fagkoder
    `);

    const entityStats = await session.run(`
      MATCH (k:Kravelement) WITH count(k) as kravelementer
      MATCH (g:Grunnlag) WITH kravelementer, count(g) as grunnlag
      MATCH (kv:KvoteType) WITH kravelementer, grunnlag, count(kv) as kvotetyper
      MATCH (rt:RangeringType) WITH kravelementer, grunnlag, kvotetyper, count(rt) as rangeringstyper
      MATCH (pt:PoengType) WITH kravelementer, grunnlag, kvotetyper, rangeringstyper, count(pt) as poengtyper
      RETURN kravelementer, grunnlag, kvotetyper, rangeringstyper, poengtyper
    `);

    const instStats = await session.run(`
      MATCH (i:Institusjon) WITH count(i) as institusjoner
      MATCH (u:Utdanningstilbud) WITH institusjoner, count(u) as utdanningstilbud
      MATCH (p:Person) WITH institusjoner, utdanningstilbud, count(p) as personer
      MATCH (d:Dokumentasjon) WITH institusjoner, utdanningstilbud, personer, count(d) as dokumenter
      RETURN institusjoner, utdanningstilbud, personer, dokumenter
    `);

    const regStats = await session.run(`
      MATCH (r:Regelsett) WITH count(r) as regelsett
      MATCH (o:OpptaksVei) WITH regelsett, count(o) as opptaksveier
      OPTIONAL MATCH (:Dokumentasjon)-[rel:INNEHOLDER]->(:Fagkode)
      RETURN regelsett, opptaksveier, count(rel) as karakterer
    `);

    // Hent data fra de separate query-ene
    const fag = fagStats.records[0];
    const entity = entityStats.records[0];
    const inst = instStats.records[0];
    const reg = regStats.records[0];

    console.log(`   📋 Fagkoder: ${fag.get('fagkoder').toNumber()}`);
    console.log(`   🎯 Kravelementer: ${entity.get('kravelementer').toNumber()}`);
    console.log(`   🏗️ Grunnlag: ${entity.get('grunnlag').toNumber()}`);
    console.log(`   📊 Kvotetyper: ${entity.get('kvotetyper').toNumber()}`);
    console.log(`   📈 Rangeringstyper: ${entity.get('rangeringstyper').toNumber()}`);
    console.log(`   📊 PoengTyper: ${entity.get('poengtyper').toNumber()}`);
    console.log(`   🏢 Institusjoner: ${inst.get('institusjoner').toNumber()}`);
    console.log(`   🎓 Utdanningstilbud: ${inst.get('utdanningstilbud').toNumber()}`);
    console.log(`   👥 Personer: ${inst.get('personer').toNumber()}`);
    console.log(`   📄 Dokumenter: ${inst.get('dokumenter').toNumber()}`);
    console.log(`   📜 Regelsett: ${reg.get('regelsett').toNumber()}`);
    console.log(`   🌳 Opptaksveier: ${reg.get('opptaksveier').toNumber()}`);
    console.log(`   ⭐ Karakterer: ${reg.get('karakterer').toNumber()}`);

    // Verifiser RangeringType-relasjoner
    const rangeringCheck = await session.run(`
      MATCH (rt:RangeringType)-[:INKLUDERER_POENGTYPE]->(pt:PoengType)
      RETURN rt.navn as rangeringstype, collect(pt.navn) as poengtyper
      ORDER BY rt.navn
    `);

    console.log('\\n📈 RangeringType PoengType-relasjoner:');
    rangeringCheck.records.forEach((record) => {
      const rtNavn = record.get('rangeringstype');
      const ptNavn = record.get('poengtyper');
      console.log(`   ${rtNavn}: ${ptNavn.length} poengtyper`);
      ptNavn.forEach((pt: string) => {
        console.log(`     - ${pt}`);
      });
    });

    // Verifiser regelsett og opptaksveier
    const regelsettCheck = await session.run(`
      MATCH (r:Regelsett)
      OPTIONAL MATCH (r)-[:HAR_OPPTAKSVEI]->(o:OpptaksVei)
      RETURN r.navn as regelsett, r.erMal as erMal, count(o) as antallOpptaksveier
      ORDER BY r.erMal DESC, r.navn
    `);

    console.log('\n📜 Regelsett og opptaksveier:');
    regelsettCheck.records.forEach((record) => {
      const regelsett = record.get('regelsett');
      const erMal = record.get('erMal');
      const antall = record.get('antallOpptaksveier').toNumber();
      const type = erMal ? 'MAL' : 'KONKRET';
      console.log(`   ${regelsett} (${type}): ${antall} opptaksveier`);
    });

    console.log('\\n🎉 Seeding fullført!');
  } finally {
    await session.close();
  }
}

/**
 * Fjerner all data fra databasen
 */
export async function clearAll() {
  const session = getSession();

  try {
    console.log('🗑️ Sletter all data...');

    await session.run(`
      MATCH (n) DETACH DELETE n
    `);

    console.log('✅ All data slettet');
  } finally {
    await session.close();
  }
}

// CLI entry point
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\\n✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    });
}
