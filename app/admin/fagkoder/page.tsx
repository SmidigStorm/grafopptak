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
import { Plus, Edit, Link as LinkIcon, Trash2 } from 'lucide-react';
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

interface Fagkode {
  id: string;
  kode: string;
  navn: string;
  beskrivelse?: string;
  aktiv: boolean;
  gyldigFra: string;
  gyldigTil?: string;
}

interface Faggruppe {
  id: string;
  navn: string;
  beskrivelse?: string;
  type?: string;
  aktiv: boolean;
  antallFagkoder: number;
}

export default function FagkoderPage() {
  const [fagkoder, setFagkoder] = useState<Fagkode[]>([]);
  const [faggrupper, setFaggrupper] = useState<Faggruppe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyFagkode, setShowNyFagkode] = useState(false);
  const [showNyFaggruppe, setShowNyFaggruppe] = useState(false);
  const [showEditFagkode, setShowEditFagkode] = useState(false);
  const [showEditFaggruppe, setShowEditFaggruppe] = useState(false);
  const [selectedFagkode, setSelectedFagkode] = useState<Fagkode | null>(null);
  const [selectedFaggruppe, setSelectedFaggruppe] = useState<Faggruppe | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'fagkode' | 'faggruppe';
    id: string;
    navn: string;
  } | null>(null);
  const [nyFagkode, setNyFagkode] = useState({
    kode: '',
    navn: '',
    beskrivelse: '',
  });
  const [nyFaggruppe, setNyFaggruppe] = useState({
    navn: '',
    beskrivelse: '',
    type: '',
  });

  const fetchData = async () => {
    try {
      const [fagkoderRes, faggrupperRes] = await Promise.all([
        fetch('/api/fagkoder'),
        fetch('/api/faggrupper'),
      ]);

      const fagkoderData = await fagkoderRes.json();
      const faggrupperData = await faggrupperRes.json();

      setFagkoder(fagkoderData);
      setFaggrupper(faggrupperData);
    } catch (error) {
      console.error('Feil ved henting av data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const opprettFagkode = async () => {
    try {
      const response = await fetch('/api/fagkoder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nyFagkode),
      });

      if (response.ok) {
        setShowNyFagkode(false);
        setNyFagkode({ kode: '', navn: '', beskrivelse: '' });
        fetchData(); // Refresh data
      } else {
        console.error('Feil ved opprettelse av fagkode');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av fagkode:', error);
    }
  };

  const opprettFaggruppe = async () => {
    try {
      const response = await fetch('/api/faggrupper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nyFaggruppe),
      });

      if (response.ok) {
        setShowNyFaggruppe(false);
        setNyFaggruppe({ navn: '', beskrivelse: '', type: '' });
        fetchData();
      } else {
        console.error('Feil ved opprettelse av faggruppe');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av faggruppe:', error);
    }
  };

  const oppdaterFagkode = async () => {
    if (!selectedFagkode) return;

    try {
      const response = await fetch(`/api/fagkoder/${selectedFagkode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedFagkode),
      });

      if (response.ok) {
        setShowEditFagkode(false);
        setSelectedFagkode(null);
        fetchData();
      } else {
        console.error('Feil ved oppdatering av fagkode');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av fagkode:', error);
    }
  };

  const oppdaterFaggruppe = async () => {
    if (!selectedFaggruppe) return;

    try {
      const response = await fetch(`/api/faggrupper/${selectedFaggruppe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedFaggruppe),
      });

      if (response.ok) {
        setShowEditFaggruppe(false);
        setSelectedFaggruppe(null);
        fetchData();
      } else {
        console.error('Feil ved oppdatering av faggruppe');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av faggruppe:', error);
    }
  };

  const slettFagkode = async (id: string) => {
    try {
      const response = await fetch(`/api/fagkoder/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Feil ved sletting av fagkode');
      }
    } catch (error) {
      console.error('Feil ved sletting av fagkode:', error);
    }
  };

  const slettFaggruppe = async (id: string) => {
    try {
      const response = await fetch(`/api/faggrupper/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved sletting av faggruppe');
      }
    } catch (error) {
      console.error('Feil ved sletting av faggruppe:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fagkoder</h1>
            <p className="text-muted-foreground">Administrer fagkoder og faggrupper</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Fagkoder</h1>
          <p className="text-muted-foreground">Administrer fagkoder og faggrupper</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showNyFaggruppe} onOpenChange={setShowNyFaggruppe}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ny faggruppe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Opprett ny faggruppe</DialogTitle>
                <DialogDescription>Legg til en ny faggruppe i systemet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faggruppe-navn" className="text-right">
                    Navn
                  </Label>
                  <Input
                    id="faggruppe-navn"
                    value={nyFaggruppe.navn}
                    onChange={(e) => setNyFaggruppe({ ...nyFaggruppe, navn: e.target.value })}
                    className="col-span-3"
                    placeholder="f.eks. Matematikk R1-nivå"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faggruppe-type" className="text-right">
                    Type
                  </Label>
                  <Input
                    id="faggruppe-type"
                    value={nyFaggruppe.type}
                    onChange={(e) => setNyFaggruppe({ ...nyFaggruppe, type: e.target.value })}
                    className="col-span-3"
                    placeholder="f.eks. matematikk"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faggruppe-beskrivelse" className="text-right">
                    Beskrivelse
                  </Label>
                  <Input
                    id="faggruppe-beskrivelse"
                    value={nyFaggruppe.beskrivelse}
                    onChange={(e) =>
                      setNyFaggruppe({ ...nyFaggruppe, beskrivelse: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Valgfri beskrivelse"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={opprettFaggruppe} disabled={!nyFaggruppe.navn}>
                  Opprett faggruppe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showNyFagkode} onOpenChange={setShowNyFagkode}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ny fagkode
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Opprett ny fagkode</DialogTitle>
                <DialogDescription>Legg til en ny fagkode i systemet.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kode" className="text-right">
                    Kode
                  </Label>
                  <Input
                    id="kode"
                    value={nyFagkode.kode}
                    onChange={(e) => setNyFagkode({ ...nyFagkode, kode: e.target.value })}
                    className="col-span-3"
                    placeholder="f.eks. MAT1014-R1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="navn" className="text-right">
                    Navn
                  </Label>
                  <Input
                    id="navn"
                    value={nyFagkode.navn}
                    onChange={(e) => setNyFagkode({ ...nyFagkode, navn: e.target.value })}
                    className="col-span-3"
                    placeholder="f.eks. Matematikk R1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="beskrivelse" className="text-right">
                    Beskrivelse
                  </Label>
                  <Input
                    id="beskrivelse"
                    value={nyFagkode.beskrivelse}
                    onChange={(e) => setNyFagkode({ ...nyFagkode, beskrivelse: e.target.value })}
                    className="col-span-3"
                    placeholder="Valgfri beskrivelse"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={opprettFagkode}
                  disabled={!nyFagkode.kode || !nyFagkode.navn}
                >
                  Opprett fagkode
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Faggrupper</CardTitle>
            <CardDescription>Grupper av fagkoder som kvalifiserer for samme krav</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faggruppe</TableHead>
                  <TableHead>Antall fagkoder</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faggrupper.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Ingen faggrupper funnet
                    </TableCell>
                  </TableRow>
                ) : (
                  faggrupper.map((faggruppe) => (
                    <TableRow key={faggruppe.id}>
                      <TableCell className="font-medium">{faggruppe.navn}</TableCell>
                      <TableCell>{faggruppe.antallFagkoder}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Rediger"
                            onClick={() => {
                              setSelectedFaggruppe(faggruppe);
                              setShowEditFaggruppe(true);
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
                                type: 'faggruppe',
                                id: faggruppe.id,
                                navn: faggruppe.navn,
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

        <Card>
          <CardHeader>
            <CardTitle>Fagkoder</CardTitle>
            <CardDescription>Individuelle fagkoder fra vitnemål</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Navn</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fagkoder.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Ingen fagkoder funnet
                    </TableCell>
                  </TableRow>
                ) : (
                  fagkoder.map((fagkode) => (
                    <TableRow key={fagkode.id}>
                      <TableCell className="font-mono">{fagkode.kode}</TableCell>
                      <TableCell>{fagkode.navn}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fagkode.aktiv
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {fagkode.aktiv ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Rediger"
                            onClick={() => {
                              setSelectedFagkode(fagkode);
                              setShowEditFagkode(true);
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
                                type: 'fagkode',
                                id: fagkode.id,
                                navn: fagkode.navn,
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
      </div>

      {/* Edit Fagkode Dialog */}
      <Dialog open={showEditFagkode} onOpenChange={setShowEditFagkode}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rediger fagkode</DialogTitle>
            <DialogDescription>Oppdater informasjon om fagkoden.</DialogDescription>
          </DialogHeader>
          {selectedFagkode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kode" className="text-right">
                  Kode
                </Label>
                <Input
                  id="edit-kode"
                  value={selectedFagkode.kode}
                  onChange={(e) => setSelectedFagkode({ ...selectedFagkode, kode: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-navn" className="text-right">
                  Navn
                </Label>
                <Input
                  id="edit-navn"
                  value={selectedFagkode.navn}
                  onChange={(e) => setSelectedFagkode({ ...selectedFagkode, navn: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-beskrivelse" className="text-right">
                  Beskrivelse
                </Label>
                <Textarea
                  id="edit-beskrivelse"
                  value={selectedFagkode.beskrivelse || ''}
                  onChange={(e) =>
                    setSelectedFagkode({ ...selectedFagkode, beskrivelse: e.target.value })
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
                  checked={selectedFagkode.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedFagkode({ ...selectedFagkode, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={oppdaterFagkode}
              disabled={!selectedFagkode?.kode || !selectedFagkode?.navn}
            >
              Lagre endringer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Faggruppe Dialog */}
      <Dialog open={showEditFaggruppe} onOpenChange={setShowEditFaggruppe}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rediger faggruppe</DialogTitle>
            <DialogDescription>Oppdater informasjon om faggruppen.</DialogDescription>
          </DialogHeader>
          {selectedFaggruppe && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fg-navn" className="text-right">
                  Navn
                </Label>
                <Input
                  id="edit-fg-navn"
                  value={selectedFaggruppe.navn}
                  onChange={(e) =>
                    setSelectedFaggruppe({ ...selectedFaggruppe, navn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fg-type" className="text-right">
                  Type
                </Label>
                <Input
                  id="edit-fg-type"
                  value={selectedFaggruppe.type || ''}
                  onChange={(e) =>
                    setSelectedFaggruppe({ ...selectedFaggruppe, type: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fg-beskrivelse" className="text-right">
                  Beskrivelse
                </Label>
                <Textarea
                  id="edit-fg-beskrivelse"
                  value={selectedFaggruppe.beskrivelse || ''}
                  onChange={(e) =>
                    setSelectedFaggruppe({ ...selectedFaggruppe, beskrivelse: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fg-aktiv" className="text-right">
                  Aktiv
                </Label>
                <Switch
                  id="edit-fg-aktiv"
                  checked={selectedFaggruppe.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedFaggruppe({ ...selectedFaggruppe, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={oppdaterFaggruppe} disabled={!selectedFaggruppe?.navn}>
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
              Dette vil permanent slette{' '}
              {deleteConfirm?.type === 'fagkode' ? 'fagkoden' : 'faggruppen'} &quot;
              {deleteConfirm?.navn}&quot;.
              {deleteConfirm?.type === 'faggruppe' && (
                <span className="block mt-2 font-semibold">
                  Merk: Du kan ikke slette en faggruppe som har tilknyttede fagkoder.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === 'fagkode') {
                  slettFagkode(deleteConfirm.id);
                } else if (deleteConfirm?.type === 'faggruppe') {
                  slettFaggruppe(deleteConfirm.id);
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
