# Arbeidsmetoder

## Tech Stack

- 🎨 **Frontend**: Next.js med TypeScript og Tailwind CSS
- ⚙️ **Backend**: Next.js API Routes med TypeScript
- 🗄️ **Database**: Neo4j
- 🐳 **Deployment**: Docker Compose
- 📁 **Struktur**: Mono-repo (alt i samme repository)
- 🧪 **Testing**: Jest + React Testing Library
- 📝 **Kode kvalitet**: ESLint + Prettier + Husky

## Tekniske prinsipper

- **Enkelhet først**: Velg alltid den enkleste løsningen som fungerer
- **Anti-Yak Shaving**: Gå til roten av problemer, ikke symptomene
- **Ingen quick-fixes**: Implementer fundamentale løsninger som varer over tid
- **Forståelig arkitektur**: Alt skal være enkelt å forstå og jobbe videre på

## Språkbruk

- Hele appen skal være på norsk
- Tekniske begreper brukes på engelsk (f.eks. component, state, props, database, API, osv.)
- Brukergrensesnitt og meldinger til brukeren skal være på norsk
- Kodekommentarer og variabelnavn følger vanlig praksis (engelsk)

## Dokumentasjon

- Domenekunnskap dokumenteres i markdown-filer i mappen `/domenekunnskap`
- Oppretthold en oppdatert `entiteter.md` fil med alle hovedentiteter og relasjoner
- Bruk relevante emojis i markdown-filer for bedre lesbarhet
- Hold dokumentasjonen konsis og oppdatert når domeneforståelsen utvides

## Utviklingsmetodikk

- Jobber inkrementelt og fullstack
- Hver feature implementeres ferdig i hele stacken før vi går videre
- Ingen uferdige komponenter (f.eks. frontend uten backend)
- Feature er komplett når: frontend, backend, database og tester er på plass

## Arbeidsflyt

- Start alltid med å bygge solid domeneforståelse
- Dokumenter domenekunnskap grundig før implementering
- Oppdater eksisterende dokumentasjon når nye konsepter introduseres
- Slå sammen relaterte konsepter i samme fil for bedre oversikt
- Bruk konsistente begreper gjennom hele prosjektet
