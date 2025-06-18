'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Calendar,
  Building,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Fagkode {
  id: string;
  kode: string;
  navn: string;
  karakter: string;
  karaktersystem: string;
  dato: string;
  kommentar?: string;
}

interface Dokumentasjon {
  id: string;
  type: string;
  navn: string;
  utstedt?: any;
  utsteder?: string;
  utdanningsnivaa?: string;
  gyldigTil?: any;
  aktiv: boolean;
  fagkoder: Fagkode[];
}

interface DokumentasjonModalProps {
  isOpen: boolean;
  onClose: () => void;
  sokerId: string;
  sokerNavn: string;
}

const dokumentTypeIkon = (type: string) => {
  switch (type) {
    case 'vitnemaal':
      return <GraduationCap className="h-5 w-5" />;
    case 'fagbrev':
      return <FileText className="h-5 w-5" />;
    case 'karakterutskrift':
      return <FileText className="h-5 w-5" />;
    case 'politiattest':
      return <CheckCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const dokumentTypeNavn = (type: string) => {
  const typer: { [key: string]: string } = {
    vitnemaal: 'Vitnemål',
    fagbrev: 'Fagbrev',
    karakterutskrift: 'Karakterutskrift',
    politiattest: 'Politiattest',
    spraaktest: 'Språktest',
    militaerattest: 'Militærattest',
    annet: 'Annet',
  };
  return typer[type] || type;
};

const karakterFarge = (karakter: string, karaktersystem: string) => {
  if (karaktersystem === 'bestått/ikke bestått') {
    return karakter === 'bestått' ? 'text-green-600' : 'text-red-600';
  }

  const num = parseInt(karakter);
  if (num >= 5) return 'text-green-600 font-semibold';
  if (num >= 4) return 'text-blue-600';
  if (num >= 3) return 'text-gray-600';
  return 'text-red-600';
};

export default function DokumentasjonModal({
  isOpen,
  onClose,
  sokerId,
  sokerNavn,
}: DokumentasjonModalProps) {
  const [dokumenter, setDokumenter] = useState<Dokumentasjon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && sokerId) {
      fetchDokumentasjon();
    }
  }, [isOpen, sokerId]);

  const fetchDokumentasjon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dokumentasjon?personId=${sokerId}`);
      const data = await response.json();
      setDokumenter(data);
    } catch (error) {
      console.error('Feil ved henting av dokumentasjon:', error);
    } finally {
      setLoading(false);
    }
  };

  const erGyldig = (dokument: Dokumentasjon) => {
    if (!dokument.gyldigTil) return true;
    const gyldigTil = new Date(formatDate(dokument.gyldigTil));
    return gyldigTil > new Date();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dokumentasjon for {sokerNavn}</DialogTitle>
          <DialogDescription>Oversikt over all dokumentasjon og karakterer</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <p>Laster dokumentasjon...</p>
          </div>
        ) : dokumenter.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ingen dokumentasjon registrert</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dokumenter.map((dokument) => (
              <Card key={dokument.id} className={!erGyldig(dokument) ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {dokumentTypeIkon(dokument.type)}
                      <CardTitle className="text-lg">{dokument.navn}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={dokument.aktiv ? 'default' : 'secondary'}>
                        {dokumentTypeNavn(dokument.type)}
                      </Badge>
                      {!erGyldig(dokument) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Utløpt
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    {dokument.utsteder && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {dokument.utsteder}
                      </span>
                    )}
                    {dokument.utstedt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Utstedt: {formatDate(dokument.utstedt)}
                      </span>
                    )}
                    {dokument.gyldigTil && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Gyldig til: {formatDate(dokument.gyldigTil)}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>

                {dokument.fagkoder.length > 0 && (
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Fagkoder og karakterer
                      </h4>
                      <div className="grid gap-2">
                        {dokument.fagkoder.map((fagkode, index) => (
                          <div
                            key={`${fagkode.id}-${index}`}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-muted-foreground">
                                {fagkode.kode}
                              </span>
                              <span className="text-sm">{fagkode.navn}</span>
                              {fagkode.kommentar && (
                                <Badge variant="outline" className="text-xs">
                                  {fagkode.kommentar}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-lg ${karakterFarge(fagkode.karakter, fagkode.karaktersystem)}`}
                              >
                                {fagkode.karakter}
                              </span>
                              {fagkode.dato && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(fagkode.dato)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
