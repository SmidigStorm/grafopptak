# Arbeidsmetoder

## Tech Stack

- 🎨 **Frontend**: Next.js 15 med TypeScript og Tailwind CSS
- ⚙️ **Backend**: Next.js API Routes med TypeScript
- 🗄️ **Database**: Neo4j (med Cypher queries)
- 🐳 **Deployment**: Docker Compose
- 📁 **Struktur**: Mono-repo (alt i samme repository)
- 🧪 **Testing**: Jest + React Testing Library
- 📝 **Kode kvalitet**: ESLint + Prettier + Husky
- 🎨 **UI Components**: Shadcn/ui (New York style, Neutral colors)
- 📊 **Admin**: Dashboard med sidebar navigasjon

## Tekniske prinsipper

- **Enkelhet først**: Velg alltid den enkleste løsningen som fungerer
- **Anti-Yak Shaving**: Gå til roten av problemer, ikke symptomene
- **Ingen quick-fixes**: Implementer fundamentale løsninger som varer over tid
- **Forståelig arkitektur**: Alt skal være enkelt å forstå og jobbe videre på
- **FØLG CLAUDE.MD**: Ikke lag nye strukturer - bruk det som allerede er definert her
- **Test før commit**: Alltid kjør `npm run db:reset` eller tilsvarende før commit

## Språkbruk

- Hele appen skal være på norsk
- Tekniske begreper brukes på engelsk (f.eks. component, state, props, database, API, osv.)
- Brukergrensesnitt og meldinger til brukeren skal være på norsk
- Kodekommentarer og variabelnavn følger vanlig praksis (engelsk)

## Dokumentasjon

- Domenekunnskap dokumenteres i markdown-filer i mappen `/domenekunnskap`
- **Hoveddokumenter**:
  - `entiteter.md` - Alle entiteter, relasjoner og implementeringsstatus
  - `opptaksveier.md` - Beslutningstre-struktur og OpptaksVei-konseptet
  - `forretningsregler.md` - Domenelogikk og opptaksregler
  - `dataflyt.md` - Hvordan data flyter gjennom systemet
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

## Git og Commit-praksis

- **Test alltid før commit**: Kjør `npm run db:reset` eller relevant test
- **Commit ofte**: Etter hver større endring, ikke i store batches
- **Beskrivende meldinger**: Forklar hva og hvorfor, ikke bare hva
- **Push etter commit**: Hold remote oppdatert
- **Ikke lag nye strukturer**: Følg eksisterende patterns i CLAUDE.md

## Database

- **Struktur**: Neo4j grafdatabase med noder og relasjoner
- **Scripts**: Database admin-verktøy i `/scripts/db-admin.ts`
- **Seeding**:
  - **VIKTIG**: ALL SEEDING SKJER I `/scripts/seed-all.ts` (monolitisk struktur)
  - **ALDRI lag modulære seed-filer** - det skaper bare duplikater og konflikter
  - **Grunner**: Enklere å holde oversikt over rekkefølge og avhengigheter mellom entiteter
  - **Karakterer**: Lagres som properties på `INNEHOLDER`-relasjoner, IKKE som separate noder
  - **Rekkefølge viktig**: Fagkoder → Kravelementer/Grunnlag/Kvotetyper → PoengTyper → RangeringTyper → Regelsett → Institusjoner → OpptaksVeier → Personer/Dokumentasjon
- **Reset**: `npm run db:reset` for full reset med constraints og seeding
- **Admin**: `npm run db:admin` for interaktivt admin-verktøy

## Development Server

- **Start**: `npm run dev` - Starter server på http://localhost:3000
- **Build**: `npm run build` - Bygger produksjonsversjon
- **Start prod**: `npm start` - Starter produksjonsserver
- **URL**: Server kjører på `http://localhost:3000`

## API Routes (Next.js 15)

- **Viktig**: Params er nå Promise i Next.js 15
- **Pattern**: `{ params }: { params: Promise<{ id: string }> }`
- **Bruk**: `const { id } = await params` i starten av funksjonen

## Hovedentiteter

- **Implementerte**: Institusjon, Utdanningstilbud, Person, Dokumentasjon, Fagkode, Faggruppe, Regelsett, OpptaksVei
- **Delvis implementerte**: Søknad (mangler full funksjonalitet)
- **Ikke implementerte**: Opptak (kun definert i datamodell)
- **Beslutningstre**: OpptaksVei-struktur med Grunnlag → Krav → Kvote → Rangering

## Hosting

- **Produksjon**: Se `/HOSTING.md` for detaljer
- **Docker**: Forenklet setup i `docker-compose.simple.yml`
- **Uten Docker**: `npm start` (krever Neo4j kjørende)
- **PM2**: Bruk `npm run production:*` scripts for prosesshåndtering
