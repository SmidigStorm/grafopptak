# 🏛️ Hovedentiteter i opptakssystemet

## 👤 Person

- Individ som kan søke på utdanning
- Har personopplysninger (navn, fødselsdato, kontaktinfo)
- Kan ha flere søknader
- Eier dokumentasjon som brukes i søknadsprosessen

## 📄 Dokumentasjon

- Papirer/attester som bekrefter kvalifikasjoner
- Tilhører en person
- Eksempler:
  - 📜 Vitnemål fra videregående
  - 🔧 Fagbrev
  - 📊 Karakterutskrifter
  - 🌍 Språktest-resultater
  - 🎖️ Militærattest
- Brukes for å avgjøre hvilke kvalifiseringsveier en person kan benytte

## 🏫 Institusjon

- Organisasjoner som tilbyr utdanning
- Eksempler: NTNU, UiO, HiOF, BI

## 📚 Utdanningsspesifikasjon

- Generell beskrivelse av en utdanning
- Kan gjenbrukes av flere institusjoner
- Eksempler:
  - 🩺 Bachelor i sykepleie
  - 💻 Master i informatikk
  - 💼 Bachelor i økonomi og administrasjon

## 🎓 Utdanningstilbud

- En spesifikk institusjon som tilbyr en utdanning på et gitt tidspunkt
- Kombinasjon av:
  - 🏫 Institusjon
  - 📚 Utdanningsspesifikasjon
  - 📅 Oppstartstidspunkt (semester/år)
- Eksempler:
  - NTNU tilbyr Bachelor i sykepleie høsten 2025
  - UiO tilbyr Master i informatikk våren 2026
  - BI tilbyr Bachelor i økonomi høsten 2025

## 🎯 Opptak

- Et opptak som søkere kan søke til
- Har definerte søknadsfrister, svarfrister og studieopptaksfrister
- Kan være aktivt eller inaktivt
- Typer:
  - 🇳🇴 **Samordnet opptak**: Koordinert nasjonal prosess for de fleste studieplasser
  - 🏛️ **Lokalt opptak**: Institusjonsspesifikt opptak for utvalgte programmer
  - 🎓 **Direkte opptak**: For spesielle programmer eller videreutdanning
- Attributter:
  - 📅 Semester og år (f.eks. Høst 2025)
  - 📆 Søknadsfrist, svarselskapsfrist, studieopptaksfrist
  - 🔢 Maks søknader per person
  - 📊 Status (Åpen, Stengt, Avsluttet, Fremtidig)
  - 🔄 Opptaksomgang (Hovedomgang, Tilleggsomgang, Løpende)
- Eksempler:
  - Samordnet opptak høst 2025
  - Lokalt opptak ved NTNU vår 2025
  - Masteropptak UiO høst 2025

## 📝 Søknad

- En persons søknad til et opptak
- Kan omfatte flere utdanningstilbud innenfor opptaket
- Utdanningstilbudene må prioriteres av søkeren (1️⃣ prioritet, 2️⃣ prioritet, osv.)
- Evalueres basert på personens dokumentasjon

## 📋 Regelsettmal

- Standardisert utgangspunkt for vanlige utdanningstyper
- Kan tilpasses av institusjoner med egne krav
- Sikrer konsistens og forenkler opprettelse av regelsett

## 📋 Venteliste

- Liste over søkere som kan få plass hvis andre takker nei
- Rangert etter samme kriterier som hovedopptaket
- Oppdateres dynamisk når plasser frigjøres

## 🔗 Relasjoner

- En **person** kan ha mange **søknader**
- En **person** eier sin **dokumentasjon**
- En **søknad** tilhører én **person** og gjelder ett **opptak**
- En **søknad** inneholder prioriterte **utdanningstilbud** (1. prioritet, 2. prioritet, osv.)
- Et **opptak** kan inneholde mange **utdanningstilbud**
- En **institusjon** kan ha mange **utdanningstilbud**
- En **utdanningsspesifikasjon** kan brukes av mange **institusjoner**
- Et **utdanningstilbud** har ett tilknyttet **regelsett**
- Et **regelsett** kan baseres på en **regelsettmal**
- Et **regelsett** definerer **kvalifiseringsveier** for det spesifikke tilbudet
- En **kvalifiseringsvei** kan gi tilgang til flere **kvoter**
- **Dokumentasjon** avgjør hvilke **kvalifiseringsveier** som kan brukes for en **person**
- Et **utdanningstilbud** kan ha en **venteliste** med rangerte søkere
