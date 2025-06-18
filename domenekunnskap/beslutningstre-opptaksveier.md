# 🛣️ Beslutningstre og OpptaksVeier

## 🎯 Konsept

Et regelsett fungerer som et **beslutningstre** hvor hver gren representerer en **OpptaksVei** - en komplett vei fra grunnlag til kvote.

### Grunnleggende struktur

```
Regelsett (NTNU Bygg H25)
├── OpptaksVei 1: Førstegangsvitnemål-vei
│   ├── Grunnlag: Førstegangsvitnemål videregående
│   ├── Krav: GSK + Matte R1+R2 + Fysikk 1 + maks 21 år
│   ├── Kvote: Førstegangsvitnemål-kvote
│   └── Rangering: Karaktersnitt + realfagspoeng
├── OpptaksVei 2: Ordinært vitnemål-vei
│   ├── Grunnlag: Ordinært vitnemål videregående
│   ├── Krav: GSK + Matte R1+R2 + Fysikk 1
│   ├── Kvote: Ordinær kvote
│   └── Rangering: Karaktersnitt + realfagspoeng + alderspoeng
└── OpptaksVei 3: Fagbrev-vei
    ├── Grunnlag: Fagbrev
    ├── Krav: Relevant fagbrev + Matte R1
    ├── Kvote: Ordinær kvote
    └── Rangering: Fagbrev + realfagspoeng
```

## 🏗️ OpptaksVei struktur

### 1:1:1:1 forhold

Hver OpptaksVei har nøyaktig:

- **1 Grunnlag** (hva søker må ha)
- **N Krav** (hva som må oppfylles)
- **1 Kvote** (hvilken kvote man konkurrerer i)
- **1 Rangering** (hvordan man rangeres i kvoten)

### Navnekonvensjon

**ID-format:** `{grunnlag}-{regelsett-id}`
**Navn-format:** `{grunnlag} - {regelsett-navn}`

**Eksempler:**

```
ID: "forstegangsvitnemaal-ntnu-bygg-h25"
Navn: "Førstegangsvitnemål - NTNU Bygg H25"

ID: "fagbrev-ntnu-bygg-h25"
Navn: "Fagbrev - NTNU Bygg H25"

ID: "forstegangsvitnemaal-uio-laerer-h25"
Navn: "Førstegangsvitnemål - UiO Lærerutdanning H25"
```

## 🎲 Systemlogikk

### Kvalifiseringsprosess

1. **Input**: Søker med dokumentasjon (vitnemål, fagbrev, etc.)
2. **Prosess**: Test alle OpptaksVeier i regelsett
3. **Test per vei**:
   - Har søker riktig grunnlag?
   - Oppfyller søker alle krav?
   - Ja → Kvalifisert for denne veiens kvote med denne rangeringen
4. **Output**: Liste over kvalifiserte kvoter med rangering

### Samme kvote, flere veier

Hvis flere OpptaksVeier gir tilgang til samme kvote:

- Beregn score for hver vei
- Velg automatisk den veien som gir høyest score
- Søker konkurrerer med beste mulige score

**Eksempel:**

```
Søker kvalifiserer via:
- Fagbrev-vei → Ordinær kvote (45 poeng)
- Fagskole-vei → Ordinær kvote (52 poeng)

Resultat: Konkurrerer i Ordinær kvote med 52 poeng
```

## 🗄️ Database-struktur

### Node-typer

```cypher
// Hovedstruktur
(:Regelsett)-[:HAR_OPPTAKSVEI]->(:OpptaksVei)

// OpptaksVei koblinger
(:OpptaksVei)-[:BASERT_PÅ]->(:Grunnlag)
(:OpptaksVei)-[:KREVER]->(:Krav)
(:OpptaksVei)-[:GIR_TILGANG_TIL]->(:Kvote)
(:OpptaksVei)-[:BRUKER_RANGERING]->(:Rangering)
```

### OpptaksVei properties

```cypher
CREATE (vei:OpptaksVei {
  id: "forstegangsvitnemaal-ntnu-bygg-h25",
  navn: "Førstegangsvitnemål - NTNU Bygg H25",
  beskrivelse: "Vei for søkere med førstegangsvitnemål",
  aktiv: true,
  opprettet: datetime()
})
```

