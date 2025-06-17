# 🎓 Grafopptak

Opptakssystem for høyere utdanning bygget med Next.js og Neo4j.

## 🚀 Kom i gang

### Med Docker (anbefalt)

```bash
# Start hele stacken
docker-compose up

# Appen kjører på http://localhost:3000
# Neo4j Browser på http://localhost:7474
```

### Lokal utvikling

```bash
# Installer dependencies
npm install

# Start Neo4j i Docker
docker-compose up neo4j

# Kjør utviklingsserver
npm run dev
```

## 📁 Prosjektstruktur

```
grafopptak/
├── app/                # Next.js App Router
│   ├── api/           # API endpoints
│   └── components/    # React komponenter
├── lib/               # Utilities og database
├── domenekunnskap/    # Domenedokumentasjon
└── tests/             # Tester
```

## 🧪 Testing

```bash
npm test          # Kjør tester
npm run test:watch # Watch mode
```

## 📝 Kode kvalitet

```bash
npm run lint      # Sjekk linting
npm run format    # Formater kode
```

## 🔧 Miljøvariabler

Kopier `.env.example` til `.env` og oppdater verdiene:

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=grafopptak123
```
