'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, GripVertical } from 'lucide-react';

interface PoengType {
  id: string;
  navn: string;
  beskrivelse?: string;
  type: string;
  aktiv: boolean;
}

interface RangeringType {
  id?: string;
  navn: string;
  type: string;
  formelMal?: string;
  beskrivelse?: string;
  aktiv: boolean;
  poengTyper?: PoengType[];
}

interface RangeringsTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeringsType?: RangeringType;
  onSave: (rangeringsType: RangeringType) => void;
}

const poengTypeColors = {
  karaktersnitt: 'bg-blue-100 text-blue-800 border-blue-200',
  tilleggspoeng: 'bg-green-100 text-green-800 border-green-200',
  erfaring: 'bg-purple-100 text-purple-800 border-purple-200',
  kompetanse: 'bg-orange-100 text-orange-800 border-orange-200',
  annet: 'bg-gray-100 text-gray-800 border-gray-200',
};

const getPoengTypeColor = (type: string) => {
  return poengTypeColors[type as keyof typeof poengTypeColors] || poengTypeColors.annet;
};

const generateFormelPreview = (poengTyper: PoengType[]) => {
  if (poengTyper.length === 0) return 'Ingen poengtyper valgt';
  if (poengTyper.length === 1) return poengTyper[0].navn;

  const formler = poengTyper.map((pt) => pt.navn);
  return formler.join(' + ');
};

export default function RangeringsTypeModal({
  isOpen,
  onClose,
  rangeringsType,
  onSave,
}: RangeringsTypeModalProps) {
  const [formData, setFormData] = useState<RangeringType>({
    navn: '',
    type: '',
    beskrivelse: '',
    aktiv: true,
    poengTyper: [],
  });
  const [tilgjengeligePoengTyper, setTilgjengeligePoengTyper] = useState<PoengType[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedPoengType, setDraggedPoengType] = useState<PoengType | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPoengTyper();
      if (rangeringsType) {
        setFormData(rangeringsType);
      } else {
        setFormData({
          navn: '',
          type: '',
          beskrivelse: '',
          aktiv: true,
          poengTyper: [],
        });
      }
    }
  }, [isOpen, rangeringsType]);

  const fetchPoengTyper = async () => {
    try {
      const response = await fetch('/api/poengtyper');
      const data = await response.json();
      setTilgjengeligePoengTyper(data.filter((pt: PoengType) => pt.aktiv));
    } catch (error) {
      console.error('Feil ved henting av poengtyper:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.navn.trim() || !formData.type.trim()) {
      alert('Navn og type er påkrevd');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Feil ved lagring:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, poengType: PoengType) => {
    setDraggedPoengType(poengType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPoengType) return;

    // Sjekk om poengtype allerede er lagt til
    const erAlleredeValgt = formData.poengTyper?.some((pt) => pt.id === draggedPoengType.id);
    if (erAlleredeValgt) {
      setDraggedPoengType(null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      poengTyper: [...(prev.poengTyper || []), draggedPoengType],
    }));
    setDraggedPoengType(null);
  };

  const fjernPoengType = (poengTypeId: string) => {
    setFormData((prev) => ({
      ...prev,
      poengTyper: prev.poengTyper?.filter((pt) => pt.id !== poengTypeId) || [],
    }));
  };

  const tilgjengeligePoengTyperFiltrert = tilgjengeligePoengTyper.filter(
    (pt) => !formData.poengTyper?.some((vpt) => vpt.id === pt.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rangeringsType ? 'Rediger rangeringstype' : 'Ny rangeringstype'}
          </DialogTitle>
          <DialogDescription>
            Konfigurer rangeringstype ved å dra poengtyper fra høyre side inn i rangeringstypen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Grunnleggende informasjon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="navn">Navn</Label>
              <Input
                id="navn"
                value={formData.navn}
                onChange={(e) => setFormData((prev) => ({ ...prev, navn: e.target.value }))}
                placeholder="F.eks. Ordinær rangering med tilleggspoeng"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="F.eks. ordinær-tilleggspoeng"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="beskrivelse">Beskrivelse</Label>
            <Textarea
              id="beskrivelse"
              value={formData.beskrivelse || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, beskrivelse: e.target.value }))}
              placeholder="Beskriv hvordan denne rangeringstypen fungerer..."
            />
          </div>

          {/* Hovedseksjon med drag & drop */}
          <div className="grid grid-cols-2 gap-6">
            {/* Venstre side - RangeringType (drop-zone) */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Rangeringstype sammensetning</Label>
                <p className="text-sm text-muted-foreground">
                  Dra poengtyper hit for å bygge opp rangeringstypen
                </p>
              </div>

              <div
                className="min-h-[200px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 bg-muted/10"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {formData.poengTyper && formData.poengTyper.length > 0 ? (
                  <div className="space-y-3">
                    {formData.poengTyper.map((poengType) => (
                      <Card key={poengType.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <CardTitle className="text-sm">{poengType.navn}</CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fjernPoengType(poengType.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Badge className={getPoengTypeColor(poengType.type)}>
                            {poengType.type}
                          </Badge>
                          {poengType.beskrivelse && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {poengType.beskrivelse}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Dra poengtyper hit for å bygge rangeringstypen</p>
                  </div>
                )}
              </div>

              {/* Live preview av formel */}
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-sm font-medium">Formel preview:</Label>
                <p className="text-sm font-mono text-muted-foreground mt-1">
                  {generateFormelPreview(formData.poengTyper || [])}
                </p>
              </div>
            </div>

            {/* Høyre side - Tilgjengelige PoengTyper */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Tilgjengelige poengtyper</Label>
                <p className="text-sm text-muted-foreground">
                  Dra poengtyper til venstre for å inkludere dem
                </p>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {tilgjengeligePoengTyperFiltrert.length > 0 ? (
                  tilgjengeligePoengTyperFiltrert.map((poengType) => (
                    <Card
                      key={poengType.id}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, poengType)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{poengType.navn}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Badge className={getPoengTypeColor(poengType.type)}>
                          {poengType.type}
                        </Badge>
                        {poengType.beskrivelse && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {poengType.beskrivelse}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="text-sm">Alle poengtyper er allerede valgt</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Lagrer...' : 'Lagre'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
