# 📐 Forretningsregler - GrafOpptak

## 🎯 Oversikt

Dette dokumentet beskriver forretningsreglene som styrer opptaksprosessen i GrafOpptak. Reglene er implementert gjennom OpptaksVei-strukturen og håndheves av systemet.

## 📋 Grunnlagsregler

### Førstegangsvitnemål

- **Krav**: Vitnemål fra videregående skole
- **Aldersgrense**: Maksimalt 21 år (i søknadsåret)
- **Beregning**: `søknadsår - fødselsår ≤ 21`
- **Spesielt**: Egen kvote med ofte bedre konkurransevilkår

### Ordinært vitnemål

- **Krav**: Vitnemål fra videregående skole
- **Aldersgrense**: Ingen
- **Tilleggspoeng**: Kan få alderspoeng, arbeidslivspoeng, etc.

### Fagbrev

- **Krav**: Fullført og bestått fag-/svenneprøve
- **Tilleggskrav**: Ofte krav om spesifikke fellesfag
- **Relevans**: Noen utdanninger krever relevant fagbrev

### Y-veien

- **Krav**: Fagbrev + 1 års relevant praksis
- **Formål**: Overgang til høyere yrkesfaglig utdanning
- **Begrensning**: Kun for spesifikke utdanningstilbud

### Forkurs

- **Typer**: Forkurs for ingeniør eller maritim høyskoleutdanning
- **Varighet**: 1 år
- **Garanti**: Ofte garantert opptak ved bestått

## ✅ Kravregler

### Generell studiekompetanse (GSK)

**Definisjon**: Grunnleggende krav for opptak til høyere utdanning

**Oppnås ved**:

1. Fullført og bestått 3-årig videregående opplæring
2. Godkjent utenlandsk utdanning
3. Realkompetansevurdering (min. 25 år)

**Fellesfag som kreves**:

- Norsk: 393 timer (14 uketimer)
- Engelsk: 140 timer (5 uketimer)
- Matematikk: 224 timer (8 uketimer)
- Naturfag: 140 timer (5 uketimer)
- Samfunnsfag: 170 timer (6 uketimer)
- Historie: 140 timer (5 uketimer)

### Spesielle opptakskrav

#### Matematikkkrav

**Nivåer** (fra lavest til høyest):

1. **Praktisk matematikk (1P)**: Grunnleggende, praktisk rettet
2. **Samfunnsfaglig matematikk (S1, S2)**: For samfunnsfag/økonomi
3. **Realfagsmatematikk (R1, R2)**: For ingeniør/realfag

**Ekvivalenser**:

- S1 + S2 = R1 (for de fleste formål)
- R1 > S2 > S1 > 1P

#### Realfagskrav

**Vanlige krav**:

- Fysikk 1: Ofte for ingeniørutdanninger
- Kjemi 1/2: For kjemi, medisin, farmasi
- Biologi 1/2: For helsefag, biologi

**Kombinasjoner**:

- Naturfag (5 timer) kan erstatte Fysikk 1 + Kjemi 1 for noen utdanninger

#### Språkkrav

**Norsk**:

- Minimum 393 timer for GSK
- Høyere krav for enkelte utdanninger (f.eks. lærer)
- Alternativ: Bestått test i norsk for utenlandske søkere

**Engelsk**:

- Minimum 140 timer for GSK
- Noen internasjonale program krever høyere nivå

### Faggrupperegler

Faggrupper samler fagkoder som gir samme kompetanse:

#### Matematikk R1-nivå

**Oppfylles av**:

- REA3022 (Matematikk R1)
- 3MX + 4MX (gammel ordning)
- S1 + S2 (i kombinasjon)

#### Matematikk R2-nivå

**Oppfylles av**:

- REA3024 (Matematikk R2)
- 3MZ (gammel ordning)
- R1 er forutsetning

#### Fysikk 1-nivå

**Oppfylles av**:

- REA3004 (Fysikk 1)
- 2FY (gammel ordning)
- Naturfag 5t (for noen utdanninger)

## 📊 Rangeringsregler

### Karakterpoeng

#### Grunnberegning

```
Karaktersnitt = Sum av (karakter × fagvekt) / Sum av fagvekter
```

**Karakterskala**: 1-6 (6 er best)

#### Vekting

- Alle fag teller i utgangspunktet likt
- Noen utdanninger kan ha spesialvekting

### Tilleggspoeng

#### Realfagspoeng

**Maksimalt**: 4 poeng

**Beregning**:

- Matematikk R1: 0,5 poeng
- Matematikk R2: 1 poeng (totalt 1,5 med R1)
- Fysikk 1: 1 poeng
- Fysikk 2: 0,5 poeng
- Kjemi 1: 0,5 poeng
- Kjemi 2: 1 poeng
- Biologi 2, Informasjonsteknologi 2, Geofag 2, Teknologi og forskningslære 2: 0,5 poeng hver

#### Alderspoeng

**For ordinær kvote**:

