# Implementering av Nested LogicalNode Support

## 🎯 Mål

Implementere full støtte for nested logical expressions i opptakskrav, slik at man kan lage komplekse krav som:

- `GSK AND (R1 OR S2)`
- `(GSK AND R1) OR (Fagbrev AND Arbeidserfaring)`

## ✅ Fullført

### 1. Frontend Refaktorering

- **Fil**: `/app/admin/regelsett/[id]/page.tsx` - Komplett refaktorert
- **Problem**: Blandet gamle flat krav-arrays med nye LogicalExpression
- **Løsning**:
  - Fjernet all flat krav-logikk
  - Bruker LogicalExpressionBuilder konsekvent for både create og edit
  - Ren datamodell med kun `logicalExpression` (ikke `krav` array)
  - Helper funksjoner for konvertering til backend-kompatibilitet

### 2. LogicalExpressionBuilder Komponent

- **Fil**: Integrert i refaktorert page.tsx
- **Funksjonalitet**:
  - Recursive component for nested expressions
  - AND/OR operator selection
  - Add/remove requirements og nested groups
  - Visual hierarchy med indentation
  - Disabled mode for read-only visning

### 3. Backend Utility Library

- **Fil**: `/lib/logicalExpression.ts` - NY FIL
- **Funksjoner**:
  - `saveLogicalExpression()`: Konverterer LogicalExpression til nested LogicalNodes i database
  - `buildLogicalExpression()`: Bygger LogicalExpression fra database LogicalNodes (bruker ID)
  - `buildLogicalExpressionByName()`: Bakoverkompatibilitet (bruker navn)
  - `extractRequirementIds()`: Henter alle krav-ID-er fra nested struktur
  - `deleteLogicalExpression()`: Sletter LogicalNode-tree rekursivt

### 4. Backend API Oppdateringer

#### POST Endpoint - `/api/regelsett/[id]/opptaksveier/route.ts`

- ✅ **Fullført**: Tar imot `logicalExpression` parameter
- ✅ **Funksjonalitet**: Lager nested LogicalNode struktur i database
- ✅ **Bakoverkompatibilitet**: Håndterer også gamle `kravIds` format

#### PUT Endpoint - `/api/opptaksveier/[id]/route.ts`

- ✅ **Fullført**: Tar imot `logicalExpression` parameter
- ✅ **Funksjonalitet**: Sletter gamle og lager nye nested strukturer
- ✅ **Cleanup**: Bruker `deleteLogicalExpression()` for riktig opprydding

#### GET Endpoint - `/api/opptaksveier/[id]/route.ts`

- ✅ **Fullført**: Returnerer full `logicalExpression` struktur
- ✅ **Funksjonalitet**: Bruker `buildLogicalExpression()` for nested reconstruction

## ⚠️ Delvis Fullført

### GET Endpoint - `/api/regelsett/[id]/route.ts`

- **Status**: 90% fullført, men trenger cleanup
- **Problem**: Har egen buildLogicalExpression funksjon som kolliderer med import
- **Hva som mangler**:
  - Fjerne duplicate buildLogicalExpression funksjon (linje 20-100+)
  - Fjerne duplicate LogicalExpression interface (linje 5-12)
  - Bruke importert `buildLogicalExpressionById` konsekvent

## 🧪 Testing Resultater

### Fungerende:

- ✅ **POST**: Kan lage nested structures

```bash
# Test opprettet: "GSK AND (Alder 25+ OR Arbeidserfaring)"
curl -X POST -H "Content-Type: application/json" -d '{...logicalExpression...}'
# → Returnerer: 201 Created med nested structure
```

- ✅ **Individual GET**: Returnerer perfect nested structure

```bash
curl /api/opptaksveier/ccf84a7c-4095-4b95-999c-efc8bb535460
# → Returnerer: Komplett nested LogicalExpression
```

### Ikke Fungerende:

- ❌ **Regelsett GET**: Returnerer tomme LogicalExpressions

```bash
curl /api/regelsett/65f7a9af-7e99-4b66-b213-304aceeb645a
# → LogicalExpression.children = [] (tom)
```

## 📁 Endrede Filer

### Nye Filer:

