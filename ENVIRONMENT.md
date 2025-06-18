# 🚀 Miljøhåndtering for Grafopptak

## 📋 Oversikt

Vi har to separate miljøer med egne porter:

### 🛠️ Development

- **Next.js**: Port 3000
- **Neo4j Bolt**: Port 7687
- **Neo4j Browser**: Port 7474
- **Database**: Egen dev-database

### 🏭 Production

- **Next.js**: Port 3001
- **Neo4j Bolt**: Port 7688
- **Neo4j Browser**: Port 7475
- **Database**: Egen prod-database

## 🎯 Kommandoer

### Development miljø

```bash
# Start hele dev-miljøet (Neo4j + Next.js)
npm run dev:env:start

# Stopp dev-miljøet
npm run dev:env:stop

# Restart dev-miljøet
npm run dev:env:restart

# Sjekk status
npm run dev:env:status

# Rydd opp alt (drep prosesser, stopp containers)
npm run dev:env:clean
```

### Production miljø

```bash
# Start produksjon
npm run production:start

# Stopp produksjon
npm run production:stop

# Restart produksjon
npm run production:restart
```

## 🔧 Vanlige problemer

### "Port already in use"

```bash
# Rydd opp alle prosesser
npm run dev:env:clean

# Start på nytt
npm run dev:env:start
```

### Miljøvariabler

- Dev bruker: `.env` eller `.env.development`
- Prod bruker: `.env.production`

## 📊 Port-oversikt

| Tjeneste      | Development | Production |
| ------------- | ----------- | ---------- |
| Next.js       | 3000        | 3001       |
| Neo4j Bolt    | 7687        | 7688       |
| Neo4j Browser | 7474        | 7475       |

## 🐳 Docker Compose filer

- `docker-compose.dev.yml` - Development Neo4j
- `docker-compose.prod.yml` - Production stack
- `docker-compose.yml` - Legacy (ikke i bruk)
