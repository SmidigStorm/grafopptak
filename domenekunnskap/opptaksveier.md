# 🛣️ OpptaksVeier og Beslutningstre

## 📌 Oversikt

OpptaksVei-strukturen er kjernen i GrafOpptaks regelsystem. Den representerer et beslutningstre hvor hver "vei" er en komplett regel for hvordan en søker kan kvalifisere for opptak til et utdanningstilbud.

## 🎯 Konseptet

### Hva er en OpptaksVei?

En OpptaksVei er én spesifikk måte en søker kan kvalifisere for opptak på. Den definerer:

1. **Grunnlag** - Hva søker må ha som utgangspunkt (f.eks. vitnemål, fagbrev)
2. **Krav** - Spesifikke krav som må oppfylles (f.eks. matematikk, språk)
3. **Kvote** - Hvilken konkurransegruppe søker havner i
4. **Rangering** - Hvordan søkere sorteres innenfor kvoten

### Hvorfor OpptaksVeier?

Tradisjonelle regelsystemer blir ofte komplekse med mange if-else betingelser. OpptaksVei-strukturen gir:

- **Klarhet**: Hver vei er en komplett, selvstendig regel
- **Fleksibilitet**: Nye veier kan legges til uten å påvirke eksisterende
- **Sporbarhet**: Lett å se hvilken vei en søker kvalifiserte gjennom
- **Gjenbruk**: Standard-komponenter kan brukes på tvers av veier

## 🌳 Struktur

### Regelsett → OpptaksVeier

Et **Regelsett** inneholder flere **OpptaksVeier**:

```
📜 Regelsett: "NTNU Ingeniørfag - Bygg og miljø H25"
├── 🛣️ OpptaksVei 1: "Førstegangsvitnemål"
├── 🛣️ OpptaksVei 2: "Ordinært vitnemål"
├── 🛣️ OpptaksVei 3: "Fagbrev"
├── 🛣️ OpptaksVei 4: "Y-veien"
└── 🛣️ OpptaksVei 5: "Forkurs"
```

### OpptaksVei → Komponenter

Hver **OpptaksVei** har fire hovedkomponenter:

```
🛣️ OpptaksVei: "Førstegangsvitnemål - NTNU Bygg"
├── 📋 BASERT_PÅ → Grunnlag: "Førstegangsvitnemål VGS"
├── ✅ KREVER → Kravelement: "GSK", "Matematikk R1+R2", "Fysikk 1"
├── 🎯 GIR_TILGANG_TIL → KvoteType: "Førstegangsvitnemål-kvote"
└── 📊 BRUKER_RANGERING → RangeringType: "Karaktersnitt + realfagspoeng"
```

## 📋 Komponenter i detalj

### 1. Grunnlag

**Hva**: Dokumentasjonen søker må ha som utgangspunkt.

**Typer**:

- `forstegangsvitnemaal-vgs` - Vitnemål fra VGS, maks 21 år
- `ordinaert-vitnemaal-vgs` - Vitnemål fra VGS, ingen aldersbegrensning
- `fagbrev` - Fagbrev/svennebrev
- `y-vei` - Y-vei kandidat
- `forkurs` - Fullført forkurs for ingeniør/maritim
- `utenlandsk` - Utenlandsk utdanning
- `realkompetanse` - Realkompetansevurdering

### 2. Kravelement

**Hva**: Spesifikke krav som må være oppfylt.

**Typer**:

- `gsk` - Generell studiekompetanse
- `matematikk-r1`, `matematikk-r2` - Matematikknivå
- `fysikk-1`, `kjemi-1` - Realfag
- `norsk`, `engelsk` - Språkkrav
- `alder` - Alderskrav (f.eks. maks 21 for førstegangsvitnemål)
- `relevant-fagbrev` - Fagbrev innen relevante områder

**Oppfyllelse**: Kravelementer kan oppfylles via:

- **Faggrupper** - F.eks. "Matematikk R1-nivå" (REA3022, S1+S2, etc.)
- **Spesifikke fagkoder** - F.eks. akkurat "REA3022"
- **Dokumentasjonstyper** - F.eks. politiattest

