import { NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET() {
  const session = getSession();

  try {
    // Hent grunnleggende statistikk
    const statsResult = await session.run(`
      MATCH (i:Institusjon) 
      WITH count(i) as institusjoner
      
      MATCH (u:Utdanningstilbud)
      WITH institusjoner, count(u) as utdanningstilbud
      
      MATCH (p:Person)
      WITH institusjoner, utdanningstilbud, count(p) as sokere
      
      MATCH (rm:RegelsettMal)
      WITH institusjoner, utdanningstilbud, sokere, count(rm) as regelsettMaler
      
      MATCH (d:Dokumentasjon)
      WITH institusjoner, utdanningstilbud, sokere, regelsettMaler, count(d) as dokumenter
      
      MATCH (fk:Fagkode)
      WITH institusjoner, utdanningstilbud, sokere, regelsettMaler, dokumenter, count(fk) as fagkoder
      
      RETURN {
        institusjoner: institusjoner,
        utdanningstilbud: utdanningstilbud,
        sokere: sokere,
        regelsettMaler: regelsettMaler,
        dokumenter: dokumenter,
        fagkoder: fagkoder
      } as stats
    `);

    // Hent karakterstatistikk
    const karakterStatsResult = await session.run(`
      MATCH (d:Dokumentasjon)-[r:INNEHOLDER]->(fk:Fagkode)
      WHERE r.karaktersystem = "1-6"
      WITH toInteger(r.karakter) as karakter
      WHERE karakter >= 1 AND karakter <= 6
      WITH karakter, count(*) as antall
      RETURN collect({karakter: karakter, antall: antall}) as karakterfordeling
    `);

    // Hent institusjoner med antall tilbud
    const institusjonStatsResult = await session.run(`
      MATCH (i:Institusjon)
      OPTIONAL MATCH (i)-[:TILBYR]->(u:Utdanningstilbud)
      WITH i, count(u) as antallTilbud
      ORDER BY antallTilbud DESC
      LIMIT 5
      RETURN collect({
        navn: i.navn,
        kortNavn: i.kortNavn,
        antallTilbud: antallTilbud
      }) as topInstitusjoner
    `);

    // Hent faggrupper med antall fagkoder
    const faggruppeStatsResult = await session.run(`
      MATCH (fg:Faggruppe)
      OPTIONAL MATCH (fk:Fagkode)-[:KVALIFISERER_FOR]->(fg)
      WITH fg, count(fk) as antallFagkoder
      ORDER BY antallFagkoder DESC
      RETURN collect({
        navn: fg.navn,
        type: fg.type,
        antallFagkoder: antallFagkoder
      }) as faggrupper
    `);

    const stats = statsResult.records[0].get('stats');
    const karakterfordeling = karakterStatsResult.records[0].get('karakterfordeling');
    const topInstitusjoner = institusjonStatsResult.records[0].get('topInstitusjoner');
    const faggrupper = faggruppeStatsResult.records[0].get('faggrupper');

    // Convert Neo4j integers to regular numbers
    const convertNeo4jIntegers = (obj: any): any => {
      if (obj && typeof obj === 'object') {
        if (obj.low !== undefined && obj.high !== undefined) {
          return obj.toNumber ? obj.toNumber() : obj.low;
        }
        if (Array.isArray(obj)) {
          return obj.map(convertNeo4jIntegers);
        }
        const converted: any = {};
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertNeo4jIntegers(value);
        }
        return converted;
      }
      return obj;
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: convertNeo4jIntegers(stats),
        karakterfordeling: convertNeo4jIntegers(karakterfordeling),
        topInstitusjoner: convertNeo4jIntegers(topInstitusjoner),
        faggrupper: convertNeo4jIntegers(faggrupper),
      },
    });
  } catch (error) {
    console.error('Feil ved henting av dashboard statistikk:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kunne ikke hente dashboard statistikk',
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
