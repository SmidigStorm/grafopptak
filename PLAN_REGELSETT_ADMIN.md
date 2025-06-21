# Plan: Regelsett-administrasjon for Utdanningstilbud

## Status (ved pause)

### ✅ Implementert og fungerende:

- **Regelsett-mal dropdown** i utdanningstilbud-opprettelse dialog
- **Backend-støtte** for regelsett-maler (`/api/regelsett?maler=true`)
- **Mal-kopiering** (`lib/regelsett-mal.ts`) - kopierer komplette regelsett fra mal
- **Auto-opprettelse** av regelsett basert på valgt mal ved utdanningstilbud-opprettelse
- **Status-badges** "Har regelsett" / "Mangler regelsett" i utdanningstilbud-tabellen
- **⚙️ Knapp** implementert (men redirect feil sted)

### ❌ Misforståelse oppdaget:

- Implementerte redirect til `/admin/regelbygging` (bygger regel-**elementer**: grunnlag, krav, kvoter)
- Skulle redirect til `/admin/regelsett/[id]` (bygger faktiske **regelsett**: kobler elementer sammen)

## 🎯 Ønsket slutt-arbeidsflyt:

### Brukerreise:

1. **Opprett utdanningstilbud**

   - Valgfritt: Velg regelsett-mal fra dropdown
   - Hvis mal valgt: Automatisk regelsett opprettes basert på mal

2. **Administrer regelsett**

   - Klikk ⚙️ "Administrer regelsett"
   - **Alltid samme handling**: Gå til `/admin/regelsett/[regelsettId]/edit`
   - **Auto-opprettelse**: Hvis ingen regelsett → opprett automatisk tomt regelsett → edit

3. **Regelsett-redigering**
   - Bruk eksisterende `/admin/regelsett/[id]/edit` (eller `/admin/regelsett/[id]`)
   - Full regelsett-bygger med opptaksveier, krav, kvoter etc.

## 📋 Neste implementasjonssteg:

### 1. Undersøk eksisterende regelsett-struktur

- [ ] Sjekk om `/admin/regelsett/[id]/edit` rute eksisterer
- [ ] Forstå hvordan regelsett-redigering fungerer
- [ ] Se på eksisterende regelsett API-er

### 2. Implementer smidig ⚙️-knapp

- [ ] Fjern dagens opprett/edit-branching logikk
- [ ] Ny funksjon: `gaaTilRegelsettEdit(tilbud)`:
  ```typescript
  const gaaTilRegelsettEdit = async (tilbud: Utdanningstilbud) => {
    // 1. Hent eller opprett regelsett for tilbud
    const regelsettId = await hentEllerOpprettRegelsett(tilbud.id);
    // 2. Redirect til edit
    router.push(`/admin/regelsett/${regelsettId}/edit`);
  };
  ```

### 3. Backend-støtte for auto-opprettelse

- [ ] API-endepunkt: `POST /api/utdanningstilbud/[id]/regelsett/opprett-eller-hent`
- [ ] Logikk:
  - Hvis utdanningstilbud har regelsett → returner eksisterende ID
  - Hvis ikke → opprett tomt regelsett + HAR_REGELSETT kobling → returner ny ID
- [ ] Navngiving: "[Utdanningstilbud navn] - Regelsett"

### 4. Cleanup og forbedringer

- [ ] **Fjern regelbygging-kontekst endringer**:
  - Tilbakestill `/admin/regelbygging/page.tsx` til original
  - Fjern utdanningstilbud-parameter støtte
- [ ] **Oppdater knapp-tekst**: "Administrer regelsett" (alltid samme handling)
- [ ] **Valgfritt**: Legg til utdanningstilbud-kontekst i regelsett-edit siden

## 🗂️ Filer som beholdes (verdifulle):

### Frontend:

- `app/admin/utdanningstilbud/page.tsx` - Mal-dropdown og status-badges
- Kun endre `aapneRegelssettAdministrasjon()` funksjon

### Backend:

- `app/api/regelsett/route.ts` - Mal-parameter støtte
- `lib/regelsett-mal.ts` - Mal-kopiering (kan gjenbrukes for tom opprettelse)
- `app/api/utdanningstilbud/route.ts` - Mal-håndtering ved opprettelse

### Nye filer å lage:

- `app/api/utdanningstilbud/[id]/regelsett/opprett-eller-hent/route.ts`

## 💡 Lærdom:

- **Regelsett-maler** er verdifullt for quick-start
- **1:1 forhold** mellom utdanningstilbud og regelsett er riktig
- **Auto-opprettelse** gir bedre UX enn manual opprettelse
- **Skille** mellom regel-elementer (bygging) og regelsett (sammensetting) er viktig

## 🎯 Resultat etter implementasjon:

- Smidig arbeidsflyt fra utdanningstilbud til regelsett-redigering
- Ingen forvirring om "opprett vs edit"
- Quick-start med maler for vanlige regelsett-typer
- En knapp som alltid fungerer: "Administrer regelsett"
