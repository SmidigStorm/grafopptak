import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'grafopptak123';

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

export function getSession(): Session {
  return getDriver().session();
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export class Neo4jDatabase {
  private driver: Driver;

  constructor(config: { uri: string; user: string; password: string }) {
    this.driver = neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.password));
  }

  async verifyConnectivity(): Promise<void> {
    await this.driver.verifyConnectivity();
  }

  async runQuery(query: string, params: any = {}): Promise<any> {
    const session = this.driver.session();
    try {
      const result = await session.run(query, params);
      return result;
    } finally {
      await session.close();
    }
  }

  session(): Session {
    return this.driver.session();
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}
