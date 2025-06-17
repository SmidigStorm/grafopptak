import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Eye } from 'lucide-react';

export default function RegelsettPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regelsett</h1>
          <p className="text-muted-foreground">Administrer regelsett for utdanningstilbud</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nytt regelsett
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eksisterende regelsett</CardTitle>
          <CardDescription>Oversikt over alle regelsett i systemet</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Utdanningstilbud</TableHead>
                <TableHead>Antall grunnlag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sist endret</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sykepleie NTNU H25</TableCell>
                <TableCell>Bachelor i sykepleie - NTNU</TableCell>
                <TableCell>4</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktiv
                  </span>
                </TableCell>
                <TableCell>2 timer siden</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Informatikk UiO H25</TableCell>
                <TableCell>Master i informatikk - UiO</TableCell>
                <TableCell>3</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Utkast
                  </span>
                </TableCell>
                <TableCell>1 dag siden</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
