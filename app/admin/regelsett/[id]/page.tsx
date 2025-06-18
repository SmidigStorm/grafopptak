'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Settings, FileText, Target, Trophy } from 'lucide-react';
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

interface RegelsettDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RegelsettDetailPage({ params }: RegelsettDetailPageProps) {
  const [id, setId] = useState<string>('');
  const [regelsett, setRegelsett] = useState<Regelsett | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  const fetchRegelsett = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/regelsett/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRegelsett(data);
      } else {
        console.error('Feil ved henting av regelsett');
      }
    } catch (error) {
      console.error('Feil ved henting av regelsett:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRegelsett();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Laster regelsett...</p>
        </div>
      </div>
    );
  }

  if (!regelsett) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>Regelsett ikke funnet</p>
          <Link href="/admin/regelsett">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til regelsett
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/regelsett">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{regelsett.navn}</h1>
          <p className="text-muted-foreground">
            Versjon {regelsett.versjon} •{' '}
            {regelsett.aktiv ? (
              <Badge variant="default">Aktiv</Badge>
            ) : (
              <Badge variant="secondary">Inaktiv</Badge>
            )}
          </p>
        </div>
        <Link href={`/admin/regelsett/${id}/edit`}>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Rediger regelsett
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regelsett-informasjon</CardTitle>
            <CardDescription>Grunnleggende informasjon om regelsettet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Navn</label>
              <p className="text-sm">{regelsett.navn}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Versjon</label>
              <p className="text-sm font-mono">{regelsett.versjon}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gyldig fra</label>
              <p className="text-sm">{new Date(regelsett.gyldigFra).toLocaleDateString('nb-NO')}</p>
            </div>
            {regelsett.gyldigTil && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gyldig til</label>
                <p className="text-sm">
                  {new Date(regelsett.gyldigTil).toLocaleDateString('nb-NO')}
                </p>
              </div>
            )}
            {regelsett.beskrivelse && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Beskrivelse</label>
                <p className="text-sm">{regelsett.beskrivelse}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regelsett-struktur</CardTitle>
            <CardDescription>
              Bygg regelsett-strukturen med grunnlag, krav, kvoter og rangering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="mb-4">Ingen regelsett-struktur enda</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Legg til grunnlag
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Grunnlag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">0 grunnlag</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Legg til
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Krav
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">0 krav</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Legg til
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Kvoter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">0 kvoter</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Legg til
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rangering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">0 rangeringer</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Legg til
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
