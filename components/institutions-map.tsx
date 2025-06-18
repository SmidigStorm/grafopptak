'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Users } from 'lucide-react';

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface Institution {
  id: string;
  navn: string;
  kortNavn: string;
  type: string;
  institusjonsnummer: string;
  adresse: string;
  nettside: string;
  latitude: number;
  longitude: number;
  by: string;
  fylke: string;
  aktiv: boolean;
  antallTilbud?: number;
}

interface InstitutionsMapProps {
  className?: string;
}

export default function InstitutionsMap({ className = '' }: InstitutionsMapProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [leafletLib, setLeafletLib] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet CSS and configure icons
    const setupLeaflet = async () => {
      const L = await import('leaflet');

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setLeafletLib(L);
      setMapReady(true);
    };

    setupLeaflet();
  }, []);

  const createCustomIcon = (type: string) => {
    const getIconColor = (type: string) => {
      switch (type.toLowerCase()) {
        case 'universitet':
          return '#3b82f6'; // blue
        case 'høgskole':
          return '#10b981'; // green
        case 'privat høgskole':
          return '#8b5cf6'; // purple
        default:
          return '#6b7280'; // gray
      }
    };

    const color = getIconColor(type);
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 6.9 12.5 28.5 12.5 28.5s12.5-21.6 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svgIcon)}`;
  };

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch('/api/institusjoner');
        const data = await response.json();

        if (Array.isArray(data)) {
          // Filter institutions with coordinates
          const institutionsWithCoords = data.filter(
            (inst) =>
              inst.latitude &&
              inst.longitude &&
              typeof inst.latitude === 'number' &&
              typeof inst.longitude === 'number'
          );
          setInstitutions(institutionsWithCoords);
        }
      } catch (error) {
        console.error('Feil ved henting av institusjoner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'universitet':
        return 'bg-blue-100 text-blue-800';
      case 'høgskole':
        return 'bg-green-100 text-green-800';
      case 'privat høgskole':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Institusjonskart
          </CardTitle>
          <CardDescription>
            Geografisk oversikt over norske høyere utdanningsinstitusjoner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">Laster kart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapReady || !leafletLib) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Institusjonskart
          </CardTitle>
          <CardDescription>
            Geografisk oversikt over norske høyere utdanningsinstitusjoner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">Forbereder kart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Center of mainland Norway to show entire mainland
  const norwayCenter: [number, number] = [65.0, 12.0];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Institusjonskart
          <Badge variant="secondary">{institutions.length} institusjoner</Badge>
        </CardTitle>
        <CardDescription>
          Geografisk oversikt over norske høyere utdanningsinstitusjoner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] rounded-lg overflow-hidden border">
          <MapContainer
            center={norwayCenter}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {institutions.map((institution) => {
              if (!leafletLib) return null;

              const customIcon = leafletLib.icon({
                iconUrl: createCustomIcon(institution.type),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              });

              return (
                <Marker
                  key={institution.id}
                  position={[institution.latitude, institution.longitude]}
                  icon={customIcon}
                >
                  <Popup maxWidth={300} className="custom-popup">
                    <div className="p-2">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{institution.kortNavn}</h3>
                          <p className="text-xs text-gray-600">{institution.navn}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getTypeColor(institution.type)}`}
                        >
                          {institution.type}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {institution.by}, {institution.fylke}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{institution.adresse}</span>
                        </div>

                        {institution.antallTilbud && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {institution.antallTilbud} tilbud
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t">
                        <a
                          href={institution.nettside}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Besøk nettside
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-xs text-muted-foreground">Universiteter</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-xs text-muted-foreground">Høgskoler</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span className="text-xs text-muted-foreground">Private høgskoler</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
