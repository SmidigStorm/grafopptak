'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, FileText, Target, Trophy, Edit, Trash2, Calculator } from 'lucide-react';

interface Kravelement {
  id: string;
  navn: string;
  type: string;
  beskrivelse?: string;
  aktiv: boolean;
}

interface Grunnlag {
  id: string;
  navn: string;
  type: string;
  beskrivelse?: string;
  aktiv: boolean;
}

interface KvoteType {
  id: string;
  navn: string;
  type: string;
  beskrivelse?: string;
  aktiv: boolean;
}

interface RangeringType {
  id: string;
  navn: string;
  type: string;
  formelMal?: string;
  beskrivelse?: string;
  aktiv: boolean;
}

interface PoengType {
  id: string;
  navn: string;
  type: string;
  beskrivelse?: string;
  beregningsmåte?: string;
  aktiv: boolean;
}

export default function RegelbyggingPage() {
  const [kravelementer, setKravelementer] = useState<Kravelement[]>([]);
  const [grunnlag, setGrunnlag] = useState<Grunnlag[]>([]);
  const [kvotetyper, setKvotetyper] = useState<KvoteType[]>([]);
  const [rangeringstyper, setRangeringstyper] = useState<RangeringType[]>([]);
  const [poengtyper, setPoengtyper] = useState<PoengType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNyKravelement, setShowNyKravelement] = useState(false);
  const [showEditKravelement, setShowEditKravelement] = useState(false);
  const [selectedKravelement, setSelectedKravelement] = useState<Kravelement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: string;
    id: string;
    navn: string;
  } | null>(null);
  const [nyKravelement, setNyKravelement] = useState({
    navn: '',
    type: '',
    beskrivelse: '',
  });

  const fetchAllData = async () => {
    try {
      const [kravelementerRes, grunnlagRes, kvotetypeRes, rangeringstypeRes, poengtypeRes] =
        await Promise.all([
          fetch('/api/kravelementer'),
          fetch('/api/grunnlag'),
          fetch('/api/kvotetyper'),
          fetch('/api/rangeringstyper'),
          fetch('/api/poengtyper'),
        ]);

      const [kravelementerData, grunnlagData, kvotetypeData, rangeringstypeData, poengtypeData] =
        await Promise.all([
          kravelementerRes.json(),
          grunnlagRes.json(),
          kvotetypeRes.json(),
          rangeringstypeRes.json(),
          poengtypeRes.json(),
        ]);

      setKravelementer(kravelementerData);
      setGrunnlag(grunnlagData);
      setKvotetyper(kvotetypeData);
      setRangeringstyper(rangeringstypeData);
      setPoengtyper(poengtypeData);
    } catch (error) {
      console.error('Feil ved henting av data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const opprettKravelement = async () => {
    try {
      const response = await fetch('/api/kravelementer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nyKravelement),
      });

      if (response.ok) {
        setShowNyKravelement(false);
        setNyKravelement({ navn: '', type: '', beskrivelse: '' });
        fetchAllData();
      } else {
        console.error('Feil ved opprettelse av kravelement');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av kravelement:', error);
    }
  };

  const oppdaterKravelement = async () => {
    if (!selectedKravelement) return;

    try {
      const response = await fetch(`/api/kravelementer/${selectedKravelement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedKravelement),
      });

      if (response.ok) {
        setShowEditKravelement(false);
        setSelectedKravelement(null);
        fetchAllData();
      } else {
        console.error('Feil ved oppdatering av kravelement');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av kravelement:', error);
    }
  };

  const slettKravelement = async (id: string) => {
    try {
      const response = await fetch(`/api/kravelementer/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAllData();
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved sletting av kravelement');
      }
    } catch (error) {
      console.error('Feil ved sletting av kravelement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regelbygging</h1>
          <p className="text-muted-foreground">
            Bygg og administrer regelsett-elementer for opptakskrav
          </p>
        </div>
      </div>

      <Tabs defaultValue="grunnlag" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grunnlag" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Grunnlag
          </TabsTrigger>
          <TabsTrigger value="kravelementer" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Kravelementer
          </TabsTrigger>
          <TabsTrigger value="kvotetyper" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Kvotetyper
          </TabsTrigger>
          <TabsTrigger value="rangering" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Rangering
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grunnlag" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grunnlag</CardTitle>
                  <CardDescription>
                    Standard grunnlag for opptak (f.eks. &quot;Vitnemål videregående&quot;,
                    &quot;Fagbrev&quot;)
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nytt grunnlag
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Laster grunnlag...</p>
                </div>
              ) : grunnlag.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Ingen grunnlag funnet</p>
                  <p className="text-sm">Opprett ditt første grunnlag for å komme i gang</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Beskrivelse</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grunnlag.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.navn}</TableCell>
                        <TableCell className="font-mono text-sm">{item.type}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.beskrivelse || '-'}
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kravelementer" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Kravelementer</CardTitle>
                  <CardDescription>
                    Standard krav som kan brukes i regelsett (f.eks. &quot;Matematikk R1-nivå&quot;,
                    &quot;Politiattest&quot;)
                  </CardDescription>
                </div>
                <Dialog open={showNyKravelement} onOpenChange={setShowNyKravelement}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nytt kravelement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Opprett nytt kravelement</DialogTitle>
                      <DialogDescription>
                        Legg til et nytt kravelement i systemet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="kravelement-navn" className="text-right">
                          Navn
                        </Label>
                        <Input
                          id="kravelement-navn"
                          value={nyKravelement.navn}
                          onChange={(e) =>
                            setNyKravelement({ ...nyKravelement, navn: e.target.value })
                          }
                          className="col-span-3"
                          placeholder="f.eks. Matematikk R1-nivå"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="kravelement-type" className="text-right">
                          Type
                        </Label>
                        <Input
                          id="kravelement-type"
                          value={nyKravelement.type}
                          onChange={(e) =>
                            setNyKravelement({ ...nyKravelement, type: e.target.value })
                          }
                          className="col-span-3"
                          placeholder="f.eks. matematikk-r1"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="kravelement-beskrivelse" className="text-right">
                          Beskrivelse
                        </Label>
                        <Textarea
                          id="kravelement-beskrivelse"
                          value={nyKravelement.beskrivelse}
                          onChange={(e) =>
                            setNyKravelement({ ...nyKravelement, beskrivelse: e.target.value })
                          }
                          className="col-span-3"
                          placeholder="Valgfri beskrivelse"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={opprettKravelement}
                        disabled={!nyKravelement.navn || !nyKravelement.type}
                      >
                        Opprett kravelement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Laster kravelementer...</p>
                </div>
              ) : kravelementer.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Ingen kravelementer funnet</p>
                  <p className="text-sm">Opprett ditt første kravelement for å komme i gang</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Beskrivelse</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kravelementer.map((kravelement) => (
                      <TableRow key={kravelement.id}>
                        <TableCell className="font-medium">{kravelement.navn}</TableCell>
                        <TableCell className="font-mono text-sm">{kravelement.type}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {kravelement.beskrivelse || '-'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              kravelement.aktiv
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {kravelement.aktiv ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              title="Rediger"
                              onClick={() => {
                                setSelectedKravelement(kravelement);
                                setShowEditKravelement(true);
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
                                  type: 'kravelement',
                                  id: kravelement.id,
                                  navn: kravelement.navn,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kvotetyper" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Kvotetyper</CardTitle>
                  <CardDescription>
                    Standard kvotetyper (f.eks. &quot;Ordinær kvote&quot;,
                    &quot;Førstegangsvitnemål&quot;)
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ny kvotetype
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Laster kvotetyper...</p>
                </div>
              ) : kvotetyper.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Ingen kvotetyper funnet</p>
                  <p className="text-sm">Opprett din første kvotetype for å komme i gang</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Beskrivelse</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kvotetyper.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.navn}</TableCell>
                        <TableCell className="font-mono text-sm">{item.type}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.beskrivelse || '-'}
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rangering" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rangeringstyper */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Rangeringstyper
                    </CardTitle>
                    <CardDescription>Rangeringsformler som bruker poengtypene</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ny
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Laster rangeringstyper...</p>
                  </div>
                ) : rangeringstyper.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Ingen rangeringstyper funnet</p>
                    <p className="text-sm">Opprett din første rangeringstype</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rangeringstyper.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.navn}</h4>
                            <p className="text-sm text-muted-foreground font-mono">{item.type}</p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.aktiv
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.aktiv ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </div>
                        {item.formelMal && (
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs font-mono text-gray-700">{item.formelMal}</p>
                          </div>
                        )}
                        {item.beskrivelse && (
                          <p className="text-sm text-muted-foreground">{item.beskrivelse}</p>
                        )}
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Poengtypene */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Poengtypene
                    </CardTitle>
                    <CardDescription>
                      Ulike poengtyper som brukes i rangeringsformler
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ny
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Laster poengtypene...</p>
                  </div>
                ) : poengtyper.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Ingen poengtypene funnet</p>
                    <p className="text-sm">Opprett din første poengtype</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Group by type */}
                    {['dokumentbasert', 'tilleggspoeng', 'manuell'].map((kategori) => {
                      const kategoriPoeng = poengtyper.filter((p) => p.type === kategori);
                      if (kategoriPoeng.length === 0) return null;

                      return (
                        <div key={kategori} className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground capitalize">
                            {kategori}
                          </h5>
                          <div className="space-y-2">
                            {kategoriPoeng.map((item) => (
                              <div key={item.id} className="border rounded-lg p-3 space-y-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">{item.navn}</h4>
                                    {item.beregningsmåte && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {item.beregningsmåte}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                      item.aktiv
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {item.aktiv ? 'Aktiv' : 'Inaktiv'}
                                  </span>
                                </div>
                                <div className="flex space-x-1 pt-1">
                                  <Button variant="outline" size="sm" className="h-6 px-2">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-6 px-2">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Kravelement Dialog */}
      <Dialog open={showEditKravelement} onOpenChange={setShowEditKravelement}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rediger kravelement</DialogTitle>
            <DialogDescription>Oppdater informasjon om kravelementet.</DialogDescription>
          </DialogHeader>
          {selectedKravelement && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kravelement-navn" className="text-right">
                  Navn
                </Label>
                <Input
                  id="edit-kravelement-navn"
                  value={selectedKravelement.navn}
                  onChange={(e) =>
                    setSelectedKravelement({ ...selectedKravelement, navn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kravelement-type" className="text-right">
                  Type
                </Label>
                <Input
                  id="edit-kravelement-type"
                  value={selectedKravelement.type}
                  onChange={(e) =>
                    setSelectedKravelement({ ...selectedKravelement, type: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kravelement-beskrivelse" className="text-right">
                  Beskrivelse
                </Label>
                <Textarea
                  id="edit-kravelement-beskrivelse"
                  value={selectedKravelement.beskrivelse || ''}
                  onChange={(e) =>
                    setSelectedKravelement({ ...selectedKravelement, beskrivelse: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-kravelement-aktiv" className="text-right">
                  Aktiv
                </Label>
                <Switch
                  id="edit-kravelement-aktiv"
                  checked={selectedKravelement.aktiv}
                  onCheckedChange={(checked) =>
                    setSelectedKravelement({ ...selectedKravelement, aktiv: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={oppdaterKravelement}
              disabled={!selectedKravelement?.navn || !selectedKravelement?.type}
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
              Dette vil permanent slette {deleteConfirm?.type} &quot;{deleteConfirm?.navn}&quot;.
              Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === 'kravelement') {
                  slettKravelement(deleteConfirm.id);
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
