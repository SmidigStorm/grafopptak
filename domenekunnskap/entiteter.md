# 📊 Entiteter og Relasjoner - GrafOpptak

## 🎯 Hovedentiteter

### 1. Kjerneentiteter for opptak

#### 🏫 **Institusjon**

Universiteter, høgskoler og andre utdanningsinstitusjoner.

**Attributter:**

- `id`: Unik identifikator (f.eks. "ntnu", "uio")
- `navn`: Fullt navn
- `kortNavn`: Kort navn/akronym
- `type`: Type institusjon ("universitet", "høgskole", etc.)
- `institusjonsnummer`: Offisielt nummer fra DBH
- `lokasjon`: Geografisk plassering (lat, lng)

**Status:** ✅ Fullt implementert med API og seeding

#### 🎓 **Utdanningstilbud**

Studieprogram tilbudt av institusjoner.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på tilbudet
- `studienivaa`: Nivå ("bachelor", "master", etc.)
- `studiepoeng`: Antall studiepoeng
- `varighet`: Varighet i semestre
- `semester`: Oppstartsemester ("host"/"var")
- `aar`: Oppstartsår
- `maxAntallStudenter`: Maks antall studieplasser

**Status:** ✅ Fullt implementert med API og seeding

#### 👤 **Person**

Søkere i systemet.

**Attributter:**

- `id`: Unik identifikator
- `fornavn`, `etternavn`: Navn
- `fodselsdato`: Fødselsdato
- `epost`: E-postadresse
- `telefon`: Telefonnummer

**Status:** ✅ Implementert med API og seeding

#### 📄 **Dokumentasjon**

Vitnemål, fagbrev, attester og andre dokumenter.

**Attributter:**

- `id`: Unik identifikator
- `type`: Type dokument ("vitnemaal", "fagbrev", "karakterutskrift", etc.)
- `navn`: Beskrivende navn
- `utstedt`: Utstedelsesdato
- `utsteder`: Utstedende institusjon

**Status:** ✅ Implementert med karakterrelasjoner

#### 📝 **Søknad**

Søknader fra personer til opptak.

**Attributter:**

- `id`: Unik identifikator
- `status`: Status ("utkast", "sendt", "behandlet", etc.)
- `opprettet`: Opprettelsesdato
- `sendtInn`: Innsendingsdato

**Status:** ⚠️ Delvis implementert - mangler full API og seeding

#### 🎯 **Opptak**

Opptaksrunder (f.eks. Samordnet opptak H25).

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på opptaket
- `type`: Type opptak ("samordnet", "lokalt", etc.)
- `aar`: År
- `soknadsfrist`: Søknadsfrist
- `status`: Status ("fremtidig", "apent", "stengt", etc.)

**Status:** ❌ Ikke implementert - kun definert i datamodell

### 2. Regelsett-struktur (Beslutningstre)

#### 📜 **Regelsett**

Overordnet regelverk for et utdanningstilbud.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på regelsettet
- `versjon`: Versjon
- `gyldigFra`: Fra-dato
- `beskrivelse`: Beskrivelse

**Status:** ✅ Fullt implementert med OpptaksVei-struktur

#### 🛣️ **OpptaksVei**

En komplett vei gjennom beslutningstreet - fra grunnlag til rangering.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på opptaksveien
- `beskrivelse`: Beskrivelse

**Status:** ✅ Fullt implementert

#### 📋 **Grunnlag**

Hva søker må ha som utgangspunkt (vitnemål, fagbrev, etc.).

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på grunnlaget
- `type`: Type grunnlag ("forstegangsvitnemaal-vgs", "fagbrev", etc.)

**Status:** ✅ Implementert som standard-komponent

#### ✅ **Kravelement**

Spesifikke krav som må oppfylles.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på kravet
- `type`: Type krav ("gsk", "matematikk-r1", etc.)

**Status:** ✅ Implementert med fleksibel oppfyllelse

