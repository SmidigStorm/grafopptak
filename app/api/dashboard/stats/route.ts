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
      
      MATCH (r:Regelsett)
      WITH institusjoner, utdanningstilbud, sokere, count(r) as regelsett
      
      MATCH (d:Dokumentasjon)
      WITH institusjoner, utdanningstilbud, sokere, regelsett, count(d) as dokumenter
      
      MATCH (fk:Fagkode)
      WITH institusjoner, utdanningstilbud, sokere, regelsett, dokumenter, count(fk) as fagkoder
      
      RETURN {
        institusjoner: institusjoner,
        utdanningstilbud: utdanningstilbud,
        sokere: sokere,
        regelsett: regelsett,
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

    const stats =
      statsResult.records.length > 0
        ? statsResult.records[0].get('stats')
        : {
            institusjoner: 0,
            utdanningstilbud: 0,
            sokere: 0,
            regelsett: 0,
            dokumenter: 0,
            fagkoder: 0,
          };

    const karakterfordeling =
      karakterStatsResult.records.length > 0
        ? karakterStatsResult.records[0].get('karakterfordeling')
        : [];

    const topInstitusjoner =
      institusjonStatsResult.records.length > 0
        ? institusjonStatsResult.records[0].get('topInstitusjoner')
        : [];

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