### Eksempel-struktur

```cypher
// Regelsett
CREATE (regelsett:Regelsett {
  id: "ntnu-bygg-h25",
  navn: "NTNU Bygg- og miljøteknikk H25"
})

// OpptaksVei 1
CREATE (vei1:OpptaksVei {
  id: "forstegangsvitnemaal-ntnu-bygg-h25",
  navn: "Førstegangsvitnemål - NTNU Bygg H25"
})

// Koblinger
CREATE (regelsett)-[:HAR_OPPTAKSVEI]->(vei1)
CREATE (vei1)-[:BASERT_PÅ]->(grunnlag_fgv:Grunnlag)
CREATE (vei1)-[:KREVER]->(krav_gsk:Krav)
CREATE (vei1)-[:KREVER]->(krav_matte:Krav)
CREATE (vei1)-[:KREVER]->(krav_fysikk:Krav)
CREATE (vei1)-[:KREVER]->(krav_alder:Krav)
CREATE (vei1)-[:GIR_TILGANG_TIL]->(kvote_fgv:Kvote)
CREATE (vei1)-[:BRUKER_RANGERING]->(rangering_fgv:Rangering)
```

## 🎨 UI-implikasjoner

### Tree-builder interface

Når admin bygger regelsett:

1. **Velg grunnlag** (nedtrekksmeny)
2. **Velg krav** (flervalg med checkboxes)
3. **Velg kvote** (nedtrekksmeny)
4. **Velg rangering** (nedtrekksmeny)
5. **Lagre som OpptaksVei**

### Visuell representasjon

```
📊 Regelsett: NTNU Bygg H25

├─ 🛣️ Førstegangsvitnemål-vei
│  ├─ 📋 Grunnlag: Førstegangsvitnemål videregående
│  ├─ ✅ Krav: GSK, Matte R1+R2, Fysikk 1, Alder ≤21
│  ├─ 🎯 Kvote: Førstegangsvitnemål-kvote
│  └─ 📊 Rangering: Karaktersnitt + realfagspoeng
│
├─ 🛣️ Ordinært vitnemål-vei
│  ├─ 📋 Grunnlag: Ordinært vitnemål videregående
│  ├─ ✅ Krav: GSK, Matte R1+R2, Fysikk 1
│  ├─ 🎯 Kvote: Ordinær kvote
│  └─ 📊 Rangering: Karaktersnitt + realfagspoeng + alderspoeng
│
└─ [+ Legg til OpptaksVei]
```

## 🔍 Query-eksempler

### Finn alle OpptaksVeier for et regelsett

```cypher
MATCH (r:Regelsett {id: "ntnu-bygg-h25"})-[:HAR_OPPTAKSVEI]->(vei:OpptaksVei)
RETURN vei
ORDER BY vei.navn
```

### Finn hvilke krav en OpptaksVei har

```cypher
MATCH (vei:OpptaksVei {id: "forstegangsvitnemaal-ntnu-bygg-h25"})-[:KREVER]->(krav:Krav)
RETURN krav
ORDER BY krav.navn
```

### Finn alle OpptaksVeier som bruker et spesifikt grunnlag

```cypher
MATCH (vei:OpptaksVei)-[:BASERT_PÅ]->(g:Grunnlag {type: "forstegangsvitnemaal-vgs"})
RETURN vei.navn, vei.id
ORDER BY vei.navn
```

### Finn alle OpptaksVeier som gir tilgang til samme kvote

```cypher
MATCH (vei:OpptaksVei)-[:GIR_TILGANG_TIL]->(k:Kvote {type: "ordinaer"})
RETURN vei.navn, vei.id
ORDER BY vei.navn
```

## 🎯 Fordeler med denne strukturen

1. **Klarhet**: Hver OpptaksVei er en komplett, isolert regel
2. **Gjenbruk**: Grunnlag, Krav, Kvoter og Rangeringer kan gjenbrukes
3. **Fleksibilitet**: Enkelt å legge til nye veier uten å påvirke eksisterende
4. **Sporing**: Kan lett se hvilken vei som ble brukt for en søker
5. **Testing**: Kan teste hver vei isolert
6. **UI**: Naturlig mapping til tree-builder interface
7. **Performance**: Effektive Neo4j queries via relasjoner