#### 🎯 **KvoteType**

Hvilken kvote søker konkurrerer i.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på kvotetypen
- `type`: Type kvote ("ordinaer", "forstegangsvitnemaal", etc.)

**Status:** ✅ Implementert som standard-komponent

#### 📊 **RangeringType**

Hvordan søkere rangeres.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på rangeringstypen
- `type`: Type rangering ("karaktersnitt", "fagbrev", etc.)
- `formelMal`: Mal for rangeringsformelen

**Status:** ✅ Implementert som standard-komponent

### 3. Fagkompetanse

#### 📚 **Fagkode**

Spesifikke fag (REA3022, NOR1211, etc.).

**Attributter:**

- `kode`: Fagkoden (unik)
- `navn`: Navn på faget
- `beskrivelse`: Beskrivelse
- `gyldigFra`, `gyldigTil`: Gyldighetsperiode

**Status:** ✅ Fullt implementert med seeding

#### 🎯 **Faggruppe**

Gruppering av relaterte fagkoder.

**Attributter:**

- `id`: Unik identifikator
- `navn`: Navn på faggruppen
- `type`: Type faggruppe ("matematikk", "norsk", etc.)

**Status:** ✅ Implementert med kvalifiseringsrelasjoner

## 🔗 Hovedrelasjoner

### Implementerte relasjoner

1. **Institusjon** `TILBYR` **Utdanningstilbud** ✅
2. **Person** `EIER` **Dokumentasjon** ✅
3. **Dokumentasjon** `INNEHOLDER` **Fagkode** (med karakter) ✅
4. **Fagkode** `KVALIFISERER_FOR` **Faggruppe** ✅
5. **Utdanningstilbud** `HAR_REGELSETT` **Regelsett** ✅
6. **Regelsett** `HAR_OPPTAKSVEI` **OpptaksVei** ✅
7. **OpptaksVei** `BASERT_PÅ` **Grunnlag** ✅
8. **OpptaksVei** `KREVER` **Kravelement** ✅
9. **OpptaksVei** `GIR_TILGANG_TIL` **KvoteType** ✅
10. **OpptaksVei** `BRUKER_RANGERING` **RangeringType** ✅
11. **Kravelement** `OPPFYLLES_AV` **Faggruppe**/**Fagkode**/**Dokumentasjon** ✅

### Ikke-implementerte relasjoner

1. **Person** `SØKER_MED` **Søknad** ❌
2. **Søknad** `GJELDER` **Opptak** ❌
3. **Søknad** `PRIORITERER` **Utdanningstilbud** ❌
4. **Utdanningstilbud** `TILBYS_I` **Opptak** ❌

## 📊 Implementeringsstatus

### ✅ Fullt implementert

- Institusjoner med kart og navigasjon
- Utdanningstilbud med regelsett
- Personer og dokumentasjon
- Fagkoder og faggrupper
- OpptaksVei-struktur (beslutningstre)
- Karakterhåndtering med historikk

### ⚠️ Delvis implementert

- Søknader (entitet finnes, mangler full funksjonalitet)

### ❌ Ikke implementert

- Opptak-entitet
- Søknadsprosess ende-til-ende
- Kobling mellom utdanningstilbud og opptak

## 🎯 Nøkkelfunksjonalitet

### Beslutningstre med OpptaksVeier

Systemet bruker en elegant tre-struktur hvor hver OpptaksVei representerer én komplett vei fra grunnlag til rangering:

```
Regelsett
└── OpptaksVei 1: "Førstegangsvitnemål"
    ├── Grunnlag: Førstegangsvitnemål
    ├── Krav: GSK + Matematikk R1
    ├── Kvote: Førstegangsvitnemål-kvote
    └── Rangering: Karaktersnitt
└── OpptaksVei 2: "Fagbrev"
    ├── Grunnlag: Fagbrev
    ├── Krav: Relevant fagbrev
    ├── Kvote: Ordinær kvote
    └── Rangering: Fagbrevpoeng
```

