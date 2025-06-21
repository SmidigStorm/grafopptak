'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, User, GraduationCap, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Soker {
  id: string;
  fornavn: string;
  etternavn: string;
  alder: number;
  antallDokumenter: number;
}

interface Utdanningstilbud {
  id: string;
  navn: string;
  institusjonNavn: string;
  studienivaa: string;
}

interface EvalueringsResultat {
  soker: {
    id: string;
    navn: string;
    alder: number;
    dokumentasjon: { type: string; antallFagkoder: number }[];
  };
  kvalifiserteOpptaksVeier: Array<{
    opptaksVei: { id: string; navn: string; beskrivelse: string };
    regeluttrykk: string;
    oppfylteKrav: string[];
    evaluering: string;
  }>;
  ikkeKvalifiserteOpptaksVeier: Array<{
    opptaksVei: { id: string; navn: string; beskrivelse: string };
    regeluttrykk: string;
    manglendeFagkoder: string[];
    evaluering: string;
  }>;
  sammendrag: {
    totaltAntallOpptaksVeier: number;
    kvalifisert: number;
    ikkeKvalifisert: number;
  };
}

export default function EvalueringSide() {
  const [sokere, setSokere] = useState<Soker[]>([]);
  const [utdanningstilbud, setUtdanningstilbud] = useState<Utdanningstilbud[]>([]);
  const [valgtSoker, setValgtSoker] = useState<string>('');
  const [valgtUtdanningstilbud, setValgtUtdanningstilbud] = useState<string>('');
  const [evalueringsResultat, setEvalueringsResultat] = useState<EvalueringsResultat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hent søkere ved oppstart
  useEffect(() => {
    const hentSokere = async () => {
      try {
        const response = await fetch('/api/sokere');
        if (!response.ok) throw new Error('Kunne ikke hente søkere');
        const data = await response.json();
        setSokere(data);
      } catch (err) {
        setError('Feil ved henting av søkere');
        console.error(err);
      }
    };

    const hentUtdanningstilbud = async () => {
      try {
        const response = await fetch('/api/utdanningstilbud');
        if (!response.ok) throw new Error('Kunne ikke hente utdanningstilbud');
        const data = await response.json();
        setUtdanningstilbud(data);
      } catch (err) {
        setError('Feil ved henting av utdanningstilbud');
        console.error(err);
      }
    };

    hentSokere();
    hentUtdanningstilbud();
  }, []);

  const kjorEvaluering = async () => {
    if (!valgtSoker || !valgtUtdanningstilbud) return;

    setLoading(true);
    setError(null);
    setEvalueringsResultat(null);

    try {
      const response = await fetch(`/api/sokere/${valgtSoker}/evaluering`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utdanningstilbudId: valgtUtdanningstilbud,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Feil ved evaluering');
      }

      const resultat = await response.json();
      setEvalueringsResultat(resultat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukjent feil ved evaluering');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const valgtSokerData = sokere.find((s) => s.id === valgtSoker);
  const valgtUtdanningstilbudData = utdanningstilbud.find((u) => u.id === valgtUtdanningstilbud);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Søker-evaluering</h1>
        <p className="text-muted-foreground">
          Evaluer om en søker oppfyller kravene for et utdanningstilbud
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Valg-seksjon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Velg søker og utdanningstilbud
            </CardTitle>
            <CardDescription>
              Velg en søker og et utdanningstilbud for å evaluere opptakskvalifikasjoner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Søker-dropdown */}
            <div>
              <label className="text-sm font-medium mb-2 block">Søker</label>
              <Select value={valgtSoker} onValueChange={setValgtSoker}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg søker..." />
                </SelectTrigger>
                <SelectContent>
                  {sokere.map((soker) => (
                    <SelectItem key={soker.id} value={soker.id}>
                      {soker.fornavn} {soker.etternavn} ({soker.alder} år)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Utdanningstilbud-dropdown */}
            <div>
              <label className="text-sm font-medium mb-2 block">Utdanningstilbud</label>
              <Select value={valgtUtdanningstilbud} onValueChange={setValgtUtdanningstilbud}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg utdanningstilbud..." />
                </SelectTrigger>
                <SelectContent>
                  {utdanningstilbud.map((tilbud) => (
                    <SelectItem key={tilbud.id} value={tilbud.id}>
                      {tilbud.navn} - {tilbud.institusjonNavn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evaluering-knapp */}
            <Button
              onClick={kjorEvaluering}
              disabled={!valgtSoker || !valgtUtdanningstilbud || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Evaluerer...
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Evaluer kvalifikasjoner
                </>
              )}
            </Button>

            {/* Valgt info */}
            {valgtSokerData && valgtUtdanningstilbudData && (
              <div className="pt-2 border-t space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Søker:</strong> {valgtSokerData.fornavn} {valgtSokerData.etternavn}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Tilbud:</strong> {valgtUtdanningstilbudData.navn}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultat-seksjon */}
        <Card>
          <CardHeader>
            <CardTitle>Evalueringsresultat</CardTitle>
            <CardDescription>Resultatet av kvalifikasjonsevalueringen</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!evalueringsResultat && !error && !loading && (
              <div className="text-center text-muted-foreground py-8">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingen evaluering utført ennå</p>
                <p className="text-sm">Velg søker og utdanningstilbud over</p>
              </div>
            )}

            {evalueringsResultat && (
              <div className="space-y-4">
                {/* Sammendrag */}
                <div className="flex items-center gap-4">
                  {evalueringsResultat.sammendrag.kvalifisert > 0 ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Kvalifisert
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Ikke kvalifisert
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {evalueringsResultat.sammendrag.kvalifisert}/
                    {evalueringsResultat.sammendrag.totaltAntallOpptaksVeier} opptaksveier
                  </span>
                </div>

                {/* Søkerinfo */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium">{evalueringsResultat.soker.navn}</h4>
                  <p className="text-sm text-muted-foreground">
                    {evalueringsResultat.soker.alder} år •{' '}
                    {evalueringsResultat.soker.dokumentasjon?.length || 0} dokumenter
                  </p>
                </div>

                {/* Kvalifiserte opptaksveier */}
                {evalueringsResultat.kvalifiserteOpptaksVeier.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">
                      ✅ Kvalifiserte opptaksveier
                    </h4>
                    <div className="space-y-2">
                      {evalueringsResultat.kvalifiserteOpptaksVeier.map((vei, index) => (
                        <div
                          key={index}
                          className="border border-green-200 rounded-lg p-3 bg-green-50"
                        >
                          <h5 className="font-medium">{vei.opptaksVei.navn}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            {vei.opptaksVei.beskrivelse}
                          </p>
                          <p className="text-sm">
                            <strong>Krav:</strong> {vei.regeluttrykk}
                          </p>
                          <p className="text-sm text-green-700">{vei.evaluering}</p>
                          {vei.oppfylteKrav.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Oppfylte krav:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vei.oppfylteKrav.map((krav, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {krav}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ikke-kvalifiserte opptaksveier */}
                {evalueringsResultat.ikkeKvalifiserteOpptaksVeier.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">
                      ❌ Ikke kvalifiserte opptaksveier
                    </h4>
                    <div className="space-y-2">
                      {evalueringsResultat.ikkeKvalifiserteOpptaksVeier.map((vei, index) => (
                        <div key={index} className="border border-red-200 rounded-lg p-3 bg-red-50">
                          <h5 className="font-medium">{vei.opptaksVei.navn}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            {vei.opptaksVei.beskrivelse}
                          </p>
                          <p className="text-sm">
                            <strong>Krav:</strong> {vei.regeluttrykk}
                          </p>
                          <p className="text-sm text-red-700">{vei.evaluering}</p>
                          {vei.manglendeFagkoder.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Manglende fagkoder:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vei.manglendeFagkoder.map((fagkode, i) => (
                                  <Badge key={i} variant="outline" className="text-xs text-red-600">
                                    {fagkode}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