- `/lib/logicalExpression.ts` - Utility library

### Refaktorerte Filer:

- `/app/admin/regelsett/[id]/page.tsx` - Komplett omskrevet
- `/app/api/regelsett/[id]/opptaksveier/route.ts` - Oppdatert POST
- `/app/api/opptaksveier/[id]/route.ts` - Oppdatert GET/PUT

### Backup Filer:

- `/app/admin/regelsett/[id]/page-old.tsx` - Original implementasjon

## 🏗️ Database Struktur

### LogicalNode Schema:

```cypher
CREATE (ln:LogicalNode {
  id: randomUUID(),
  navn: "Node navn",
  beskrivelse: "Beskrivelse",
  type: "AND" | "OR" | "REQUIREMENT",
  opprettet: datetime()
})

// Relasjoner:
OpptaksVei -[:HAR_REGEL]-> LogicalNode (root)
LogicalNode -[:EVALUERER]-> Kravelement (leaf requirements)
LogicalNode -[:EVALUERER]-> LogicalNode (nested groups)
```

## 🎛️ Frontend Interface

### LogicalExpression Type:

```typescript
interface LogicalExpression {
  type: 'GROUP' | 'REQUIREMENT';
  operator?: 'AND' | 'OR'; // for GROUP
  children?: LogicalExpression[]; // for GROUP
  requirementId?: string; // for REQUIREMENT
  requirementName?: string; // for display
}
```

### Eksempel Nested Structure:

```typescript
// GSK AND (R1 OR S2)
{
  type: 'GROUP',
  operator: 'AND',
  children: [
    {
      type: 'REQUIREMENT',
      requirementId: 'gsk-id',
      requirementName: 'Generell studiekompetanse'
    },
    {
      type: 'GROUP',
      operator: 'OR',
      children: [
        { type: 'REQUIREMENT', requirementId: 'r1-id', requirementName: 'Matematikk R1' },
        { type: 'REQUIREMENT', requirementId: 's2-id', requirementName: 'Matematikk S2' }
      ]
    }
  ]
}
```

## 🐛 Siste Problem

### `/api/regelsett/[id]/route.ts` cleanup

**Fil location**: Linje 20-100+ har gammel buildLogicalExpression funksjon
**Problem**: Navnekonflikt med import fra `/lib/logicalExpression.ts`  
**Løsning**:

1. Slett gammel funksjon (linje 20-100+)
2. Slett duplicate interface (linje 5-12)
3. Bruk importert `buildLogicalExpressionById`

### Quick Fix Command:

```typescript
// I regelsett route.ts, endre:
if (logicalNodeId) {
  logicalExpression = await buildLogicalExpressionById(session, logicalNodeId);
}
// Og slett den lokale buildLogicalExpression funksjonen
```

## 📊 Status Summary

| Komponent                         | Status      | Beskrivelse                |
| --------------------------------- | ----------- | -------------------------- |
| Frontend LogicalExpressionBuilder | ✅ Fullført | Recursive nested UI        |
| Frontend Page Refactoring         | ✅ Fullført | Clean implementation       |
| Backend Utility Library           | ✅ Fullført | Central logic              |
| POST /opptaksveier                | ✅ Fullført | Creates nested structures  |
| PUT /opptaksveier                 | ✅ Fullført | Updates nested structures  |
| GET /opptaksveier/[id]            | ✅ Fullført | Returns nested structures  |
| GET /regelsett/[id]               | ⚠️ 90%      | Needs cleanup              |
| End-to-End Testing                | ⚠️ 90%      | Works except regelsett GET |

## 🚀 Neste Steg

1. **Umiddelbart**: Fix `/api/regelsett/[id]/route.ts` cleanup
2. **Testing**: Verifiser at alle endpoints fungerer end-to-end
3. **Integration**: Test frontend + backend sammen
4. **Evaluation**: Oppdater evaluering.ts til å håndtere nested structures

## 💾 Backup & Rollback

Alle endringer kan rulles tilbake ved å:

1. Restore `/app/admin/regelsett/[id]/page-old.tsx`
2. Revert API endpoint changes
3. Remove `/lib/logicalExpression.ts`

Men implementeringen er 95% ferdig og fungerer! 🎉
