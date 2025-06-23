'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Settings, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  antallOpptaksVeier?: number;
}

export default function RegelsettPage() {
  const router = useRouter();
  const [regelsett, setRegelsett] = useState<Regelsett[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyttRegelsett, setShowNyttRegelsett] = useState(false);
  const [oppretterRegelsett, setOppretterRegelsett] = useState(false);
  const [nyttRegelsett, setNyttRegelsett] = useState({
    navn: '',
    versjon: '1.0',
    beskrivelse: '',
    erMal: false,
    malType: '',
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
    setOppretterRegelsett(true);
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
        const nyttRegelsetData = await response.json();
        setShowNyttRegelsett(false);
        setNyttRegelsett({ navn: '', versjon: '1.0', beskrivelse: '', erMal: false, malType: '' });

        // Redirect direkte til regelbygging (edit mode)
        router.push(`/admin/regelsett/${nyttRegelsetData.id}?edit=true`);
      } else {
        console.error('Feil ved opprettelse av regelsett');
        setOppretterRegelsett(false);
      }
    } catch (error) {
      console.error('Feil ved opprettelse av regelsett:', error);
      setOppretterRegelsett(false);
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
                Opprett et nytt regelsett som kan knyttes til utdanningstilbud. Du kan lage en
                gjenbrukbar mal eller et konkret regelsett.
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

              {/* Mal eller konkret regelsett */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Type</Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="er-mal"
                      checked={nyttRegelsett.erMal}
                      onCheckedChange={(checked) =>
                        setNyttRegelsett({
                          ...nyttRegelsett,
                          erMal: !!checked,
                          malType: checked ? nyttRegelsett.malType : '',
                        })
                      }
                    />
                    <Label htmlFor="er-mal" className="text-sm font-normal">
                      Dette er en mal (kan gjenbrukes for flere utdanningstilbud)
                    </Label>
                  </div>

                  {nyttRegelsett.erMal && (
                    <Select
                      value={nyttRegelsett.malType}
                      onValueChange={(value) =>
                        setNyttRegelsett({ ...nyttRegelsett, malType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velg mal-type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor-programmer</SelectItem>
                        <SelectItem value="master">Master-programmer</SelectItem>
                        <SelectItem value="phd">PhD-programmer</SelectItem>
                        <SelectItem value="yrkesfaglig">Yrkesfaglige utdanninger</SelectItem>
                        <SelectItem value="helse">Helse og omsorg</SelectItem>
                        <SelectItem value="teknologi">Teknologi og ingeniør</SelectItem>
                        <SelectItem value="samfunn">Samfunn og økonomi</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
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
                  placeholder="Valgfri beskrivelse av regelsettet"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={opprettRegelsett}
                disabled={!nyttRegelsett.navn || !nyttRegelsett.versjon || oppretterRegelsett}
              >
                {oppretterRegelsett ? 'Oppretter...' : 'Opprett og bygg regler'}
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
                  <TableHead>OpptaksVeier</TableHead>
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
                        <Badge variant="info">📋 Mal: {item.malType || 'Ukjent'}</Badge>
                      ) : (
                        <Badge variant="secondary">📄 Konkret</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="default">🛣️ {item.antallOpptaksVeier || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatNeo4jDate(item.gyldigFra)}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.beskrivelse || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={item.aktiv ? 'success' : 'warning'}>
                        {item.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/regelsett/${item.id}`}>
                          <Button variant="outline" size="sm" title="Vis regelsett">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/regelsett/${item.id}?edit=true`}>
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