### Karakterhåndtering

- Støtter både tallkarakterer (1-6) og bestått/ikke bestått
- Full historikk med forbedringsforsøk
- Automatisk valg av beste karakter

### Fleksibel kravoppfyllelse

Kravelementer kan oppfylles på tre måter:

1. Via faggruppe (f.eks. "Matematikk R1-nivå")
2. Via spesifikk fagkode
3. Via dokumentasjonstype (f.eks. politiattest)

## 🧠 LogicalNode Pattern - Boolean Logikk for Opptak

### 📋 **LogicalNode**

LogicalNode implementerer boolean logikk (AND/OR/NOT) for komplekse opptakskrav, basert på Neo4j beste praksiser for regel-motorer.

**Attributter:**
- `id`: Unik identifikator
- `navn`: Beskrivende navn for regelen
- `type`: Logisk operasjon ("AND", "OR", "NOT")
- `beskrivelse`: Forklaring av regelens formål
- `aktiv`: Om regelen er aktiv

**Status:** ✅ Fullt implementert med API og seeding

### 🔗 LogicalNode Relasjoner

**Implementerte relasjoner:**
1. **OpptaksVei** `HAR_REGEL` **LogicalNode** ✅
2. **LogicalNode** `EVALUERER` **Kravelement** ✅
3. **LogicalNode** `EVALUERER` **LogicalNode** (hierarkisk) ✅

**Relasjonsmønster:**
```
OpptaksVei -[:HAR_REGEL]-> LogicalNode -[:EVALUERER]-> Kravelement
                        └-[:EVALUERER]-> LogicalNode (barn-node)
```

### 📊 Konkrete Eksempler

**UiO Informatikk:**
```
UiO Informatikk Grunnkrav (AND)
├── EVALUERER → Generell studiekompetanse
└── EVALUERER → Matematikk R1 eller R2 (OR)
    ├── EVALUERER → Matematikk R1
    └── EVALUERER → Matematikk R2
```
**Regeluttrykk:** "Generell studiekompetanse OG (Matematikk R2 ELLER Matematikk R1)"

**NTNU Bygg:**
```
NTNU Bygg Grunnkrav (AND)
├── EVALUERER → Generell studiekompetanse
├── EVALUERER → Fysikk 1
└── EVALUERER → Matematikk R1+R2 (AND)
    ├── EVALUERER → Matematikk R1
    └── EVALUERER → Matematikk R2
```
**Regeluttrykk:** "Generell studiekompetanse OG Fysikk 1 OG (Matematikk R2 OG Matematikk R1)"

### 🚀 API Støtte

**Krav-visning API:**
- `GET /api/opptaksveier/{id}/krav`
- Returnerer both hierarkisk struktur og menneskelesbart regeluttrykk
- Rekursiv traversering av LogicalNode-treet
- Automatisk språkkonvertering: AND→OG, OR→ELLER, NOT→IKKE

### 💡 Fordeler med LogicalNode Pattern

1. **Fleksibilitet**: Støtter vilkårlig komplekse boolean uttrykk
2. **Maintainability**: Enkel å endre og utvide regler
3. **Performance**: Effektiv traversering i grafdatabase
4. **Readability**: Klar separasjon mellom logikk og data
5. **Reusability**: LogicalNodes kan gjenbrukes på tvers av opptaksveier
6. **Neo4j Best Practice**: Følger anbefalte mønstre for regel-motorer

### 🔄 Migrering fra [:KREVER] til [:HAR_REGEL]

Det gamle mønsteret med direkte `OpptaksVei -[:KREVER]-> Kravelement` er erstattet med:
```
OpptaksVei -[:HAR_REGEL]-> LogicalNode -[:EVALUERER]-> Kravelement
```

Dette gir betydelig mer fleksibilitet for komplekse opptakskrav med boolean logikk.
