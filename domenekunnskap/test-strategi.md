# 🧪 Test-strategi - GrafOpptak

## 🎯 Målsetting

Pragmatisk test-strategi som gir nok sikkerhet til å feilsøke effektivt, uten å være overveldende. Fokus på **kritiske flyter** og **områder hvor feil har stor konsekvens**.

## 📊 Eksisterende test-setup

### ✅ Allerede på plass

- **Database-lag**: Neo4j connection og operasjoner
- **API-lag**: Fagkoder, faggrupper og relasjoner
- **Test-infrastruktur**: Vitest, Testing Library, database reset/seeding

### 🔧 Test-verktøy

- **Framework**: Vitest (moderne Jest-alternativ)
- **React**: @testing-library/react
- **Database**: Egen test-database med full reset
- **Scripts**: `npm test`, `npm run test:watch`, `npm run test:coverage`

## 🎯 Test-prioritering

### 🔴 Høy prioritet (Kritiske flyter)

#### 1. Domenekjerne - OpptaksVei evaluering

```typescript
// Tests for: Kan en søker kvalifisere via en OpptaksVei?
describe('OpptaksVei Evaluering', () => {
  it('kvalifiserer søker med førstegangsvitnemål og riktige fag');
  it('avviser søker som mangler matematikk R2');
  it('håndterer aldersgrense for førstegangsvitnemål');
});
```

#### 2. Karakterhåndtering

```typescript
// Tests for: Karakterberegning og historikk
describe('Karakter System', () => {
  it('velger beste karakter ved forbedring');
  it('håndterer ulike karaktersystemer (1-6, bestått/ikke bestått)');
  it('beregner karaktersnitt korrekt');
});
```

#### 3. API-endpoints (utvidelse av eksisterende)

```typescript
// Mangler: Regelsett, OpptaksVei, evaluering
describe('Regelsett API', () => {
  it('henter regelsett med alle OpptaksVeier');
  it('oppretter ny OpptaksVei med komponenter');
});
```

### 🟡 Medium prioritet (Viktig funksjonalitet)

#### 4. Frontend komponenter

```typescript
// Tests for: Kritiske UI-komponenter
describe('Dashboard', () => {
  it('viser korrekt statistikk');
  it('navigerer til riktige sider');
});

describe('Institusjonskart', () => {
  it('rendrer alle institusjoner');
  it('åpner popup ved klikk');
});
```

#### 5. Database queries

```typescript
// Tests for: Komplekse Cypher queries
describe('Complex Queries', () => {
  it('finner alle utdanningstilbud med mattekrav');
  it('henter komplett søkerhistorikk');
});
```

### 🟢 Lav prioritet (Nice to have)

#### 6. Integration tests

- Fullstendig søknadsprosess (når implementert)
- Frontend-backend integration

#### 7. E2E tests

- Kritiske brukerflyter
- Kun for hovedfunksjonalitet

## 📋 Konkret test-plan

### Fase 1: Domenekjerne (1-2 dager)

```bash
# Opprett tester for:
__tests__/domain/
├── opptaksvei-evaluering.test.ts    # Kvalifiseringslogikk
├── karakter-beregning.test.ts       # Karaktersnitt og poeng
└── faggruppe-matching.test.ts       # Fagkode til faggruppe matching
```

### Fase 2: API-utvidelse (1 dag)

```bash
# Utvidet API-testing:
__tests__/api/
├── regelsett.test.ts               # Regelsett CRUD
├── opptaksveier.test.ts            # OpptaksVei CRUD
└── evaluering.test.ts              # Kvalifiserings-API
```

### Fase 3: Frontend-komponenter (1-2 dager)

```bash
# Kritiske UI-komponenter:
__tests__/components/
├── dashboard.test.tsx              # Dashboard statistikk
├── institusjonskart.test.tsx       # Kart-komponent
└── regelsett-visning.test.tsx      # Regelsett display
```

## 🎯 Test-retningslinjer

### Hva å teste

✅ **Test dette**:

- Forretningslogikk (OpptaksVei-evaluering)
- Data-transformasjoner (karakterberegning)
- API-endpoints (critical paths)
- Komponenter med kompleks logikk