### 3. KvoteType

**Hva**: Konkurransegruppen søker plasseres i.

**Typer**:

- `forstegangsvitnemaal` - Egen kvote for førstegangssøkere
- `ordinaer` - Ordinær kvote
- `fagbrev` - Kvote for fagbrevkandidater
- `forkurs` - Kvote for forkurskandidater

**Fordeling**: Hver kvote har enten:

- Fast antall plasser (f.eks. 20 plasser)
- Prosentandel (f.eks. 50% av plassene)

### 4. RangeringType

**Hva**: Hvordan søkere rangeres innenfor kvoten.

**Typer**:

- `karaktersnitt` - Gjennomsnitt av karakterer
- `karaktersnitt-realfagspoeng` - Karaktersnitt + ekstra for realfag
- `fagbrev-poeng` - Poengberegning for fagbrev
- `forkurs-karakterer` - Kun karakterer fra forkurs
- `arbeidserfaring` - Poeng for relevant erfaring

**Formler**: Hver rangeringstype har en formel, f.eks.:

- Karaktersnitt: `sum(karakterer) / antall`
- Med realfagspoeng: `karaktersnitt + (0.5 * realfagspoeng)`

## 🔄 Evalueringsprosess

### Steg 1: Finn mulige OpptaksVeier

For hver søker:

1. Sjekk hvilket grunnlag søker har
2. Finn alle OpptaksVeier som matcher grunnlaget

### Steg 2: Sjekk krav

For hver mulig OpptaksVei:

1. Sjekk om alle kravelementer er oppfylt
2. Hvis ja → søker kvalifiserer via denne veien
3. Hvis nei → prøv neste vei

### Steg 3: Plasser i kvote

Når søker kvalifiserer:

1. Plasser søker i riktig kvote
2. Beregn rangeringspoeng
3. Sorter søkere i kvoten

## 💡 Eksempler

### Eksempel 1: Ingeniørutdanning

```
📜 Regelsett: "NTNU Bygg- og miljøteknikk"

🛣️ OpptaksVei 1: "Førstegangsvitnemål med realfag"
├── 📋 Grunnlag: Førstegangsvitnemål VGS
├── ✅ Krav:
│   ├── GSK
│   ├── Matematikk R1+R2
│   ├── Fysikk 1
│   └── Alder ≤ 21
├── 🎯 Kvote: Førstegangsvitnemål (50% av plassene)
└── 📊 Rangering: Karaktersnitt + realfagspoeng

🛣️ OpptaksVei 2: "Fagbrev elektriker"
├── 📋 Grunnlag: Fagbrev
├── ✅ Krav:
│   ├── Fagbrev som elektriker/automatiker
│   └── Matematikk R1 eller tilsvarende
├── 🎯 Kvote: Ordinær kvote
└── 📊 Rangering: Fagbrevpoeng + realfagspoeng

🛣️ OpptaksVei 3: "Forkurs"
├── 📋 Grunnlag: Forkurs ingeniør
├── ✅ Krav: Fullført forkurs med bestått
├── 🎯 Kvote: Forkurskvote (20 plasser)
└── 📊 Rangering: Kun forkurskarakterer
```

### Eksempel 2: Sykepleierutdanning

```
📜 Regelsett: "NTNU Bachelor i sykepleie"

🛣️ OpptaksVei 1: "Ordinært opptak"
├── 📋 Grunnlag: Vitnemål VGS (alle aldre)
├── ✅ Krav:
│   ├── GSK
│   ├── Matematikk (1P/S1/R1)
│   ├── Naturfag eller biologi
│   └── Norsk (393 timer)
├── 🎯 Kvote: Ordinær kvote
└── 📊 Rangering: Karaktersnitt + alderspoeng

🛣️ OpptaksVei 2: "Helsefagarbeider"
├── 📋 Grunnlag: Fagbrev
├── ✅ Krav:
│   ├── Fagbrev som helsefagarbeider
│   ├── Norsk VG3
│   └── Naturfag VG1
├── 🎯 Kvote: Ordinær kvote
└── 📊 Rangering: Fagbrevpoeng + tilleggspoeng
```

