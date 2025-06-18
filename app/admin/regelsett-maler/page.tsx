'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Building2,
  CheckCircle,
  Users,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Kravelement {
  id: string;
  navn: string;
  type: string;
  beskrivelse: string;
  aktiv: boolean;
}

interface KvoteType {
  id: string;
  navn: string;
  type: string;
  beskrivelse: string;
  aktiv: boolean;
}

interface RangeringType {
  id: string;
  navn: string;
  type: string;
  formelMal: string;
  beskrivelse: string;
  aktiv: boolean;
}

interface OpptaksVei {
  id: string;
  navn: string;
  type: string;
  beskrivelse: string;
  aktiv: boolean;
  krav: Kravelement[];
  kvoter: KvoteType[];
  rangeringer: RangeringType[];
}

interface RegelsettMal {
  id: string;
  navn: string;
  beskrivelse: string;
  versjon: string;
  opprettet: string;
  aktiv: boolean;
  opptaksveier: OpptaksVei[];
}

function RegelsettMalCard({ mal }: { mal: RegelsettMal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">{mal.navn}</CardTitle>
              <CardDescription className="mt-1">{mal.beskrivelse}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mal.aktiv ? 'default' : 'secondary'}>
              {mal.aktiv ? 'Aktiv' : 'Inaktiv'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="ml-2"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Opptaksveier ({mal.opptaksveier.length})</h3>
            </div>

            {mal.opptaksveier.map((vei, index) => (
              <div key={vei.id} className="border-l-4 border-blue-500 pl-6 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>

                {/* Grunnlag header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-blue-700">{vei.navn}</h4>
                    <Badge variant="outline" className="text-xs">
                      {vei.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{vei.beskrivelse}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Krav for denne veien */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h5 className="font-semibold">Krav ({vei.krav.length})</h5>
                    </div>
                    <div className="space-y-2">
                      {vei.krav.map((krav) => (
                        <div
                          key={krav.id}
                          className="p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{krav.navn}</span>
                            <Badge variant="outline" className="text-xs">
                              {krav.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{krav.beskrivelse}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kvoter som denne veien gir tilgang til */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <h5 className="font-semibold">Kvoter ({vei.kvoter.length})</h5>
                    </div>
                    <div className="space-y-2">
                      {vei.kvoter.map((kvote) => (
                        <div
                          key={kvote.id}
                          className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{kvote.navn}</span>
                            <Badge variant="outline" className="text-xs">
                              {kvote.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{kvote.beskrivelse}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rangering som brukes for denne veien */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                      <h5 className="font-semibold">Rangering ({vei.rangeringer.length})</h5>
                    </div>
                    <div className="space-y-2">
                      {vei.rangeringer.map((rangering) => (
                        <div
                          key={rangering.id}
                          className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{rangering.navn}</span>
                            <Badge variant="outline" className="text-xs">
                              {rangering.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{rangering.beskrivelse}</p>
                          {rangering.formelMal && (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                              {rangering.formelMal}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {index < mal.opptaksveier.length - 1 && (
                  <div className="mt-6 mb-2 border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Versjon: {mal.versjon}</span>
            <span>Opprettet: {new Date(mal.opprettet).toLocaleDateString('no-NO')}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function RegelsettMalerPage() {
  const [regelsettMaler, setRegelsettMaler] = useState<RegelsettMal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegelsettMaler() {
      try {
        const response = await fetch('/api/regelsett-maler');
        const result = await response.json();

        if (result.success) {
          setRegelsettMaler(result.data);
        } else {
          setError(result.error || 'Kunne ikke hente regelsett-maler');
        }
      } catch (err) {
        setError('Nettverksfeil ved henting av regelsett-maler');
        console.error('Feil ved henting av regelsett-maler:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegelsettMaler();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Regelsett-maler</h1>
          <p className="text-gray-600 mt-2">Administrer standardmaler for opptaksregelsett</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Regelsett-maler</h1>
          <p className="text-gray-600 mt-2">Administrer standardmaler for opptaksregelsett</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-semibold">Feil ved lasting av data</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Regelsett-maler</h1>
        <p className="text-gray-600 mt-2">
          Administrer standardmaler for opptaksregelsett. Disse malene danner grunnlaget for
          konkrete regelsett ved institusjoner.
        </p>
      </div>

      {regelsettMaler.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">Ingen regelsett-maler funnet</p>
              <p className="text-sm mt-1">Det finnes ingen regelsett-maler i systemet ennå.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{regelsettMaler.length}</p>
                    <p className="text-sm text-gray-600">Regelsett-maler</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {regelsettMaler.reduce((sum, mal) => sum + mal.opptaksveier.length, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Totale opptaksveier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {regelsettMaler.reduce(
                        (sum, mal) =>
                          sum +
                          mal.opptaksveier.reduce((veiSum, vei) => veiSum + vei.krav.length, 0),
                        0
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Totale krav</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {regelsettMaler.map((mal) => (
              <RegelsettMalCard key={mal.id} mal={mal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
