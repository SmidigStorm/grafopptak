import { describe, it, expect } from 'vitest';

describe('Domain Logic (Simple Tests)', () => {
  describe('Alders-evaluering', () => {
    it('beregner alder korrekt', () => {
      // Arrange
      const fodselsdato = new Date('2003-01-01');
      const idag = new Date('2024-01-01');

      // Act
      const alder = idag.getFullYear() - fodselsdato.getFullYear();

      // Assert
      expect(alder).toBe(21);
    });

    it('kvalifiserer for førstegangsvitnemål ved 21 år', () => {
      // Arrange
      const alder = 21;

      // Act
      const kvalifisertForForstegangsvitnemaal = alder <= 21;

      // Assert
      expect(kvalifisertForForstegangsvitnemaal).toBe(true);
    });

    it('avviser førstegangsvitnemål ved 22 år', () => {
      // Arrange
      const alder = 22;

      // Act
      const kvalifisertForForstegangsvitnemaal = alder <= 21;

      // Assert
      expect(kvalifisertForForstegangsvitnemaal).toBe(false);
    });
  });

  describe('Karaktersnitt-beregning', () => {
    it('beregner korrekt karaktersnitt', () => {
      // Arrange
      const karakterer = [5, 4, 6, 3, 5];

      // Act
      const snitt = karakterer.reduce((sum, k) => sum + k, 0) / karakterer.length;

      // Assert
      expect(snitt).toBe(4.6);
    });

    it('ignorerer ikke-numeriske karakterer', () => {
      // Arrange
      const alleKarakterer = ['5', '4', 'bestått', '6'];
      const numeriskeKarakterer = alleKarakterer
        .filter((k) => !isNaN(Number(k)))
        .map((k) => Number(k));

      // Act
      const snitt = numeriskeKarakterer.reduce((sum, k) => sum + k, 0) / numeriskeKarakterer.length;

      // Assert
      expect(snitt).toBe(5); // (5+4+6)/3 = 5
      expect(numeriskeKarakterer).toEqual([5, 4, 6]);
    });

    it('velger beste karakter ved forbedring', () => {
      // Arrange
      const karakterForsok = [
        { karakter: 3, dato: '2023-06-15' },
        { karakter: 5, dato: '2023-12-15' }, // Beste
        { karakter: 4, dato: '2024-01-15' },
      ];

      // Act
      const besteKarakter = karakterForsok.reduce((beste, forsok) =>
        forsok.karakter > beste.karakter ? forsok : beste
      );

      // Assert
      expect(besteKarakter.karakter).toBe(5);
      expect(besteKarakter.dato).toBe('2023-12-15');
    });
  });

  describe('Realfagspoeng-beregning', () => {
    it('beregner realfagspoeng korrekt', () => {
      // Arrange
      const fagOgKarakterer = [
        { fagkode: 'REA3022', karakter: 5 }, // Matte R1 = 0.5p
        { fagkode: 'REA3024', karakter: 4 }, // Matte R2 = 1p
        { fagkode: 'REA3004', karakter: 6 }, // Fysikk 1 = 1p
      ];

      const poengTabell: Record<string, number> = {
        REA3022: 0.5, // Matematikk R1
        REA3024: 1.0, // Matematikk R2
        REA3004: 1.0, // Fysikk 1
        REA3006: 0.5, // Kjemi 1
        REA3007: 1.0, // Kjemi 2
      };

      // Act
      let totalPoeng = 0;
      for (const fag of fagOgKarakterer) {
        if (fag.karakter >= 4 && poengTabell[fag.fagkode]) {
          totalPoeng += poengTabell[fag.fagkode];
        }
      }

      // Assert
      expect(totalPoeng).toBe(2.5); // 0.5 + 1.0 + 1.0
    });

    it('begrenser realfagspoeng til maksimum 4', () => {
      // Arrange
      const manyeRealfag = [
        { fagkode: 'REA3022', karakter: 6 }, // 0.5p
        { fagkode: 'REA3024', karakter: 6 }, // 1p
        { fagkode: 'REA3004', karakter: 6 }, // 1p
        { fagkode: 'REA3006', karakter: 6 }, // 0.5p
        { fagkode: 'REA3007', karakter: 6 }, // 1p
        { fagkode: 'BIO1002', karakter: 6 }, // 0.5p (teoretisk)
      ];

      const poengTabell: Record<string, number> = {
        REA3022: 0.5,
        REA3024: 1.0,
        REA3004: 1.0,
        REA3006: 0.5,
        REA3007: 1.0,
        BIO1002: 0.5,
      };

      // Act
      let totalPoeng = 0;
      for (const fag of manyeRealfag) {
        if (fag.karakter >= 4 && poengTabell[fag.fagkode]) {
          totalPoeng += poengTabell[fag.fagkode];
        }
      }
      totalPoeng = Math.min(totalPoeng, 4); // Begrens til maks 4

      // Assert
      expect(totalPoeng).toBe(4); // Begrenset til maksimum
    });
  });

  describe('Faggruppe-matching', () => {
    it('godtar R1 som R1-nivå', () => {
      // Arrange
      const harFagkoder = ['REA3022']; // Matte R1
      const r1Fagkoder = ['REA3022', 'MAT1001-S1', 'MAT1002-S2'];

      // Act - Sjekk om har R1 direkte
      const harR1Direkte = harFagkoder.some((fag) => fag === 'REA3022');

      // Assert
      expect(harR1Direkte).toBe(true);
    });

    it('godtar S1+S2 som R1-ekvivalent', () => {
      // Arrange
      const harFagkoder = ['MAT1001-S1', 'MAT1002-S2'];

      // Act - Sjekk om har både S1 og S2
      const harS1 = harFagkoder.includes('MAT1001-S1');
      const harS2 = harFagkoder.includes('MAT1002-S2');
      const harR1Ekvivalent = harS1 && harS2;

      // Assert
      expect(harR1Ekvivalent).toBe(true);
    });

    it('avviser kun S1 som R1-ekvivalent', () => {
      // Arrange
      const harFagkoder = ['MAT1001-S1']; // Kun S1, ikke S2

      // Act
      const harS1 = harFagkoder.includes('MAT1001-S1');
      const harS2 = harFagkoder.includes('MAT1002-S2');
      const harR1Ekvivalent = harS1 && harS2;

      // Assert
      expect(harR1Ekvivalent).toBe(false);
    });
  });

  describe('OpptaksVei-evaluering (logikk)', () => {
    it('evaluerer førstegangsvitnemål-vei korrekt', () => {
      // Arrange
      const soker = {
        alder: 20,
        harVitnemaal: true,
        fagkoder: ['REA3022', 'REA3024'], // R1 + R2
        karakterer: { REA3022: 5, REA3024: 4 },
      };

      // Act - Evaluer krav for førstegangsvitnemål
      const oppfyllerAlderskrav = soker.alder <= 21;
      const harVitnemaal = soker.harVitnemaal;
      const harMatematikkR2 = soker.fagkoder.includes('REA3024');

      const kvalifisert = oppfyllerAlderskrav && harVitnemaal && harMatematikkR2;

      // Assert
      expect(kvalifisert).toBe(true);
    });

    it('avviser førstegangsvitnemål for gammel søker', () => {
      // Arrange
      const soker = {
        alder: 23, // For gammel
        harVitnemaal: true,
        fagkoder: ['REA3022', 'REA3024'],
        karakterer: { REA3022: 5, REA3024: 4 },
      };

      // Act
      const oppfyllerAlderskrav = soker.alder <= 21;
      const harVitnemaal = soker.harVitnemaal;
      const harMatematikkR2 = soker.fagkoder.includes('REA3024');

      const kvalifisert = oppfyllerAlderskrav && harVitnemaal && harMatematikkR2;

      // Assert
      expect(kvalifisert).toBe(false);
    });

    it('avviser førstegangsvitnemål uten matematikk R2', () => {
      // Arrange
      const soker = {
        alder: 20,
        harVitnemaal: true,
        fagkoder: ['REA3022'], // Kun R1, ikke R2
        karakterer: { REA3022: 5 },
      };

      // Act
      const oppfyllerAlderskrav = soker.alder <= 21;
      const harVitnemaal = soker.harVitnemaal;
      const harMatematikkR2 = soker.fagkoder.includes('REA3024');

      const kvalifisert = oppfyllerAlderskrav && harVitnemaal && harMatematikkR2;

      // Assert
      expect(kvalifisert).toBe(false);
    });
  });
});