❌ **Ikke test dette**:

- Enkle UI-komponenter (bare styling)
- Tredjepartsbiblioteker (Shadcn/ui)
- Konfiguration og setup
- Enkle CRUD uten logikk

### Test-struktur

```typescript
describe('Feature/Component navn', () => {
  // Setup
  beforeEach(() => {
    // Reset state, mock data
  });

  describe('happy path', () => {
    it('should do the main thing correctly');
  });

  describe('edge cases', () => {
    it('should handle missing data gracefully');
    it('should validate input correctly');
  });

  describe('error cases', () => {
    it('should return proper error messages');
  });
});
```

### Mock-strategi

```typescript
// Database: Bruk ekte test-database (allerede setup)
// API calls: Mock med MSW eller jest.fn()
// External services: Mock alltid
// UI interactions: Bruk @testing-library/user-event
```

## 🚀 Implementering

### 1. Start med domenekjerne

Implementer OpptaksVei-evaluering først - dette er kjernen i systemet.

### 2. Utvid eksisterende API-tester

Legg til tester for regelsett og evaluering.

### 3. Legg til kritiske UI-tester

Fokuser på komponenter med forretningslogikk.

### 4. Kjør tester regelmessig

```bash
# Under utvikling
npm run test:watch

# Før commit
npm run test:coverage

# Deploy
npm test
```

## 📈 Test-metrics

### Mål for test-coverage

- **Domenekjerne**: 90%+ (kritisk logikk)
- **API-lag**: 80%+ (allerede høy coverage)
- **UI-komponenter**: 60%+ (fokus på logikk)
- **Totalt**: 70%+ (pragmatisk balanse)

### Suksess-kriterier

✅ Kan feilsøke raskt når noe bryter
✅ Trygg refaktorering av domenekjerne  
✅ API-endringer fanges opp
✅ Kritiske UI-flyter virker

## 🔧 Verktøy for feilsøking

### Test-debugging

```bash
# Kjør kun én test
npm test -- --run specific.test.ts

# Debug-modus
npm test -- --inspect-brk

# Coverage report
npm run test:coverage
```

### Database-debugging

```typescript
// I tester: Logg queries for feilsøking
afterEach(async () => {
  if (testFailed) {
    console.log('Database state:', await driver.session().run('MATCH (n) RETURN n'));
  }
});
```

## 📝 Eksempel-tester

### Domenekjerne-test

```typescript
describe('OpptaksVei Evaluering', () => {
  it('kvalifiserer søker med førstegangsvitnemål', async () => {
    // Arrange
    const sokerId = await createTestSoker({
      fodselsdato: '2003-01-01', // 21 år
      dokumentasjon: [
        {
          type: 'vitnemaal',
          fagkoder: [
            { kode: 'REA3022', karakter: '5' }, // Matte R1
            { kode: 'REA3024', karakter: '4' }, // Matte R2
          ],
        },
      ],
    });

    // Act
    const result = await evaluerOpptaksVei(sokerId, 'forstegangsvitnemaal-ntnu-bygg');

    // Assert
    expect(result.kvalifisert).toBe(true);
    expect(result.konkurransepoeng).toBeGreaterThan(4.0);
  });
});
```

### API-test

```typescript
describe('POST /api/regelsett', () => {
  it('oppretter regelsett med OpptaksVeier', async () => {
    const regelsett = {
      navn: 'Test regelsett',
      opptaksveier: [
        {
          navn: 'Test vei',
          grunnlagId: 'forstegangsvitnemaal-vgs',
          kravIds: ['gsk', 'matematikk-r2'],
        },
      ],
    };

    const response = await POST(createRequest('/api/regelsett', 'POST', regelsett));

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.opptaksveier).toHaveLength(1);
  });
});
```

## 🎉 Konklusjon

Med denne strategien får du:

- **Rask feilsøking** gjennom fokuserte tester
- **Trygg utvikling** av kritisk domenekjerne
- **Balanse** mellom sikkerhet og effektivitet
- **Byggbar fundament** for fremtidig testing

Start med domenekjerne-testene - det gir mest verdi for innsatsen!
