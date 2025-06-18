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
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
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

interface Institusjon {
  id: string;
  navn: string;
  kortNavn?: string;
  type: string;
  institusjonsnummer?: string;
  adresse?: string;
  nettside?: string;
  aktiv: boolean;
  antallUtdanningstilbud: number;
}

const INSTITUSJONSTYPER = [
  'Universitet',
  'Høgskole',
  'Faghøgskole',
  'Privat høgskole',
  'Videregående skole',
  'Annet',
];

export default function InstitusjonsPage() {
  const [institusjoner, setInstitusjoner] = useState<Institusjon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyInstitusjon, setShowNyInstitusjon] = useState(false);
  const [showEditInstitusjon, setShowEditInstitusjon] = useState(false);
  const [selectedInstitusjon, setSelectedInstitusjon] = useState<Institusjon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    navn: string;
  } | null>(null);
  const [nyInstitusjon, setNyInstitusjon] = useState({
    navn: '',
    kortNavn: '',
    type: '',
    institusjonsnummer: '',
    adresse: '',
    nettside: '',
  });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/institusjoner');
      const data = await response.json();
      setInstitusjoner(data);
    } catch (error) {
      console.error('Feil ved henting av institusjoner:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const opprettInstitusjon = async () => {
    try {
      const response = await fetch('/api/institusjoner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nyInstitusjon),
      });

      if (response.ok) {
        setShowNyInstitusjon(false);
        setNyInstitusjon({
          navn: '',
          kortNavn: '',
          type: '',
          institusjonsnummer: '',
          adresse: '',
          nettside: '',
        });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved opprettelse av institusjon');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av institusjon:', error);
    }
  };

  const oppdaterInstitusjon = async () => {
    if (!selectedInstitusjon) return;

    try {
      const response = await fetch(`/api/institusjoner/${selectedInstitusjon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedInstitusjon),
      });

      if (response.ok) {
        setShowEditInstitusjon(false);
        setSelectedInstitusjon(null);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved oppdatering av institusjon');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av institusjon:', error);
    }
  };

  const slettInstitusjon = async (id: string) => {
    try {
      const response = await fetch(`/api/institusjoner/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved sletting av institusjon');
      }
    } catch (error) {
      console.error('Feil ved sletting av institusjon:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Institusjoner</h1>
            <p className="text-muted-foreground">Administrer utdanningsinstitusjoner</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Institusjoner</h1>
          <p className="text-muted-foreground">Administrer utdanningsinstitusjoner</p>
        </div>
        <Dialog open={showNyInstitusjon} onOpenChange={setShowNyInstitusjon}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny institusjon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Opprett ny institusjon</DialogTitle>
              <DialogDescription>
                Legg til en ny utdanningsinstitusjon i systemet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="navn" className="text-right">
                  Navn *
                </Label>
                <Input
                  id="navn"
                  value={nyInstitusjon.navn}
                  onChange={(e) => setNyInstitusjon({ ...nyInstitusjon, navn: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. Universitetet i Oslo"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kortNavn" className="text-right">
                  Kort navn
                </Label>
                <Input
                  id="kortNavn"
                  value={nyInstitusjon.kortNavn}
                  onChange={(e) => setNyInstitusjon({ ...nyInstitusjon, kortNavn: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. UiO"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type *
                </Label>
                <Select
                  value={nyInstitusjon.type}
                  onValueChange={(value) => setNyInstitusjon({ ...nyInstitusjon, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Velg institusjonstype" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUSJONSTYPER.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institusjonsnummer" className="text-right">
                  Institusjonsnummer
                </Label>
                <Input
                  id="institusjonsnummer"
                  value={nyInstitusjon.institusjonsnummer}
                  onChange={(e) =>
                    setNyInstitusjon({ ...nyInstitusjon, institusjonsnummer: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="f.eks. 0150"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adresse" className="text-right">
                  Adresse
                </Label>
                <Textarea
                  id="adresse"
                  value={nyInstitusjon.adresse}
                  onChange={(e) => setNyInstitusjon({ ...nyInstitusjon, adresse: e.target.value })}
                  className="col-span-3"
                  placeholder="Postadresse"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nettside" className="text-right">
                  Nettside
                </Label>
                <Input
                  id="nettside"
                  value={nyInstitusjon.nettside}
                  onChange={(e) => setNyInstitusjon({ ...nyInstitusjon, nettside: e.target.value })}
                  className="col-span-3"
                  placeholder="https://www.uio.no"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={opprettInstitusjon}
                disabled={!nyInstitusjon.navn || !nyInstitusjon.type}
              >
                Opprett institusjon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Institusjoner
          </CardTitle>
          <CardDescription>Oversikt over alle registrerte utdanningsinstitusjoner</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Utdanningstilbud</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institusjoner.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Ingen institusjoner funnet
                  </TableCell>
                </TableRow>
              ) : (
                institusjoner.map((institusjon) => (
                  <TableRow key={institusjon.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{institusjon.navn}</div>
                        {institusjon.kortNavn && (
                          <div className="text-sm text-muted-foreground">
                            {institusjon.kortNavn}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{institusjon.type}</TableCell>
                    <TableCell>{institusjon.antallUtdanningstilbud}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          institusjon.aktiv
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {institusjon.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Rediger"
                          onClick={() => {
                            setSelectedInstitusjon(institusjon);
                            setShowEditInstitusjon(true);
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
                              id: institusjon.id,
                              navn: institusjon.navn,
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

      {/* Edit Institusjon Dialog */}
      <Dialog open={showEditInstitusjon} onOpenChange={setShowEditInstitusjon}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rediger institusjon</DialogTitle>
            <DialogDescription>Oppdater informasjon om institusjonen.</DialogDescription>
          </DialogHeader>
          {selectedInstitusjon && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-navn" className="text-right">
                  Navn *
                </Label>
                <Input
                  id="edit-navn"
                  value={selectedInstitusjon.navn}
                  onChange={(e) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, navn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kortNavn" className="text-right">
                  Kort navn
                </Label>
                <Input
                  id="edit-kortNavn"
                  value={selectedInstitusjon.kortNavn || ''}
                  onChange={(e) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, kortNavn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type *
                </Label>
                <Select
                  value={selectedInstitusjon.type}
                  onValueChange={(value) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUSJONSTYPER.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-institusjonsnummer" className="text-right">
                  Institusjonsnummer
                </Label>
                <Input
                  id="edit-institusjonsnummer"
                  value={selectedInstitusjon.institusjonsnummer || ''}
                  onChange={(e) =>
                    setSelectedInstitusjon({
                      ...selectedInstitusjon,
                      institusjonsnummer: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-adresse" className="text-right">
                  Adresse
                </Label>
                <Textarea
                  id="edit-adresse"
                  value={selectedInstitusjon.adresse || ''}
                  onChange={(e) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, adresse: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nettside" className="text-right">
                  Nettside
                </Label>
                <Input
                  id="edit-nettside"
                  value={selectedInstitusjon.nettside || ''}
                  onChange={(e) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, nettside: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-aktiv" className="text-right">
                  Aktiv
                </Label>
                <Switch
                  id="edit-aktiv"
                  checked={selectedInstitusjon.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedInstitusjon({ ...selectedInstitusjon, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={oppdaterInstitusjon}
              disabled={!selectedInstitusjon?.navn || !selectedInstitusjon?.type}
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
              Dette vil permanent slette institusjonen &quot;{deleteConfirm?.navn}&quot; og alle
              tilknyttede data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  slettInstitusjon(deleteConfirm.id);
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
