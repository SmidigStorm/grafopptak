'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, X, BookOpen, GraduationCap, Link2, AlertCircle } from 'lucide-react';

interface Fagkode {
  id: string;
  kode: string;
  navn: string;
  type: string;
  omfang?: string;
  aktiv: boolean;
}

interface Kravelement {
  id: string;
  navn: string;
  type: string;
  beskrivelse?: string;
  aktiv: boolean;
}

interface KravelementMedFagkoder extends Kravelement {
  fagkoder: Fagkode[];
}

const getTypeVariant = (type: string) => {
  switch (type) {
    case 'spesifikk-fagkrav':
      return 'info';
    case 'generell-studiekompetanse':
      return 'success';
    case 'arbeidserfaring':
      return 'warning';
    case 'sprakkunnskaper':
      return 'default';
    default:
      return 'secondary';
  }
};

export default function KravOgFagkoderPage() {
  const [kravelementer, setKravelementer] = useState<KravelementMedFagkoder[]>([]);
  const [alleFagkoder, setAlleFagkoder] = useState<Fagkode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKravelement, setSelectedKravelement] = useState<KravelementMedFagkoder | null>(
    null
  );
  const [showAddFagkode, setShowAddFagkode] = useState(false);
  const [availableFagkoder, setAvailableFagkoder] = useState<Fagkode[]>([]);
  const [fagkodeSearch, setFagkodeSearch] = useState('');

  const fetchData = async () => {
    try {
      const [kravelementerRes, fagkoderRes] = await Promise.all([
        fetch('/api/kravelementer'),
        fetch('/api/fagkoder'),
      ]);

      const kravelementerData = await kravelementerRes.json();
      const fagkoderData = await fagkoderRes.json();

      // Hent fagkoder for hvert kravelement
      const kravelementerMedFagkoder = await Promise.all(
        kravelementerData.map(async (krav: Kravelement) => {
          const fagkoderForKravRes = await fetch(`/api/kravelementer/${krav.id}/fagkoder`);
          const fagkoderForKravData = await fagkoderForKravRes.json();
          return {
            ...krav,
            fagkoder: fagkoderForKravData.fagkoder || [],
          };
        })
      );

      setKravelementer(kravelementerMedFagkoder);
      setAlleFagkoder(fagkoderData);
    } catch (error) {
      console.error('Feil ved henting av data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddFagkodeDialog = (krav: KravelementMedFagkoder) => {
    setSelectedKravelement(krav);
    // Filtrer bort fagkoder som allerede kvalifiserer
    const eksisterendeFagkodeIds = krav.fagkoder.map((fk) => fk.id);
    const tilgjengelige = alleFagkoder.filter(
      (fk) => !eksisterendeFagkodeIds.includes(fk.id) && fk.aktiv
    );
    setAvailableFagkoder(tilgjengelige);
    setFagkodeSearch('');
    setShowAddFagkode(true);
  };

  const addFagkodeToKrav = async (fagkodeId: string) => {
    if (!selectedKravelement) return;

    try {
      const response = await fetch(`/api/kravelementer/${selectedKravelement.id}/fagkoder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fagkodeId }),
      });

      if (response.ok) {
        setShowAddFagkode(false);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved tilkobling av fagkode');
      }
    } catch (error) {
      console.error('Error adding fagkode:', error);
      alert('Feil ved tilkobling av fagkode');
    }
  };

  const removeFagkodeFromKrav = async (kravId: string, fagkodeId: string) => {
    try {
      const response = await fetch(`/api/kravelementer/${kravId}/fagkoder`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fagkodeId }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Feil ved fjerning av fagkode');
      }
    } catch (error) {
      console.error('Error removing fagkode:', error);
      alert('Feil ved fjerning av fagkode');
    }
  };

  // Filtrer kun fagkrav som kan kvalifiseres av fagkoder
  const relevantTypes = ['spesifikk-fagkrav', 'generell-studiekompetanse'];

  const filteredKravelementer = kravelementer.filter(
    (krav) =>
      relevantTypes.includes(krav.type) &&
      (krav.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        krav.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFagkoder = availableFagkoder.filter(
    (fk) =>
      fk.navn.toLowerCase().includes(fagkodeSearch.toLowerCase()) ||
      fk.kode.toLowerCase().includes(fagkodeSearch.toLowerCase())
  );

  // Removed getTypeColor - using getTypeVariant instead

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fagkrav og Kvalifikasjoner</h1>
            <p className="text-muted-foreground">
              Administrer hvilke fagkoder som kvalifiserer for faglige opptakskrav
            </p>
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
          <h1 className="text-3xl font-bold tracking-tight">Fagkrav og Kvalifikasjoner</h1>
          <p className="text-muted-foreground">
            Administrer hvilke fagkoder som kvalifiserer for faglige opptakskrav
          </p>
        </div>
      </div>

      {/* Søk */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søk i fagkrav..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary">{filteredKravelementer.length} fagkrav</Badge>
      </div>

      {/* Kravelementer grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredKravelementer.map((krav) => (
          <Card key={krav.id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-6">{krav.navn}</CardTitle>
                  <Badge variant={getTypeVariant(krav.type)}>{krav.type}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => openAddFagkodeDialog(krav)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {krav.beskrivelse && (
                <CardDescription className="text-sm">{krav.beskrivelse}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Link2 className="h-4 w-4" />
                  Kvalifiserende fagkoder ({krav.fagkoder.length})
                </div>

                {krav.fagkoder.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Ingen fagkoder kvalifiserer ennå
                  </div>
                ) : (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {krav.fagkoder.map((fagkode) => (
                      <div
                        key={fagkode.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <BookOpen className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
                            {fagkode.kode}
                          </span>
                          <span className="truncate">{fagkode.navn}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFagkodeFromKrav(krav.id, fagkode.id)}
                          className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Fagkode Dialog */}
      <Dialog open={showAddFagkode} onOpenChange={setShowAddFagkode}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Legg til kvalifiserende fagkode</DialogTitle>
            <DialogDescription>
              Velg fagkoder som skal kvalifisere for &quot;{selectedKravelement?.navn}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Søk i fagkoder */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Søk i fagkoder..."
                value={fagkodeSearch}
                onChange={(e) => setFagkodeSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Fagkoder liste */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {filteredFagkoder.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {fagkodeSearch
                    ? 'Ingen fagkoder matcher søket'
                    : 'Alle tilgjengelige fagkoder er allerede lagt til'}
                </div>
              ) : (
                filteredFagkoder.map((fagkode) => (
                  <div
                    key={fagkode.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addFagkodeToKrav(fagkode.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {fagkode.kode}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {fagkode.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-900 truncate">{fagkode.navn}</div>
                        {fagkode.omfang && (
                          <div className="text-xs text-gray-500">{fagkode.omfang}</div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFagkode(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
