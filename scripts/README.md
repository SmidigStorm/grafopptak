# 🛠️ Scripts

Denne mappen inneholder utility scripts for databasehåndtering og seeding.

## 📁 Tilgjengelige scripts

### `seeding/` (Ny modulær struktur)

Modulær seeding-struktur som erstatter den monolitiske `seed-all.ts`.

**Moduler:**

- `core/` - Fagkoder, standard-komponenter, institusjoner
- `regelsett/` - Maler og konkrete regelsett med opptaksveier
- `personer/` - Søkere og dokumentasjon
- `index.ts` - Hovedorchestrator

### `seed-all.ts` (Utfases)

Gammel monolitisk seeding (1400+ linjer). Erstattes av modulær struktur.

### `seed-karakterer.ts`

Spesialisert script for å lage karakterdata og dokumentasjon for testpersoner.

### `db-admin.ts`

Interaktivt administratorverktøy for databasehåndtering.

### `prod-server.sh`

Docker-basert produksjonsserver management.

## 🚀 Bruk

### Database reset og seeding

```bash
npm run db:reset    # Full reset + seeding
npm run db:seed     # Kun seeding (modulær struktur)
npm run db:admin    # Interaktivt admin-verktøy
npm run db:stats    # Database-statistikk
```

### Produksjonsserver

```bash
npm run prod:start    # Start Docker-produksjon
npm run prod:stop     # Stopp produksjon
npm run prod:status   # Status og helse
npm run prod:logs     # Se logger
```

## 📊 Etter seeding

Databasen inneholder:

- 4 faggrupper med 15 fagkoder
- 16 realistiske grunnlag for opptak
- 13 kravelementer
- 3 kvotetyper og 6 rangeringstyper
- 12 institusjoner med utdanningstilbud
- 5 søkere med dokumentasjon og karakterer

## ⚠️ Merk

- seed-all.ts resetter og populerer hele databasen
- UUIDer genereres automatisk av Neo4j
- Tester bruker isolert test-database
