# 🌱 Database Seeding Scripts

Denne mappen inneholder scripts for å populere Neo4j databasen med testdata.

## 📁 Tilgjengelige scripts

### `seed-fagkoder.ts`

Populerer databasen med realistiske fagkoder og faggrupper basert på norsk videregående utdanning.

**Innhold:**

- 4 faggrupper (Matematikk R1/R2, Norsk 393t, Realfag valgfritt)
- 14 fagkoder med ekte norske fagkoder (REA3022, NOR1211, osv.)
- Komplette relasjoner mellom fagkoder og faggrupper
- Kombinasjonskrav (S1+S2 = R1, Fysikk 1+2, osv.)
- Historiske fagkoder (3MX, 2MX) markert som utfaset

## 🚀 Bruk

### Kjør seeding

```bash
npm run seed
```

## 📊 Testdata oversikt

### Faggrupper opprettet

1. **Matematikk R1-nivå** (4 fagkoder)

   - REA3022 (Matematikk R1) - direkte
   - REA3026 (Matematikk S1) + REA3028 (Matematikk S2) - kombinasjon
   - 2MX (historisk, utfaset)

2. **Matematikk R2-nivå** (2 fagkoder)

   - REA3024 (Matematikk R2) - direkte
   - 3MX (historisk, utfaset)

3. **Norsk 393 timer** (2 fagkoder)

   - NOR1211 (Norsk hovedmål)
   - NOR1212 (Norsk sidemål)

4. **Realfag valgfritt** (6 fagkoder)
   - FYS1001 + FYS1002 (Fysikk 1+2)
   - KJE1001 + KJE1002 (Kjemi 1+2)
   - BIO1001 + BIO1002 (Biologi 1+2)

## 🔧 Utvikling

### Legge til nye fagkoder

1. Rediger `seed-fagkoder.ts`
2. Legg til fagkode i relevant seksjon
3. Koble til faggruppe i bunnen av scriptet
4. Test med `npm run seed:fagkoder`

### Legge til nye faggrupper

1. Legg til i faggruppe-seksjonen
2. Opprett fagkoder som skal tilhøre gruppen
3. Koble sammen i slutten av scriptet

## ⚠️ Merk

- Scriptene sletter eksisterende fagkoder/faggrupper før de lager nye
- UUIDer genereres automatisk av Neo4j
- Kombinasjonskrav lagres som arrays i relasjon-properties
- Historiske fagkoder har `gyldigTil` dato og `aktiv: false`
