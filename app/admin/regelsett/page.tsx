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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Settings, Edit, Eye } from 'lucide-react';
import Link from 'next/link';

interface Regelsett {
  id: string;
  navn: string;
  versjon: string;
  gyldigFra: string;
  gyldigTil?: string;
  beskrivelse?: string;
  aktiv: boolean;
  opprettet: string;
}

export default function RegelsettPage() {
  const [regelsett, setRegelsett] = useState<Regelsett[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyttRegelsett, setShowNyttRegelsett] = useState(false);
  const [nyttRegelsett, setNyttRegelsett] = useState({
    navn: '',
    versjon: '1.0',
    beskrivelse: '',
  });

  const fetchRegelsett = async () => {
    try {
      const response = await fetch('/api/regelsett');
      const data = await response.json();

      // Sjekk om data er et array, hvis ikke sett tom array
      if (Array.isArray(data)) {
        setRegelsett(data);
      } else {
        console.error('Uventet respons fra API:', data);
        setRegelsett([]);
      }
    } catch (error) {
      console.error('Feil ved henting av regelsett:', error);
      setRegelsett([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegelsett();
  }, []);

  const opprettRegelsett = async () => {
    try {
      const response = await fetch('/api/regelsett', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nyttRegelsett,
          gyldigFra: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        setShowNyttRegelsett(false);
        setNyttRegelsett({ navn: '', versjon: '1.0', beskrivelse: '' });
        fetchRegelsett();
      } else {
        console.error('Feil ved opprettelse av regelsett');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av regelsett:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regelsett</h1>
          <p className="text-muted-foreground">Administrer regelsett for utdanningstilbud</p>
        </div>
        <Dialog open={showNyttRegelsett} onOpenChange={setShowNyttRegelsett}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nytt regelsett
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Opprett nytt regelsett</DialogTitle>
              <DialogDescription>
                Opprett et nytt regelsett for et utdanningstilbud.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="regelsett-navn" className="text-right">
                  Navn
                </Label>
                <Input
                  id="regelsett-navn"
                  value={nyttRegelsett.navn}
                  onChange={(e) => setNyttRegelsett({ ...nyttRegelsett, navn: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. Regelsett for Bachelor i sykepleie"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="regelsett-versjon" className="text-right">
                  Versjon
                </Label>
                <Input
                  id="regelsett-versjon"
                  value={nyttRegelsett.versjon}
                  onChange={(e) => setNyttRegelsett({ ...nyttRegelsett, versjon: e.target.value })}
                  className="col-span-3"
                  placeholder="f.eks. 1.0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="regelsett-beskrivelse" className="text-right">
                  Beskrivelse
                </Label>
                <Textarea
                  id="regelsett-beskrivelse"
                  value={nyttRegelsett.beskrivelse}
                  onChange={(e) =>
                    setNyttRegelsett({ ...nyttRegelsett, beskrivelse: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Valgfri beskrivelse"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={opprettRegelsett}
                disabled={!nyttRegelsett.navn || !nyttRegelsett.versjon}
              >
                Opprett regelsett
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle regelsett</CardTitle>
          <CardDescription>Oversikt over alle opprettede regelsett i systemet</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Laster regelsett...</p>
            </div>
          ) : regelsett.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Ingen regelsett funnet</p>
              <p className="text-sm">Opprett ditt første regelsett for å komme i gang</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Versjon</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Gyldig fra</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regelsett.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.navn}</TableCell>
                    <TableCell className="font-mono text-sm">{item.versjon}</TableCell>
                    <TableCell className="text-sm">
                      {item.erMal ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          📋 Mal: {item.malType}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          📄 Konkret
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(item.gyldigFra).toLocaleDateString('nb-NO')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.beskrivelse || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.aktiv
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/regelsett/${item.id}`}>
                          <Button variant="outline" size="sm" title="Vis regelsett">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/regelsett/${item.id}/edit`}>
                          <Button variant="outline" size="sm" title="Rediger regelsett">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
