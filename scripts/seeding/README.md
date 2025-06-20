# 🌱 Modulær Seeding Struktur

Denne mappen inneholder en modulær erstatning for den monolitiske `seed-all.ts`. Seeding er nå organisert i logiske moduler som kan kjøres individuelt eller som en helhet.

## 📁 Struktur

```
seeding/
├── index.ts                 # Hovedorchestrator
├── core/                    # Grunnleggende entiteter
│   ├── fagkoder.ts         # Fagkoder og faggrupper
│   ├── standard-komponenter.ts # Kravelementer, grunnlag, kvotetyper, rangeringstyper
│   └── institusjoner.ts    # Institusjoner og utdanningstilbud
├── regelsett/              # Regelsett og opptaksveier
│   ├── maler.ts           # Regelsett-maler
│   └── konkrete.ts        # Konkrete regelsett med opptaksveier
└── personer/               # Testpersoner
    ├── sokere.ts          # Søkere/testpersoner
    └── dokumentasjon.ts   # Dokumentasjon og karakterer
```

## 🎯 Moduler

### Core Moduler

**fagkoder.ts**

- 4 faggrupper (Matematikk R1/R2, Norsk 393t, Realfag valgfritt)
- 14 fagkoder (matematikk, norsk, realfag)
- Relasjoner mellom fagkoder og faggrupper

**standard-komponenter.ts**

- 13 kravelementer (GSK, matematikk-krav, etc.)
- 16 grunnlag (vitnemål-typer, fagbrev, høyere utdanning, etc.)
- 3 kvotetyper (ordinær, førstegangsvitnemål, forkurs)
- 6 rangeringstyper (karaktersnitt, fagbrev, erfaring, etc.)

**institusjoner.ts**

- 12 institusjoner (UiO, NTNU, UiB, etc.)
- 4 utdanningstilbud med TILBYR-relasjoner

### Regelsett Moduler

**maler.ts**

- 4 regelsett-maler: Ingeniør, Lærer, Økonomi, Helse
- Grunnlag for standardiserte opptaksveier

**konkrete.ts**

- 3 konkrete regelsett basert på maler
- Komplette opptaksveier med Grunnlag → Krav → Kvote → Rangering

### Personer Moduler

**sokere.ts**

- 5 testpersoner med realistiske data
- Norge og Tyskland som statsborgerskap

**dokumentasjon.ts**

- Bruker eksisterende seed-karakterer.ts
- Dokumentasjon og karakterdata for søkerne

## 🚀 Bruk

### Komplett seeding

```bash
npm run db:seed
# eller
tsx scripts/seeding/index.ts
```

### Individuell modul-testing

```typescript
import { seedFagkoder } from './core/fagkoder';
import { seedStandardKomponenter } from './core/standard-komponenter';

// Seed bare fagkoder
await seedFagkoder();

// Clear og reseed standard-komponenter
await clearStandardKomponenter();
await seedStandardKomponenter();
```

## 📊 Sammendrag

Etter full seeding vil databasen inneholde:

- **Faggrupper**: 4 med tilknyttede fagkoder
- **Standard-komponenter**: 13 kravelementer, 16 grunnlag, 3 kvotetyper, 6 rangeringstyper
- **Institusjoner**: 12 institusjoner med 4 utdanningstilbud
- **Regelsett**: 4 maler + 3 konkrete regelsett
- **OpptaksVeier**: ~10 komplette opptaksveier
- **Personer**: 5 søkere med dokumentasjon og karakterer

## ⚠️ Avhengigheter

Modulene har følgende avhengighetsrekkefølge:

1. **Core** (fagkoder → standard-komponenter → institusjoner)
2. **Regelsett** (maler → konkrete) - krever Core
3. **Personer** (søkere → dokumentasjon) - kan kjøres parallelt med Regelsett

Hovedorchestreatoren `index.ts` håndterer rekkefølgen automatisk.

## 🔄 Migrering fra seed-all.ts

Den gamle `seed-all.ts` (1400+ linjer) er nå erstattet av denne modulære strukturen:

- **Bedre vedlikehold**: Hver modul har et klart ansvar
- **Raskere utvikling**: Test individuelle moduler
- **Mindre konflikt**: Teammedlemmer kan jobbe på ulike moduler
- **Klarere struktur**: Lettere å forstå og utvide

Den gamle filen kan fjernes når den nye strukturen er testet og godkjent.
