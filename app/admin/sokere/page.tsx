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
import { Plus, Edit, Trash2, Users, FileText } from 'lucide-react';
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
import DokumentasjonModal from '@/components/dokumentasjon-modal';
import { formatDate } from '@/lib/utils';

interface Soker {
  id: string;
  fornavn: string;
  etternavn: string;
  fodselsdato?: string;
  fodselsnummer?: string;
  epost: string;
  telefon?: string;
  adresse?: string;
  postnummer?: string;
  poststed?: string;
  statsborgerskap: string;
  aktiv: boolean;
  antallDokumenter: number;
  antallSøknader: number;
}

export default function SokerePage() {
  const [sokere, setSokere] = useState<Soker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNySoker, setShowNySoker] = useState(false);
  const [showEditSoker, setShowEditSoker] = useState(false);
  const [selectedSoker, setSelectedSoker] = useState<Soker | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    navn: string;
  } | null>(null);
  const [showDokumentasjon, setShowDokumentasjon] = useState<{
    sokerId: string;
    sokerNavn: string;
  } | null>(null);
  const [nySoker, setNySoker] = useState({
    fornavn: '',
    etternavn: '',
    fodselsdato: '',
    fodselsnummer: '',
    epost: '',
    telefon: '',
    adresse: '',
    postnummer: '',
    poststed: '',
    statsborgerskap: 'Norge',
  });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sokere');
      const data = await response.json();
      setSokere(data);
    } catch (error) {
      console.error('Feil ved henting av søkere:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const opprettSoker = async () => {
    try {
      const response = await fetch('/api/sokere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nySoker),
      });

      if (response.ok) {
        setShowNySoker(false);
        setNySoker({
          fornavn: '',
          etternavn: '',
          fodselsdato: '',
          fodselsnummer: '',
          epost: '',
          telefon: '',
          adresse: '',
          postnummer: '',
          poststed: '',
          statsborgerskap: 'Norge',
        });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved opprettelse av søker');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av søker:', error);
    }
  };

  const oppdaterSoker = async () => {
    if (!selectedSoker) return;

    try {
      const response = await fetch(`/api/sokere/${selectedSoker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedSoker),
      });

      if (response.ok) {
        setShowEditSoker(false);
        setSelectedSoker(null);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved oppdatering av søker');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av søker:', error);
    }
  };

  const slettSoker = async (id: string) => {
    try {
      const response = await fetch(`/api/sokere/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved sletting av søker');
      }
    } catch (error) {
      console.error('Feil ved sletting av søker:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Søkere</h1>
            <p className="text-muted-foreground">Administrer søkere</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Søkere</h1>
          <p className="text-muted-foreground">Administrer søkere</p>
        </div>
        <Dialog open={showNySoker} onOpenChange={setShowNySoker}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny søker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Opprett ny søker</DialogTitle>
              <DialogDescription>Legg til en ny søker i systemet.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fornavn" className="text-right col-span-1">
                    Fornavn *
                  </Label>
                  <Input
                    id="fornavn"
                    value={nySoker.fornavn}
                    onChange={(e) => setNySoker({ ...nySoker, fornavn: e.target.value })}
                    className="col-span-3"
                    placeholder="Fornavn"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="etternavn" className="text-right col-span-1">
                    Etternavn *
                  </Label>
                  <Input
                    id="etternavn"
                    value={nySoker.etternavn}
                    onChange={(e) => setNySoker({ ...nySoker, etternavn: e.target.value })}
                    className="col-span-3"
                    placeholder="Etternavn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="epost" className="text-right">
                  E-post *
                </Label>
                <Input
                  id="epost"
                  type="email"
                  value={nySoker.epost}
                  onChange={(e) => setNySoker({ ...nySoker, epost: e.target.value })}
                  className="col-span-3"
                  placeholder="post@eksempel.no"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fodselsdato" className="text-right col-span-1">
                    Fødselsdato
                  </Label>
                  <Input
                    id="fodselsdato"
                    type="date"
                    value={nySoker.fodselsdato}
                    onChange={(e) => setNySoker({ ...nySoker, fodselsdato: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefon" className="text-right col-span-1">
                    Telefon
                  </Label>
                  <Input
                    id="telefon"
                    value={nySoker.telefon}
                    onChange={(e) => setNySoker({ ...nySoker, telefon: e.target.value })}
                    className="col-span-3"
                    placeholder="12345678"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fodselsnummer" className="text-right">
                  Fødselsnummer
                </Label>
                <Input
                  id="fodselsnummer"
                  value={nySoker.fodselsnummer}
                  onChange={(e) => setNySoker({ ...nySoker, fodselsnummer: e.target.value })}
                  className="col-span-3"
                  placeholder="11 siffer"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adresse" className="text-right">
                  Adresse
                </Label>
                <Textarea
                  id="adresse"
                  value={nySoker.adresse}
                  onChange={(e) => setNySoker({ ...nySoker, adresse: e.target.value })}
                  className="col-span-3"
                  placeholder="Gateadresse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postnummer" className="text-right col-span-1">
                    Postnummer
                  </Label>
                  <Input
                    id="postnummer"
                    value={nySoker.postnummer}
                    onChange={(e) => setNySoker({ ...nySoker, postnummer: e.target.value })}
                    className="col-span-3"
                    placeholder="0000"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="poststed" className="text-right col-span-1">
                    Poststed
                  </Label>
                  <Input
                    id="poststed"
                    value={nySoker.poststed}
                    onChange={(e) => setNySoker({ ...nySoker, poststed: e.target.value })}
                    className="col-span-3"
                    placeholder="Sted"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="statsborgerskap" className="text-right">
                  Statsborgerskap
                </Label>
                <Input
                  id="statsborgerskap"
                  value={nySoker.statsborgerskap}
                  onChange={(e) => setNySoker({ ...nySoker, statsborgerskap: e.target.value })}
                  className="col-span-3"
                  placeholder="Norge"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={opprettSoker}
                disabled={!nySoker.fornavn || !nySoker.etternavn || !nySoker.epost}
              >
                Opprett søker
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Søkere
          </CardTitle>
          <CardDescription>Oversikt over alle registrerte søkere</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Dokumenter</TableHead>
                <TableHead>Søknader</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sokere.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Ingen søkere funnet
                  </TableCell>
                </TableRow>
              ) : (
                sokere.map((soker) => (
                  <TableRow key={soker.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {soker.fornavn} {soker.etternavn}
                        </div>
                        {soker.fodselsdato && (
                          <div className="text-sm text-muted-foreground">
                            Født: {formatDate(soker.fodselsdato)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{soker.epost}</TableCell>
                    <TableCell>
                      {soker.telefon || <span className="text-muted-foreground">Ikke angitt</span>}
                    </TableCell>
                    <TableCell>{soker.antallDokumenter}</TableCell>
                    <TableCell>{soker.antallSøknader}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          soker.aktiv
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {soker.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Vis dokumentasjon"
                          onClick={() =>
                            setShowDokumentasjon({
                              sokerId: soker.id,
                              sokerNavn: `${soker.fornavn} ${soker.etternavn}`,
                            })
                          }
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Rediger"
                          onClick={() => {
                            setSelectedSoker(soker);
                            setShowEditSoker(true);
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
                              id: soker.id,
                              navn: `${soker.fornavn} ${soker.etternavn}`,
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
      <Dialog open={showEditSoker} onOpenChange={setShowEditSoker}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rediger søker</DialogTitle>
            <DialogDescription>Oppdater informasjon om søkeren.</DialogDescription>
          </DialogHeader>
          {selectedSoker && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-fornavn" className="text-right col-span-1">
                    Fornavn *
                  </Label>
                  <Input
                    id="edit-fornavn"
                    value={selectedSoker.fornavn}
                    onChange={(e) =>
                      setSelectedSoker({ ...selectedSoker, fornavn: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-etternavn" className="text-right col-span-1">
                    Etternavn *
                  </Label>
                  <Input
                    id="edit-etternavn"
                    value={selectedSoker.etternavn}
                    onChange={(e) =>
                      setSelectedSoker({ ...selectedSoker, etternavn: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-epost" className="text-right">
                  E-post *
                </Label>
                <Input
                  id="edit-epost"
                  type="email"
                  value={selectedSoker.epost}
                  onChange={(e) => setSelectedSoker({ ...selectedSoker, epost: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-telefon" className="text-right col-span-1">
                    Telefon
                  </Label>
                  <Input
                    id="edit-telefon"
                    value={selectedSoker.telefon || ''}
                    onChange={(e) =>
                      setSelectedSoker({ ...selectedSoker, telefon: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-statsborgerskap" className="text-right col-span-1">
                    Statsborgerskap
                  </Label>
                  <Input
                    id="edit-statsborgerskap"
                    value={selectedSoker.statsborgerskap}
                    onChange={(e) =>
                      setSelectedSoker({ ...selectedSoker, statsborgerskap: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-aktiv" className="text-right">
                  Aktiv
                </Label>
                <Switch
                  id="edit-aktiv"
                  checked={selectedSoker.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedSoker({ ...selectedSoker, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={oppdaterSoker}
              disabled={
                !selectedSoker?.fornavn || !selectedSoker?.etternavn || !selectedSoker?.epost
              }
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
              Dette vil permanent slette søkeren &quot;{deleteConfirm?.navn}&quot; og alle
              tilknyttede data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  slettSoker(deleteConfirm.id);
                }
                setDeleteConfirm(null);
              }}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dokumentasjon Modal */}
      {showDokumentasjon && (
        <DokumentasjonModal
          isOpen={!!showDokumentasjon}
          onClose={() => setShowDokumentasjon(null)}
          sokerId={showDokumentasjon.sokerId}
          sokerNavn={showDokumentasjon.sokerNavn}
        />
      )}
    </div>
  );
}