## 🔧 Implementering i Neo4j

### Opprett OpptaksVei

```cypher
// 1. Opprett OpptaksVei
CREATE (ov:OpptaksVei {
  id: 'forstegangsvitnemaal-ntnu-bygg-h25',
  navn: 'Førstegangsvitnemål - NTNU Bygg H25',
  beskrivelse: 'Opptak via førstegangsvitnemål med realfagskrav'
})

// 2. Koble til Regelsett
MATCH (r:Regelsett {id: 'ntnu-bygg-h25-regelsett'})
MATCH (ov:OpptaksVei {id: 'forstegangsvitnemaal-ntnu-bygg-h25'})
CREATE (r)-[:HAR_OPPTAKSVEI]->(ov)

// 3. Koble til komponenter
MATCH (ov:OpptaksVei {id: 'forstegangsvitnemaal-ntnu-bygg-h25'})
MATCH (g:Grunnlag {type: 'forstegangsvitnemaal-vgs'})
MATCH (k1:Kravelement {type: 'gsk'})
MATCH (k2:Kravelement {type: 'matematikk-r2'})
MATCH (kv:KvoteType {type: 'forstegangsvitnemaal'})
MATCH (rt:RangeringType {type: 'karaktersnitt-realfagspoeng'})

CREATE (ov)-[:BASERT_PÅ]->(g)
CREATE (ov)-[:KREVER]->(k1)
CREATE (ov)-[:KREVER]->(k2)
CREATE (ov)-[:GIR_TILGANG_TIL]->(kv)
CREATE (ov)-[:BRUKER_RANGERING]->(rt)
```

### Finn kvalifiserende OpptaksVeier for søker

```cypher
// Finn alle OpptaksVeier søker kan kvalifisere gjennom
MATCH (p:Person {id: $sokerId})-[:EIER]->(d:Dokumentasjon)
MATCH (u:Utdanningstilbud {id: $utdanningstilbudId})
      -[:HAR_REGELSETT]->(r:Regelsett)
      -[:HAR_OPPTAKSVEI]->(ov:OpptaksVei)
      -[:BASERT_PÅ]->(g:Grunnlag)

// Sjekk at søker har riktig grunnlag
WHERE (
  (g.type = 'forstegangsvitnemaal-vgs' AND d.type = 'vitnemaal' AND
   date().year - p.fodselsdato.year <= 21) OR
  (g.type = 'ordinaert-vitnemaal-vgs' AND d.type = 'vitnemaal') OR
  (g.type = 'fagbrev' AND d.type = 'fagbrev')
)

// Sjekk at alle krav er oppfylt
WITH ov, COUNT {
  MATCH (ov)-[:KREVER]->(krav:Kravelement)
  WHERE NOT EXISTS {
    // Kompleks kravsjekk her
  }
} as manglendeKrav

WHERE manglendeKrav = 0
RETURN ov
```

## 📈 Fordeler med OpptaksVei-strukturen

### 1. **Transparens**

- Søkere kan se eksakt hvilke veier som finnes
- Tydelig hva som kreves for hver vei
- Ingen skjulte regler

### 2. **Fleksibilitet**

- Nye veier kan legges til uten å endre eksisterende
- Institusjoner kan tilpasse veier til sine behov
- Støtter både generelle og spesifikke krav

### 3. **Vedlikehold**

- Endringer i én vei påvirker ikke andre
- Standard-komponenter kan oppdateres sentralt
- Versjonering mulig på vei-nivå

### 4. **Ytelse**

- Grafdatabase optimalisert for denne type traversering
- Kan raskt finne alle mulige veier for en søker
- Parallell evaluering av flere veier

## 🚀 Fremtidige muligheter

### Veiledning

- Vis søkere hvilke veier de kvalifiserer for
- Anbefal hvilke fag som mangler for andre veier
- Simuler effekt av karakterforbedring

### Analyse

- Se hvilke veier som er mest brukt
- Identifiser flaskehalser i krav
- Optimaliser kvotefordeling

### Automatisering

- Automatisk tildeling basert på OpptaksVei
- Rangering i sanntid
- Varsling ved kvalifisering
