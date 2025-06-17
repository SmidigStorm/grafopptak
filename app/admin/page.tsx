import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, GraduationCap, Users, FileText, Plus, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 fra forrige måned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utdanningstilbud</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+15 fra forrige måned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive søkere</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+234 fra forrige uke</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regelsett</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+3 fra forrige måned</p>
          </CardContent>
        </Card>
      </div>

      {/* Hurtighandlinger */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Nytt utdanningstilbud
            </CardTitle>
            <CardDescription>
              Opprett et nytt utdanningstilbud med tilhørende regelsett
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Opprett utdanningstilbud
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nytt regelsett
            </CardTitle>
            <CardDescription>Bygg et nytt regelsett fra maler eller fra scratch</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Opprett regelsett
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rapporter
            </CardTitle>
            <CardDescription>Se statistikk og generer rapporter for opptak</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Se rapporter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Siste aktivitet */}
      <Card>
        <CardHeader>
          <CardTitle>Siste aktivitet</CardTitle>
          <CardDescription>Oversikt over nylige endringer i systemet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nytt regelsett opprettet</p>
                <p className="text-xs text-muted-foreground">
                  NTNU - Bachelor i sykepleie • 2 timer siden
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Fagkode oppdatert</p>
                <p className="text-xs text-muted-foreground">
                  Matematikk S1+S2 → R1 ekvivalens • 4 timer siden
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Ny institusjon registrert</p>
                <p className="text-xs text-muted-foreground">
                  Høgskulen på Vestlandet • 1 dag siden
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
