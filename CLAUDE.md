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

## Database

- **Struktur**: Neo4j grafdatabase med noder og relasjoner
- **Scripts**: Database admin-verktøy i `/scripts/db-admin.ts`
- **Seeding**: Fagkoder og faggrupper seeding i `/scripts/seed-fagkoder.ts`
- **Reset**: `npm run db:reset` for full reset med constraints og seeding

## Development Server

- **Start**: `npm run dev:start` - Starter server i bakgrunnen (unngår blokkering av terminal)
- **Stopp**: `npm run dev:stop` - Stopper bakgrunnsserveren
- **Restart**: `npm run dev:restart` - Restart server (anbefalt ved endringer)
- **Status**: `npm run dev:status` - Sjekk om server kjører
- **Logs**: `npm run dev:logs` - Se server-logger
- **URL**: Server kjører på `http://localhost:3000` når startet

## API Routes (Next.js 15)

- **Viktig**: Params er nå Promise i Next.js 15
- **Pattern**: `{ params }: { params: Promise<{ id: string }> }`
- **Bruk**: `const { id } = await params` i starten av funksjonen

## Hosting

- **Produksjon**: Se `/HOSTING.md` for detaljer
- **Docker**: Forenklet setup i `docker-compose.simple.yml`
- **Uten Docker**: `npm start` (krever Neo4j kjørende)
- **PM2**: Bruk `npm run production:*` scripts for prosesshåndtering
