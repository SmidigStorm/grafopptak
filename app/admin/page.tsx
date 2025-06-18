'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, GraduationCap, Users, FileText, BookOpen } from 'lucide-react';
import InstitutionsMap from '@/components/institutions-map';
import Link from 'next/link';

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

      {/* Moderne dashboard grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
        {/* Kompakte statistikk-kort (6 kort i 2 rader) */}
        <Link href="/admin/institusjoner">
          <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats?.institusjoner || 0}</p>
                  <p className="text-xs text-muted-foreground">Institusjoner</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/utdanningstilbud">
          <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats?.utdanningstilbud || 0}</p>
                  <p className="text-xs text-muted-foreground">Utdanningstilbud</p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sokere">
          <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats?.sokere || 0}</p>
                  <p className="text-xs text-muted-foreground">Søkere</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/regelsett">
          <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats?.regelsett || 0}</p>
                  <p className="text-xs text-muted-foreground">Regelsett</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="md:col-span-2 lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats?.dokumenter || 0}</p>
                <p className="text-xs text-muted-foreground">Dokumenter</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Link href="/admin/fagkoder">
          <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats?.fagkoder || 0}</p>
                  <p className="text-xs text-muted-foreground">Fagkoder</p>
                </div>
                <BookOpen className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Stort institusjonskart i midten */}
        <div className="md:col-span-6 lg:col-span-8">
          <InstitutionsMap />
        </div>

        {/* Top institusjoner til høyre for kartet */}
        <Card className="md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Top institusjoner</CardTitle>
            <CardDescription>Institusjoner med flest tilbud</CardDescription>
          </CardHeader>
          <CardContent>
            {topInstitusjoner.length > 0 ? (
              <div className="space-y-3">
                {topInstitusjoner.slice(0, 5).map((institusjon, index) => (
                  <div
                    key={institusjon.navn}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{institusjon.kortNavn}</p>
                        <p className="text-xs text-muted-foreground">{institusjon.navn}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{institusjon.antallTilbud}</p>
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

        {/* Faggrupper under kartet */}
        <Card className="md:col-span-6 lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg">Faggrupper</CardTitle>
            <CardDescription>Oversikt over faggrupper og antall fagkoder</CardDescription>
          </CardHeader>
          <CardContent>
            {faggrupper.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faggrupper.map((faggruppe) => (
                  <div
                    key={faggruppe.navn}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div>
                      <p className="text-sm font-medium">{faggruppe.navn}</p>
                      <p className="text-xs text-muted-foreground capitalize">{faggruppe.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{faggruppe.antallFagkoder}</p>
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

        {/* Karakterfordeling til høyre under top institusjoner */}
        {karakterfordeling.length > 0 && (
          <Card className="md:col-span-6 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">Karakterfordeling</CardTitle>
              <CardDescription>Fordeling av karakterer (1-6 skala)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((karakter) => {
                  const data = karakterfordeling.find((k) => k.karakter === karakter);
                  const antall = data?.antall || 0;
                  const maxAntall = Math.max(...karakterfordeling.map((k) => k.antall));
                  const prosent = maxAntall > 0 ? (antall / maxAntall) * 100 : 0;

                  return (
                    <div key={karakter} className="text-center p-2 rounded-lg bg-gray-50">
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
    </div>
  );
}
