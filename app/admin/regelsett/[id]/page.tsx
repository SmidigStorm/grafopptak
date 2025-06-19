'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Settings,
  FileText,
  Target,
  Trophy,
  Route,
  ChevronRight,
  Edit,
  Eye,
  Save,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOpptaksVeiData } from '@/hooks/useOpptaksVeiData';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<string>('');
  const [regelsett, setRegelsett] = useState<Regelsett | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRegelsett, setEditedRegelsett] = useState<Regelsett | null>(null);
  const [nyOpptaksVei, setNyOpptaksVei] = useState({
    navn: '',
    beskrivelse: '',
    grunnlagId: '',
    kravIds: [] as string[],
    kvoteId: '',
    rangeringId: '',
    aktiv: true,
  });
  const [oppretterOpptaksVei, setOppretterOpptaksVei] = useState(false);

  // Hent dropdown-data for opptaksveier
  const dropdownData = useOpptaksVeiData();

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

  // Sjekk om vi skal gå direkte i edit mode fra URL parameter
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true' && regelsett) {
      enterEditMode();
      // Fjern edit parameter fra URL etter å ha satt edit mode
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('edit');
      router.replace(newUrl.toString());
    }
  }, [regelsett, searchParams]);

  const enterEditMode = () => {
    setIsEditMode(true);
    setEditedRegelsett(JSON.parse(JSON.stringify(regelsett))); // Deep copy
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditedRegelsett(null);
  };

  const saveChanges = async () => {
    if (!editedRegelsett || !regelsett) return;

    try {
      // Lagre hver opptaksvei individuelt
      if (editedRegelsett.opptaksVeier) {
        for (const editedVei of editedRegelsett.opptaksVeier) {
          const originalVei = regelsett.opptaksVeier?.find((v) => v.id === editedVei.id);

          // Sjekk om opptaksveien har endringer
          if (
            originalVei &&
            (originalVei.navn !== editedVei.navn ||
              originalVei.beskrivelse !== editedVei.beskrivelse ||
              originalVei.grunnlag !== editedVei.grunnlag ||
              originalVei.kvote !== editedVei.kvote ||
              originalVei.rangering !== editedVei.rangering ||
              JSON.stringify(originalVei.krav.sort()) !== JSON.stringify(editedVei.krav.sort()))
          ) {
            // Konverter krav til ID-er (kan være blanding av navn og ID-er)
            const kravIds = editedVei.krav.map((krav) => {
              // Hvis det allerede er en ID, bruk den
              const foundById = dropdownData.kravelementer.find((k) => k.id === krav);
              if (foundById) return krav;

              // Hvis det er et navn, finn ID-en
              const foundByName = dropdownData.kravelementer.find((k) => k.navn === krav);
              return foundByName ? foundByName.id : krav;
            });

            const response = await fetch(`/api/opptaksveier/${editedVei.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                navn: editedVei.navn,
                beskrivelse: editedVei.beskrivelse,
                grunnlagId: editedVei.grunnlag,
                kravIds: kravIds,
                kvoteId: editedVei.kvote,
                rangeringId: editedVei.rangering,
                aktiv: editedVei.aktiv,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(`Feil ved lagring av ${editedVei.navn}: ${error.error}`);
            }
          }
        }
      }

      // Refresh regelsett data etter lagring
      await fetchRegelsett();
      setIsEditMode(false);
      setEditedRegelsett(null);
    } catch (error) {
      console.error('Feil ved lagring:', error);
      alert('Feil ved lagring: ' + (error instanceof Error ? error.message : 'Ukjent feil'));
    }
  };

  const updateOpptaksVei = (index: number, field: keyof OpptaksVei, value: any) => {
    if (!editedRegelsett) return;

    const updated = { ...editedRegelsett };
    if (updated.opptaksVeier) {
      updated.opptaksVeier[index] = {
        ...updated.opptaksVeier[index],
        [field]: value,
      };
      setEditedRegelsett(updated);
    }
  };

  const opprettOpptaksVei = async () => {
    if (!id || oppretterOpptaksVei) return;

    setOppretterOpptaksVei(true);
    try {
      const response = await fetch(`/api/regelsett/${id}/opptaksveier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nyOpptaksVei),
      });

      if (response.ok) {
        // Reset form og refresh data
        setNyOpptaksVei({
          navn: '',
          beskrivelse: '',
          grunnlagId: '',
          kravIds: [],
          kvoteId: '',
          rangeringId: '',
          aktiv: true,
        });

        // Refresh regelsett data
        const response = await fetch(`/api/regelsett/${id}`);
        if (response.ok) {
          const refreshedData = await response.json();
          setRegelsett(refreshedData);

          // Oppdater også editedRegelsett hvis vi er i edit mode
          if (isEditMode) {
            setEditedRegelsett(refreshedData);
          }
        }
      } else {
        const error = await response.json();
        console.error('Feil ved opprettelse av opptaksvei:', error);
        alert('Feil ved opprettelse av opptaksvei: ' + (error.error || 'Ukjent feil'));
      }
    } catch (error) {
      console.error('Feil ved opprettelse av opptaksvei:', error);
      alert('Feil ved opprettelse av opptaksvei');
    } finally {
      setOppretterOpptaksVei(false);
    }
  };

  const leggTilKrav = (kravId: string) => {
    if (!nyOpptaksVei.kravIds.includes(kravId)) {
      setNyOpptaksVei((prev) => ({
        ...prev,
        kravIds: [...prev.kravIds, kravId],
      }));
    }
  };

  const fjernKrav = (kravId: string) => {
    setNyOpptaksVei((prev) => ({
      ...prev,
      kravIds: prev.kravIds.filter((id) => id !== kravId),
    }));
  };

  const getDropdownNavn = (collection: any[], id: string) => {
    return collection.find((item) => item.id === id)?.navn || id;
  };

  const getKravNavn = (krav: string) => {
    // For seeded data (names) return as-is, for new data (IDs) get the name
    const foundById = dropdownData.kravelementer.find((item) => item.id === krav);
    if (foundById) return foundById.navn;
    return krav; // Return name directly if it's already a name
  };

  const getDropdownValue = (collection: any[], currentValue: string) => {
    // Hvis currentValue allerede er en ID (ny opptaksvei)
    const foundById = collection.find((item) => item.id === currentValue);
    if (foundById) return currentValue;

    // Hvis currentValue er et navn (gammel seeded opptaksvei), finn ID-en
    const foundByName = collection.find((item) => item.navn === currentValue);
    return foundByName ? foundByName.id : currentValue;
  };

  const currentRegelsett = isEditMode ? editedRegelsett : regelsett;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Laster regelsett...</p>
        </div>
      </div>
    );
  }

  if (!currentRegelsett) {
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
      {/* Tynn header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/regelsett">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ArrowLeft className="h-3 w-3 mr-1" />
            Tilbake
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentRegelsett.navn}</h1>
          <span className="text-xs text-muted-foreground">v{currentRegelsett.versjon}</span>
          {currentRegelsett.aktiv ? (
            <Badge variant="default" className="text-xs h-5">
              Aktiv
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs h-5">
              Inaktiv
            </Badge>
          )}
          {isEditMode && (
            <Badge variant="outline" className="text-xs h-5">
              <Edit className="h-2 w-2 mr-1" />
              Redigerer
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Beslutningstre - OpptaksVeier
                  <Badge variant="secondary">
                    {currentRegelsett.opptaksVeier?.length || 0} veier
                  </Badge>
                  {isEditMode && (
                    <Badge variant="outline" className="text-xs">
                      <Edit className="h-3 w-3 mr-1" />
                      Redigeringsmodus
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Hver vei representerer en komplett regel fra grunnlag til kvote
                </CardDescription>
              </div>

              {isEditMode ? (
                <div className="flex gap-2">
                  <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Lagre endringer
                  </Button>
                  <Button variant="outline" onClick={exitEditMode}>
                    <X className="h-4 w-4 mr-2" />
                    Avbryt
                  </Button>
                </div>
              ) : (
                <Button onClick={enterEditMode}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rediger regelsett
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Eksisterende opptaksveier */}
              {currentRegelsett.opptaksVeier && currentRegelsett.opptaksVeier.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {currentRegelsett.opptaksVeier.map((vei, index) => (
                    <div key={vei.id} className="py-8 first:pt-0 last:pb-0">
                      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                        {/* Vei-header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              {isEditMode ? (
                                <Input
                                  value={vei.navn}
                                  onChange={(e) => updateOpptaksVei(index, 'navn', e.target.value)}
                                  className="font-semibold text-lg"
                                />
                              ) : (
                                <h3 className="font-semibold text-lg">{vei.navn}</h3>
                              )}
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
                        <div className="flex items-center gap-4">
                          {/* Grunnlag */}
                          <div className="flex-1 space-y-2">
                            <div className="bg-green-100 text-green-800 rounded-lg p-3 text-center border-2 border-green-200">
                              <FileText className="h-5 w-5 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-1">GRUNNLAG</p>
                              {isEditMode ? (
                                <Select
                                  value={getDropdownValue(
                                    dropdownData.grunnlag,
                                    vei.grunnlag || ''
                                  )}
                                  onValueChange={(value) =>
                                    updateOpptaksVei(index, 'grunnlag', value)
                                  }
                                >
                                  <SelectTrigger className="text-sm font-semibold bg-white border">
                                    <SelectValue placeholder="Velg grunnlag" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dropdownData.grunnlag.map((g) => (
                                      <SelectItem key={g.id} value={g.id}>
                                        {g.navn}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="text-sm font-semibold">
                                  {getDropdownNavn(dropdownData.grunnlag, vei.grunnlag || '') ||
                                    'Ikke satt'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="hidden md:block text-gray-400">
                            <ChevronRight className="h-6 w-6" />
                          </div>

                          {/* Krav - hver krav som egen boks */}
                          <div className="flex-1 space-y-2">
                            {vei.krav.length > 0 ? (
                              vei.krav.map((krav, i) => (
                                <div
                                  key={i}
                                  className="bg-orange-100 text-orange-800 rounded-lg p-3 text-center border-2 border-orange-200"
                                >
                                  <Target className="h-4 w-4 mx-auto mb-1" />
                                  <p className="text-xs font-medium mb-1">KRAV {i + 1}</p>
                                  {isEditMode ? (
                                    <div className="flex items-center gap-2">
                                      <Select
                                        value={getDropdownValue(dropdownData.kravelementer, krav)}
                                        onValueChange={(value) => {
                                          const newKrav = [...vei.krav];
                                          newKrav[i] = value;
                                          updateOpptaksVei(index, 'krav', newKrav);
                                        }}
                                        disabled={dropdownData.loading}
                                      >
                                        <SelectTrigger className="text-sm font-semibold bg-white border">
                                          <SelectValue placeholder="Velg krav" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {dropdownData.kravelementer.map((k) => (
                                            <SelectItem key={k.id} value={k.id}>
                                              {k.navn}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <X
                                        className="h-4 w-4 cursor-pointer hover:text-red-600"
                                        onClick={() => {
                                          const newKrav = vei.krav.filter((_, idx) => idx !== i);
                                          updateOpptaksVei(index, 'krav', newKrav);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-sm font-semibold">{getKravNavn(krav)}</p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="bg-orange-100 text-orange-800 rounded-lg p-3 text-center border-2 border-orange-200">
                                <Target className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs font-medium mb-1">KRAV</p>
                                <p className="text-sm font-semibold">Ingen krav</p>
                              </div>
                            )}
                            {isEditMode && (
                              <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-3 text-center">
                                <Select
                                  onValueChange={(value) => {
                                    if (!vei.krav.includes(value)) {
                                      updateOpptaksVei(index, 'krav', [...vei.krav, value]);
                                    }
                                  }}
                                  disabled={dropdownData.loading}
                                >
                                  <SelectTrigger className="text-xs bg-white border">
                                    <SelectValue placeholder="+ Legg til nytt krav" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dropdownData.kravelementer
                                      .filter(
                                        (k) =>
                                          !vei.krav.includes(k.id) && !vei.krav.includes(k.navn)
                                      )
                                      .map((k) => (
                                        <SelectItem key={k.id} value={k.id}>
                                          {k.navn}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="hidden md:block text-gray-400">
                            <ChevronRight className="h-6 w-6" />
                          </div>

                          {/* Kvote og Rangering stacked */}
                          <div className="flex-1 space-y-2">
                            {/* Kvote */}
                            <div className="bg-purple-100 text-purple-800 rounded-lg p-3 text-center border-2 border-purple-200">
                              <Trophy className="h-4 w-4 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-1">KVOTE</p>
                              {isEditMode ? (
                                <Select
                                  value={getDropdownValue(dropdownData.kvotetyper, vei.kvote || '')}
                                  onValueChange={(value) => updateOpptaksVei(index, 'kvote', value)}
                                >
                                  <SelectTrigger className="text-sm font-semibold bg-white border">
                                    <SelectValue placeholder="Velg kvote" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dropdownData.kvotetyper.map((kv) => (
                                      <SelectItem key={kv.id} value={kv.id}>
                                        {kv.navn}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="text-sm font-semibold">
                                  {getDropdownNavn(dropdownData.kvotetyper, vei.kvote || '') ||
                                    'Ikke satt'}
                                </p>
                              )}
                            </div>

                            {/* Rangering */}
                            <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center border-2 border-blue-200">
                              <Settings className="h-4 w-4 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-1">RANGERING</p>
                              {isEditMode ? (
                                <Select
                                  value={getDropdownValue(
                                    dropdownData.rangeringstyper,
                                    vei.rangering || ''
                                  )}
                                  onValueChange={(value) =>
                                    updateOpptaksVei(index, 'rangering', value)
                                  }
                                >
                                  <SelectTrigger className="text-sm font-semibold bg-white border">
                                    <SelectValue placeholder="Velg rangering" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {dropdownData.rangeringstyper.map((rt) => (
                                      <SelectItem key={rt.id} value={rt.id}>
                                        {rt.navn}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="text-sm font-semibold">
                                  {getDropdownNavn(
                                    dropdownData.rangeringstyper,
                                    vei.rangering || ''
                                  ) || 'Ikke satt'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tom tilstand */}
              {(!currentRegelsett.opptaksVeier || currentRegelsett.opptaksVeier.length === 0) &&
                !isEditMode && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Route className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium mb-2">Ingen opptaksveier enda</h3>
                    <p className="text-sm mb-6 max-w-md mx-auto">
                      Opprett din første opptaksvei for å definere hvilke grunnlag, krav, kvoter og
                      rangeringer som skal brukes.
                    </p>
                    <Button size="lg" onClick={enterEditMode}>
                      <Plus className="h-4 w-4 mr-2" />
                      Opprett første opptaksvei
                    </Button>
                  </div>
                )}

              {/* Legg til ny vei - kun i edit mode */}
              {isEditMode && (
                <div className="py-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Opprett ny opptaksvei
                    </h3>

                    <div className="space-y-4">
                      {/* Navn og beskrivelse */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Navn *</label>
                          <Input
                            value={nyOpptaksVei.navn}
                            onChange={(e) =>
                              setNyOpptaksVei((prev) => ({ ...prev, navn: e.target.value }))
                            }
                            placeholder="f.eks. Ordinær opptaksvei"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Beskrivelse</label>
                          <Input
                            value={nyOpptaksVei.beskrivelse}
                            onChange={(e) =>
                              setNyOpptaksVei((prev) => ({ ...prev, beskrivelse: e.target.value }))
                            }
                            placeholder="Valgfri beskrivelse"
                          />
                        </div>
                      </div>

                      {/* Beslutningstre-preview */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-4">
                          {/* Grunnlag */}
                          <div className="flex-1">
                            <div className="bg-green-100 text-green-800 rounded-lg p-3 text-center border-2 border-green-200">
                              <FileText className="h-4 w-4 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-2">GRUNNLAG *</p>
                              <Select
                                value={nyOpptaksVei.grunnlagId}
                                onValueChange={(value) =>
                                  setNyOpptaksVei((prev) => ({ ...prev, grunnlagId: value }))
                                }
                                disabled={dropdownData.loading}
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg grunnlag" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.grunnlag.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>
                                      {g.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <ChevronRight className="h-6 w-6 text-gray-400" />

                          {/* Krav */}
                          <div className="flex-1 space-y-2">
                            {nyOpptaksVei.kravIds.length > 0 ? (
                              nyOpptaksVei.kravIds.map((kravId, i) => (
                                <div
                                  key={i}
                                  className="bg-orange-100 text-orange-800 rounded-lg p-3 text-center border-2 border-orange-200"
                                >
                                  <Target className="h-4 w-4 mx-auto mb-1" />
                                  <p className="text-xs font-medium mb-1">KRAV {i + 1}</p>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={kravId}
                                      onValueChange={(value) => {
                                        const newKravIds = [...nyOpptaksVei.kravIds];
                                        newKravIds[i] = value;
                                        setNyOpptaksVei((prev) => ({
                                          ...prev,
                                          kravIds: newKravIds,
                                        }));
                                      }}
                                      disabled={dropdownData.loading}
                                    >
                                      <SelectTrigger className="text-sm font-semibold bg-white border">
                                        <SelectValue placeholder="Velg krav" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {dropdownData.kravelementer.map((k) => (
                                          <SelectItem key={k.id} value={k.id}>
                                            {k.navn}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <X
                                      className="h-4 w-4 cursor-pointer hover:text-red-600"
                                      onClick={() => fjernKrav(kravId)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-orange-100 text-orange-800 rounded-lg p-3 text-center border-2 border-orange-200">
                                <Target className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs font-medium mb-1">KRAV</p>
                                <p className="text-sm font-semibold">Ingen krav</p>
                              </div>
                            )}
                            <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-3 text-center">
                              <Select onValueChange={leggTilKrav} disabled={dropdownData.loading}>
                                <SelectTrigger className="text-xs bg-white border">
                                  <SelectValue placeholder="+ Legg til nytt krav" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.kravelementer
                                    .filter((k) => !nyOpptaksVei.kravIds.includes(k.id))
                                    .map((k) => (
                                      <SelectItem key={k.id} value={k.id}>
                                        {k.navn}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <ChevronRight className="h-6 w-6 text-gray-400" />

                          {/* Kvote og Rangering */}
                          <div className="flex-1 space-y-2">
                            {/* Kvote */}
                            <div className="bg-purple-100 text-purple-800 rounded-lg p-3 text-center border-2 border-purple-200">
                              <Trophy className="h-4 w-4 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-2">KVOTE *</p>
                              <Select
                                value={nyOpptaksVei.kvoteId}
                                onValueChange={(value) =>
                                  setNyOpptaksVei((prev) => ({ ...prev, kvoteId: value }))
                                }
                                disabled={dropdownData.loading}
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg kvote" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.kvotetyper.map((kv) => (
                                    <SelectItem key={kv.id} value={kv.id}>
                                      {kv.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Rangering */}
                            <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center border-2 border-blue-200">
                              <Settings className="h-4 w-4 mx-auto mb-1" />
                              <p className="text-xs font-medium mb-2">RANGERING *</p>
                              <Select
                                value={nyOpptaksVei.rangeringId}
                                onValueChange={(value) =>
                                  setNyOpptaksVei((prev) => ({ ...prev, rangeringId: value }))
                                }
                                disabled={dropdownData.loading}
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg rangering" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.rangeringstyper.map((rt) => (
                                    <SelectItem key={rt.id} value={rt.id}>
                                      {rt.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Opprett knapp */}
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={opprettOpptaksVei}
                          disabled={
                            !nyOpptaksVei.navn ||
                            !nyOpptaksVei.grunnlagId ||
                            !nyOpptaksVei.kvoteId ||
                            !nyOpptaksVei.rangeringId ||
                            oppretterOpptaksVei ||
                            dropdownData.loading
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {oppretterOpptaksVei ? 'Oppretter...' : 'Opprett opptaksvei'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