- 2 poeng per år over 20 år
- Maksimalt 8 poeng (ved 24 år)

**Beregning**: `min(8, max(0, (alder - 19) × 2))`

#### Kjønnspoeng

- 1-2 poeng til underrepresentert kjønn
- Gjelder kun utdanninger med skjev kjønnsbalanse
- Definert per utdanningstilbud

#### Språkpoeng

- Fordypning i fremmedspråk: 0,5-1 poeng
- Gjelder språk utover norsk/engelsk

### Fagbrevpoeng

#### Grunnpoeng

- Bestått fagbrev: 6 poeng (tilsvarer karaktersnitt)
- Meget godt bestått: 6,5 poeng

#### Tilleggsutdanning

- Generell studiekompetanse på fagbrev: +1 poeng
- Teknisk fagskole: +1 poeng

#### Relevant praksis

- 1 poeng per år relevant praksis
- Maksimalt 3 poeng

## 🎯 Kvoteregler

### Kvotefordeling

#### Førstegangsvitnemål-kvote

- **Andel**: Ofte 50% av plassene
- **Krav**: Førstegangsvitnemål (maks 21 år)
- **Fordel**: Konkurrerer kun mot andre førstegangssøkere

#### Ordinær kvote

- **Andel**: Resterende plasser
- **Åpen for**: Alle kvalifiserte søkere
- **Rangering**: Inkluderer alderspoeng og tilleggspoeng

#### Spesialkvoter

- **Forkurs**: Fast antall eller prosent
- **Nord-Norge-kvote**: For søkere fra nordlige fylker
- **Internasjonal kvote**: For utenlandske søkere

### Kvoterekkefølge

1. Spesialkvoter fylles først
2. Førstegangsvitnemål-kvote
3. Ordinær kvote får resterende

## 🔄 Prosessregler

### Søknadsprosess

#### Prioritering

- Søker kan ha inntil 10 ønsker (samordnet opptak)
- Prioritert rekkefølge er bindende
- Får kun tilbud om høyest prioriterte kvalifiserte

#### Frister

- **Søknadsfrist**: 15. april (samordnet opptak)
- **Ettersending**: 1. juli (dokumentasjon)
- **Svarfrist**: 20. juli (aksept/avslag)

### Dokumentasjonskrav

#### Vitnemål

- Må være endelig (ikke foreløpig)
- Stemplet/signert av skole
- Karakterer for alle fag

#### Fagbrev

- Fag-/svennebrev
- Dokumentasjon på fellesfag

#### Utenlandsk utdanning

- Godkjenning fra NOKUT
- Oversatt til norsk/engelsk

### Forbedring av konkurransegrunnlag

#### Karakterforbedring

- Nye karakterer erstatter gamle
- Gjelder kun forbedring (ikke forverring)
- Må dokumenteres innen fristen

#### Tilleggspoeng

- Alderspoeng beregnes automatisk
- Realfagspoeng ved nye realfag
- Må tas som privatist eller ved skole

## 🚫 Unntak og spesialregler

### 23/5-regelen

- 23 år og 5 års arbeidserfaring/utdanning
- Kan få opptak uten GSK til enkelte studier
- Krever fortsatt spesielle opptakskrav

### Realkompetanse

- Minimum 25 år
- Vurdering av samlet kompetanse
- Kan erstatte formelle krav

### Y-veien spesialregler

- Kun for spesifikke fagbrev
- Direkte opptak til år 2 på noen studier
- Egne kvoter og rangering

## 📈 Beregningseksempler

### Eksempel 1: Førstegangsvitnemål

```
Karakterer:
- Norsk: 4
- Matematikk R2: 5
- Fysikk 1: 5
- Andre fag: Snitt 4,2

Beregning:
- Karaktersnitt: 4,3
- Realfagspoeng: 2,5 (R1+R2+Fysikk)
- Totalt: 4,3 + (2,5 × 0,4) = 5,3 konkurransepoeng
```

### Eksempel 2: Ordinær kvote

```
Alder: 24 år
Karaktersnitt: 3,8

Beregning:
- Karakterpoeng: 3,8
- Alderspoeng: 8 (maks)
- Totalt: 3,8 + (8 × 0,1) = 4,6 konkurransepoeng
```

### Eksempel 3: Fagbrev

```
Fagbrev: Meget godt bestått
Praksis: 2 år relevant

Beregning:
- Fagbrevpoeng: 6,5
- Praksispoeng: 2
- Totalt: 6,5 + 2 = 8,5 konkurransepoeng
```

## 🔒 Validering og kontroll

### Automatiske kontroller

- Aldersberegning for førstegangsvitnemål
- Fagkodegodkjenning mot register
- Karaktervalidering (1-6 skala)

### Manuelle kontroller

- Utenlandsk dokumentasjon
- Realkompetansevurdering
- Spesielle forhold

### Klageadgang

- 3 ukers klagefrist
- Kun på saksbehandlingsfeil
- Ikke på skjønnsmessige vurderinger
