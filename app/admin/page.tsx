'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, GraduationCap, Users, FileText, BookOpen } from 'lucide-react';
import InstitutionsMap from '@/components/institutions-map';

interface DashboardStats {
  institusjoner: number;
  utdanningstilbud: number;
  sokere: number;
  regelsett: number;
  dokumenter: number;
  fagkoder: number;
}

interface TopInstitusjon {
  navn: string;
  kortNavn: string;
  antallTilbud: number;
}

interface Faggruppe {
  navn: string;
  type: string;
  antallFagkoder: number;
}

interface KarakterFordeling {
  karakter: number;
  antall: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [karakterfordeling, setKarakterfordeling] = useState<KarakterFordeling[]>([]);
  const [topInstitusjoner, setTopInstitusjoner] = useState<TopInstitusjon[]>([]);
  const [faggrupper, setFaggrupper] = useState<Faggruppe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data.stats);
          setKarakterfordeling(data.data.karakterfordeling || []);
          setTopInstitusjoner(data.data.topInstitusjoner || []);
          setFaggrupper(data.data.faggrupper || []);
        }
      } catch (error) {
        console.error('Feil ved henting av dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Oversikt over opptakssystemet</p>
        </div>
        <div className="text-center py-8">
          <p>Laster dashboard data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Oversikt over opptakssystemet</p>
      </div>

      {/* Statistikk kort */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institusjoner</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.institusjoner || 0}</div>
            <p className="text-xs text-muted-foreground">Registrerte institusjoner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utdanningstilbud</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.utdanningstilbud || 0}</div>
            <p className="text-xs text-muted-foreground">Aktive tilbud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Søkere</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sokere || 0}</div>
            <p className="text-xs text-muted-foreground">Registrerte søkere</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regelsett</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.regelsett || 0}</div>
            <p className="text-xs text-muted-foreground">Totalt antall regelsett</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumenter</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.dokumenter || 0}</div>
            <p className="text-xs text-muted-foreground">Lastet opp dokumenter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fagkoder</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.fagkoder || 0}</div>
            <p className="text-xs text-muted-foreground">Registrerte fagkoder</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistikk og data i grid layout */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Høyre kolonne - kart */}
        <div className="lg:col-span-1 lg:order-2">
          <InstitutionsMap />
        </div>

        {/* Venstre kolonne - statistikk */}
        <div className="lg:col-span-2 lg:order-1 space-y-4">
          {/* Top institusjoner */}
          <Card>
            <CardHeader>
              <CardTitle>Top institusjoner</CardTitle>
              <CardDescription>Institusjoner med flest utdanningstilbud</CardDescription>
            </CardHeader>
            <CardContent>
              {topInstitusjoner.length > 0 ? (
                <div className="space-y-3">
                  {topInstitusjoner.slice(0, 5).map((institusjon, index) => (
                    <div key={institusjon.navn} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {institusjon.kortNavn || institusjon.navn}
                        </p>
                        <p className="text-xs text-muted-foreground">{institusjon.navn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{institusjon.antallTilbud}</p>
                        <p className="text-xs text-muted-foreground">tilbud</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ingen data tilgjengelig</p>
              )}
            </CardContent>
          </Card>

          {/* Faggrupper */}
          <Card>
            <CardHeader>
              <CardTitle>Faggrupper</CardTitle>
              <CardDescription>Oversikt over faggrupper og antall fagkoder</CardDescription>
            </CardHeader>
            <CardContent>
              {faggrupper.length > 0 ? (
                <div className="space-y-3">
                  {faggrupper.slice(0, 5).map((faggruppe) => (
                    <div key={faggruppe.navn} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{faggruppe.navn}</p>
                        <p className="text-xs text-muted-foreground capitalize">{faggruppe.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{faggruppe.antallFagkoder}</p>
                        <p className="text-xs text-muted-foreground">fagkoder</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ingen data tilgjengelig</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Karakterfordeling */}
      {karakterfordeling.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Karakterfordeling</CardTitle>
            <CardDescription>Fordeling av karakterer i systemet (1-6 skala)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((karakter) => {
                const data = karakterfordeling.find((k) => k.karakter === karakter);
                const antall = data?.antall || 0;
                const maxAntall = Math.max(...karakterfordeling.map((k) => k.antall));
                const prosent = maxAntall > 0 ? (antall / maxAntall) * 100 : 0;

                return (
                  <div key={karakter} className="text-center">
                    <div className="mb-2">
                      <div className="text-lg font-bold">{karakter}</div>
                      <div className="text-xs text-muted-foreground">{antall}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${prosent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
