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
        fetchData(); // Refresh data
      } else {
        console.error('Feil ved opprettelse av faggruppe');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av faggruppe:', error);
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
                          <Button variant="outline" size="sm" title="Se fagkoder">
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Rediger">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Slett">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {fagkoder.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
