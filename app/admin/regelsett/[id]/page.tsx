'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Settings, FileText, Target, Trophy, Route } from 'lucide-react';
import Link from 'next/link';

// Helper for formatting Neo4j dates
function formatNeo4jDate(dateObj: any): string {
  if (!dateObj) return '-';

  if (typeof dateObj === 'object' && dateObj.year) {
    const year = dateObj.year.low || dateObj.year;
    const month = dateObj.month.low || dateObj.month;
    const day = dateObj.day.low || dateObj.day;
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  }

  try {
    return new Date(dateObj).toLocaleDateString('nb-NO');
  } catch {
    return '-';
  }
}

interface OpptaksVei {
  id: string;
  navn: string;
  beskrivelse?: string;
  aktiv: boolean;
  grunnlag?: string;
  krav: string[];
  kvote?: string;
  rangering?: string;
}

interface Regelsett {
  id: string;
  navn: string;
  versjon: string;
  gyldigFra: string;
  gyldigTil?: string;
  beskrivelse?: string;
  aktiv: boolean;
  opprettet: string;
  erMal?: boolean;
  malType?: string;
  opptaksVeier?: OpptaksVei[];
}

interface RegelsettDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RegelsettDetailPage({ params }: RegelsettDetailPageProps) {
  const [id, setId] = useState<string>('');
  const [regelsett, setRegelsett] = useState<Regelsett | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const fetchRegelsett = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/regelsett/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRegelsett(data);
      } else {
        console.error('Feil ved henting av regelsett');
      }
    } catch (error) {
      console.error('Feil ved henting av regelsett:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRegelsett();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Laster regelsett...</p>
        </div>
      </div>
    );
  }

  if (!regelsett) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Regelsett ikke funnet</p>
          <Link href="/admin/regelsett">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til regelsett
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/regelsett">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{regelsett.navn}</h1>
          <p className="text-muted-foreground">
            Versjon {regelsett.versjon} •{' '}
            {regelsett.aktiv ? (
              <Badge variant="default">Aktiv</Badge>
            ) : (
              <Badge variant="secondary">Inaktiv</Badge>
            )}
          </p>
        </div>
        <Link href={`/admin/regelsett/${id}/edit`}>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Rediger regelsett
          </Button>
        </Link>
      </div>

      {/* Kompakt info-bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Versjon:</span>
              <p className="font-mono">{regelsett.versjon}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Type:</span>
              <div className="mt-1">
                {regelsett.erMal ? (
                  <Badge variant="secondary" className="text-xs">
                    📋 {regelsett.malType || 'Mal'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    📄 Konkret
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Gyldig fra:</span>
              <p>{formatNeo4jDate(regelsett.gyldigFra)}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">OpptaksVeier:</span>
              <p className="font-semibold">{regelsett.opptaksVeier?.length || 0}</p>
            </div>
            {regelsett.beskrivelse && (
              <div className="col-span-2 md:col-span-1">
                <span className="font-medium text-muted-foreground">Beskrivelse:</span>
                <p className="text-xs">{regelsett.beskrivelse}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Beslutningstre - OpptaksVeier
              <Badge variant="secondary">{regelsett.opptaksVeier?.length || 0} veier</Badge>
            </CardTitle>
            <CardDescription>
              Hver vei representerer en komplett regel fra grunnlag til kvote
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!regelsett.opptaksVeier || regelsett.opptaksVeier.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Route className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium mb-2">Ingen opptaksveier enda</h3>
                <p className="text-sm mb-6 max-w-md mx-auto">
                  Opprett din første opptaksvei for å definere hvilke grunnlag, krav, kvoter og
                  rangeringer som skal brukes.
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Opprett første opptaksvei
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {regelsett.opptaksVeier.map((vei, index) => (
                  <div
                    key={vei.id}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50"
                  >
                    {/* Vei-header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{vei.navn}</h3>
                          {vei.beskrivelse && (
                            <p className="text-sm text-muted-foreground">{vei.beskrivelse}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={vei.aktiv ? 'default' : 'secondary'}>
                        {vei.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>

                    {/* Beslutningstre-flyt */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Grunnlag */}
                      <div className="flex flex-col items-center">
                        <div className="bg-green-100 text-green-800 rounded-lg p-3 w-full text-center border-2 border-green-200">
                          <FileText className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-1">GRUNNLAG</p>
                          <p className="text-sm font-semibold">{vei.grunnlag || 'Ikke satt'}</p>
                        </div>
                        <div className="hidden md:block w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-400 mt-2"></div>
                      </div>

                      {/* Krav */}
                      <div className="flex flex-col items-center">
                        <div className="bg-orange-100 text-orange-800 rounded-lg p-3 w-full text-center border-2 border-orange-200">
                          <Target className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-1">KRAV</p>
                          <div className="text-sm">
                            {vei.krav.length > 0 ? (
                              <ul className="space-y-1">
                                {vei.krav.map((krav, i) => (
                                  <li key={i} className="text-xs">
                                    • {krav}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm font-semibold">Ingen krav</p>
                            )}
                          </div>
                        </div>
                        <div className="hidden md:block w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-400 mt-2"></div>
                      </div>

                      {/* Kvote */}
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 text-purple-800 rounded-lg p-3 w-full text-center border-2 border-purple-200">
                          <Trophy className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-1">KVOTE</p>
                          <p className="text-sm font-semibold">{vei.kvote || 'Ikke satt'}</p>
                        </div>
                        <div className="hidden md:block w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-400 mt-2"></div>
                      </div>

                      {/* Rangering */}
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 text-blue-800 rounded-lg p-3 w-full text-center border-2 border-blue-200">
                          <Settings className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-1">RANGERING</p>
                          <p className="text-sm font-semibold">{vei.rangering || 'Ikke satt'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Legg til ny vei */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Button variant="outline" size="lg" className="mx-auto">
                    <Plus className="h-5 w-5 mr-2" />
                    Legg til ny opptaksvei
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Opprett en ny vei gjennom beslutningstreet
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
