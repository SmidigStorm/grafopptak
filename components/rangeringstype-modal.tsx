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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

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

const getPoengTypeColor = (type: string) => {
  switch (type) {
    case 'dokumentbasert':
      return 'bg-blue-100 text-blue-800';
    case 'tilleggspoeng':
      return 'bg-green-100 text-green-800';
    case 'automatisk':
      return 'bg-purple-100 text-purple-800';
    case 'manuell':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
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

  const handlePoengTypeToggle = (poengType: PoengType, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        poengTyper: [...(prev.poengTyper || []), poengType],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        poengTyper: prev.poengTyper?.filter((pt) => pt.id !== poengType.id) || [],
      }));
    }
  };

  const isPoengTypeSelected = (poengTypeId: string) => {
    return formData.poengTyper?.some((pt) => pt.id === poengTypeId) || false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {rangeringsType ? 'Rediger rangeringstype' : 'Ny rangeringstype'}
          </DialogTitle>
          <DialogDescription>
            Konfigurer rangeringstype og velg hvilke poengtyper som skal inkluderes.
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
                placeholder="F.eks. Skolepoeng"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="F.eks. skolepoeng"
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
              rows={2}
            />
          </div>

          {/* Poengtyper med checkboxer */}
          <div>
            <Label className="text-base font-medium">Poengtyper</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Velg hvilke poengtyper som skal inkluderes i rangeringstypen
            </p>

            <div className="grid grid-cols-2 gap-3 border rounded-md p-4">
              {tilgjengeligePoengTyper.map((poengType) => (
                <div
                  key={poengType.id}
                  className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50"
                >
                  <Checkbox
                    id={`poengtype-${poengType.id}`}
                    checked={isPoengTypeSelected(poengType.id)}
                    onCheckedChange={(checked) =>
                      handlePoengTypeToggle(poengType, checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Label
                        htmlFor={`poengtype-${poengType.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {poengType.navn}
                      </Label>
                      <Badge className={`text-xs ${getPoengTypeColor(poengType.type)}`}>
                        {poengType.type}
                      </Badge>
                    </div>
                    {poengType.beskrivelse && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {poengType.beskrivelse}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Valgte poengtyper preview */}
          {formData.poengTyper && formData.poengTyper.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <Label className="text-sm font-medium">
                Valgte poengtyper ({formData.poengTyper.length}):
              </Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.poengTyper.map((pt) => (
                  <Badge key={pt.id} className={`text-xs ${getPoengTypeColor(pt.type)}`}>
                    {pt.navn}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
