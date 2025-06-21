'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Settings,
  Link,
  Unlink,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Utdanningstilbud {
  id: string;
  navn: string;
  studienivaa: string;
  studiepoeng?: number;
  varighet?: string;
  semester?: string;
  aar?: number;
  studiested?: string;
  undervisningssprak: string;
  maxAntallStudenter?: number;
  beskrivelse?: string;
  aktiv: boolean;
  institusjonNavn?: string;
  antallRegelsett: number;
}

interface Institusjon {
  id: string;
  navn: string;
}

interface Regelsett {
  id: string;
  navn: string;
  beskrivelse?: string;
  type: string;
}

interface RegelsettMal {
  id: string;
  navn: string;
  beskrivelse?: string;
  malType: string;
}

const STUDIENIVAA = ['Videregående', 'Fagskole', 'Bachelor', 'Master', 'PhD', 'Årsstudium', 'Kurs'];

const SEMESTRE = ['Høst', 'Vår', 'Begge'];

const UNDERVISNINGSSPRAK = ['Norsk', 'Engelsk', 'Tysk', 'Fransk', 'Annet'];

export default function UtdanningstilbudPage() {
  const router = useRouter();
  const [utdanningstilbud, setUtdanningstilbud] = useState<Utdanningstilbud[]>([]);
  const [institusjoner, setInstitusjoner] = useState<Institusjon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyTilbud, setShowNyTilbud] = useState(false);
  const [showEditTilbud, setShowEditTilbud] = useState(false);
  const [selectedTilbud, setSelectedTilbud] = useState<Utdanningstilbud | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    navn: string;
  } | null>(null);

  // Regelsett-maler for opprettelse
  const [regelssettMaler, setRegelssettMaler] = useState<RegelsettMal[]>([]);
  const [nyTilbud, setNyTilbud] = useState({
    navn: '',
    studienivaa: '',
    studiepoeng: '',
    varighet: '',
    semester: '',
    aar: '',
    studiested: '',
    undervisningssprak: 'Norsk',
    maxAntallStudenter: '',
    beskrivelse: '',
    institusjonId: '',
    regelssettMalId: '',
  });

  const fetchData = async () => {
    try {
      const [tilbudRes, institusjonerRes, regelssettMalerRes] = await Promise.all([
        fetch('/api/utdanningstilbud'),
        fetch('/api/institusjoner'),
        fetch('/api/regelsett?maler=true'),
      ]);

      const tilbudData = await tilbudRes.json();
      const institusjonerData = await institusjonerRes.json();
      const regelssettMalerData = await regelssettMalerRes.json();

      setUtdanningstilbud(tilbudData);
      setInstitusjoner(institusjonerData);
      setRegelssettMaler(regelssettMalerData);
    } catch (error) {
      console.error('Feil ved henting av data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const opprettTilbud = async () => {
    try {
      const payload = {
        ...nyTilbud,
        studiepoeng: nyTilbud.studiepoeng ? parseInt(nyTilbud.studiepoeng) : null,
        aar: nyTilbud.aar ? parseInt(nyTilbud.aar) : null,
        maxAntallStudenter: nyTilbud.maxAntallStudenter
          ? parseInt(nyTilbud.maxAntallStudenter)
          : null,
        institusjonId: nyTilbud.institusjonId || null,
      };

      const response = await fetch('/api/utdanningstilbud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowNyTilbud(false);
        setNyTilbud({
          navn: '',
          studienivaa: '',
          studiepoeng: '',
          varighet: '',
          semester: '',
          aar: '',
          studiested: '',
          undervisningssprak: 'Norsk',
          maxAntallStudenter: '',
          beskrivelse: '',
          institusjonId: '',
          regelssettMalId: '',
        });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved opprettelse av utdanningstilbud');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av utdanningstilbud:', error);
    }
  };

  const oppdaterTilbud = async () => {
    if (!selectedTilbud) return;

    try {
      const response = await fetch(`/api/utdanningstilbud/${selectedTilbud.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTilbud),
      });

      if (response.ok) {
        setShowEditTilbud(false);
        setSelectedTilbud(null);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved oppdatering av utdanningstilbud');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av utdanningstilbud:', error);
    }
  };

  const slettTilbud = async (id: string) => {
    try {
      const response = await fetch(`/api/utdanningstilbud/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved sletting av utdanningstilbud');
      }
    } catch (error) {
      console.error('Feil ved sletting av utdanningstilbud:', error);
    }
  };

  // Regelsett-administrasjon funksjoner
  const aapneRegelssettAdministrasjon = (tilbud: Utdanningstilbud) => {
    router.push('/admin/regelsett');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utdanningstilbud</h1>
            <p className="text-muted-foreground">Administrer utdanningstilbud</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p>Laster data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utdanningstilbud</h1>
          <p className="text-muted-foreground">Administrer utdanningstilbud</p>
        </div>
        <Dialog open={showNyTilbud} onOpenChange={setShowNyTilbud}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nytt tilbud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Opprett nytt utdanningstilbud</DialogTitle>
              <DialogDescription>Legg til et nytt utdanningstilbud i systemet.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="navn" className="text-right">
                  Navn *
                </Label>
                <Input
                  id="navn"
                  value={nyTilbud.navn}
                  onChange={(e) => setNyTilbud({ ...nyTilbud, navn: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. Bachelor i informatikk"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studienivaa" className="text-right">
                  Studienivå *
                </Label>
                <Select
                  value={nyTilbud.studienivaa}
                  onValueChange={(value) => setNyTilbud({ ...nyTilbud, studienivaa: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Velg studienivå" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDIENIVAA.map((nivaa) => (
                      <SelectItem key={nivaa} value={nivaa}>
                        {nivaa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institusjon" className="text-right">
                  Institusjon
                </Label>
                <Select
                  value={nyTilbud.institusjonId}
                  onValueChange={(value) => setNyTilbud({ ...nyTilbud, institusjonId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Velg institusjon (valgfritt)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ingen institusjon</SelectItem>
                    {institusjoner.map((institusjon) => (
                      <SelectItem key={institusjon.id} value={institusjon.id}>
                        {institusjon.navn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="studiepoeng" className="text-right col-span-2">
                    Studiepoeng
                  </Label>
                  <Input
                    id="studiepoeng"
                    type="number"
                    value={nyTilbud.studiepoeng}
                    onChange={(e) => setNyTilbud({ ...nyTilbud, studiepoeng: e.target.value })}
                    className="col-span-2"
                    placeholder="180"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="varighet" className="text-right col-span-2">
                    Varighet
                  </Label>
                  <Input
                    id="varighet"
                    value={nyTilbud.varighet}
                    onChange={(e) => setNyTilbud({ ...nyTilbud, varighet: e.target.value })}
                    className="col-span-2"
                    placeholder="3 år"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semester" className="text-right col-span-2">
                    Semester
                  </Label>
                  <Select
                    value={nyTilbud.semester}
                    onValueChange={(value) => setNyTilbud({ ...nyTilbud, semester: value })}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Velg" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTRE.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aar" className="text-right col-span-2">
                    År
                  </Label>
                  <Input
                    id="aar"
                    type="number"
                    value={nyTilbud.aar}
                    onChange={(e) => setNyTilbud({ ...nyTilbud, aar: e.target.value })}
                    className="col-span-2"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studiested" className="text-right">
                  Studiested
                </Label>
                <Input
                  id="studiested"
                  value={nyTilbud.studiested}
                  onChange={(e) => setNyTilbud({ ...nyTilbud, studiested: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. Oslo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="undervisningssprak" className="text-right col-span-2">
                    Språk
                  </Label>
                  <Select
                    value={nyTilbud.undervisningssprak}
                    onValueChange={(value) =>
                      setNyTilbud({ ...nyTilbud, undervisningssprak: value })
                    }
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNDERVISNINGSSPRAK.map((sprak) => (
                        <SelectItem key={sprak} value={sprak}>
                          {sprak}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxStudenter" className="text-right col-span-2">
                    Max studenter
                  </Label>
                  <Input
                    id="maxStudenter"
                    type="number"
                    value={nyTilbud.maxAntallStudenter}
                    onChange={(e) =>
                      setNyTilbud({ ...nyTilbud, maxAntallStudenter: e.target.value })
                    }
                    className="col-span-2"
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="beskrivelse" className="text-right">
                  Beskrivelse
                </Label>
                <Textarea
                  id="beskrivelse"
                  value={nyTilbud.beskrivelse}
                  onChange={(e) => setNyTilbud({ ...nyTilbud, beskrivelse: e.target.value })}
                  className="col-span-3"
                  placeholder="Valgfri beskrivelse av studiet"
                />
              </div>

              {/* Regelsett-mal seksjon */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Regelsett (valgfritt)</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="regelsett-mal" className="text-right">
                    Regelsett-mal
                  </Label>
                  <Select
                    value={nyTilbud.regelssettMalId}
                    onValueChange={(value) => setNyTilbud({ ...nyTilbud, regelssettMalId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ingen mal (opprett manuelt senere)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ingen mal</SelectItem>
                      {regelssettMaler.map((mal) => (
                        <SelectItem key={mal.id} value={mal.id}>
                          {mal.navn} {mal.beskrivelse && `- ${mal.beskrivelse}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {nyTilbud.regelssettMalId && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground pl-[calc(25%+1rem)]">
                      ✓ Et regelsett vil bli opprettet automatisk basert på valgt mal
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={opprettTilbud}
                disabled={!nyTilbud.navn || !nyTilbud.studienivaa}
              >
                Opprett tilbud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Utdanningstilbud
          </CardTitle>
          <CardDescription>Oversikt over alle registrerte utdanningstilbud</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Studienivå</TableHead>
                <TableHead>Institusjon</TableHead>
                <TableHead>Regelsett</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utdanningstilbud.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Ingen utdanningstilbud funnet
                  </TableCell>
                </TableRow>
              ) : (
                utdanningstilbud.map((tilbud) => (
                  <TableRow key={tilbud.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tilbud.navn}</div>
                        {tilbud.beskrivelse && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {tilbud.beskrivelse}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{tilbud.studienivaa}</TableCell>
                    <TableCell>
                      {tilbud.institusjonNavn || (
                        <span className="text-muted-foreground">Ikke angitt</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tilbud.antallRegelsett > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Har regelsett
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Mangler regelsett
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tilbud.aktiv
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tilbud.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title={
                            tilbud.antallRegelsett > 0 ? 'Rediger regelsett' : 'Opprett regelsett'
                          }
                          onClick={() => aapneRegelssettAdministrasjon(tilbud)}
                        >
                          {tilbud.antallRegelsett > 0 ? (
                            <Edit className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Rediger"
                          onClick={() => {
                            setSelectedTilbud(tilbud);
                            setShowEditTilbud(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Slett"
                          onClick={() =>
                            setDeleteConfirm({
                              id: tilbud.id,
                              navn: tilbud.navn,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditTilbud} onOpenChange={setShowEditTilbud}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rediger utdanningstilbud</DialogTitle>
            <DialogDescription>Oppdater informasjon om utdanningstilbudet.</DialogDescription>
          </DialogHeader>
          {selectedTilbud && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-navn" className="text-right">
                  Navn *
                </Label>
                <Input
                  id="edit-navn"
                  value={selectedTilbud.navn}
                  onChange={(e) => setSelectedTilbud({ ...selectedTilbud, navn: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-studienivaa" className="text-right">
                  Studienivå *
                </Label>
                <Select
                  value={selectedTilbud.studienivaa}
                  onValueChange={(value) =>
                    setSelectedTilbud({ ...selectedTilbud, studienivaa: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDIENIVAA.map((nivaa) => (
                      <SelectItem key={nivaa} value={nivaa}>
                        {nivaa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-aktiv" className="text-right">
                  Aktiv
                </Label>
                <Switch
                  id="edit-aktiv"
                  checked={selectedTilbud.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedTilbud({ ...selectedTilbud, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={oppdaterTilbud}
              disabled={!selectedTilbud?.navn || !selectedTilbud?.studienivaa}
            >
              Lagre endringer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil permanent slette utdanningstilbudet &quot;{deleteConfirm?.navn}&quot; og
              alle tilknyttede data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  slettTilbud(deleteConfirm.id);
                }
                setDeleteConfirm(null);
              }}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
