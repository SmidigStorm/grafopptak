'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Code,
  Play,
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Database,
  Users,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: string[];
  requestBody?: object;
  responseExample?: object;
  testable?: boolean;
}

interface ApiCategory {
  name: string;
  icon: React.ReactNode;
  description: string;
  endpoints: ApiEndpoint[];
}

const apiCategories: ApiCategory[] = [
  {
    name: 'Dashboard & Statistikk',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Statistikk og oversiktsdata for dashboard',
    endpoints: [
      {
        method: 'GET',
        path: '/api/dashboard/stats',
        description: 'Hent dashboard-statistikk med antall entiteter og andre nøkkeltall',
        testable: true,
        responseExample: {
          success: true,
          data: {
            stats: {
              institusjoner: 12,
              utdanningstilbud: 24,
              sokere: 150,
              regelsett: 18,
              dokumenter: 450,
              fagkoder: 89,
            },
            topInstitusjoner: [{ navn: 'NTNU', kortNavn: 'NTNU', antallTilbud: 8 }],
            faggrupper: [{ navn: 'Matematikk R1-nivå', type: 'matematikk', antallFagkoder: 4 }],
          },
        },
      },
    ],
  },
  {
    name: 'Fagkoder & Faggrupper',
    icon: <FileText className="h-4 w-4" />,
    description: 'Håndtering av fagkoder og faggrupper',
    endpoints: [
      {
        method: 'GET',
        path: '/api/fagkoder',
        description: 'Hent alle fagkoder med deres faggrupper',
        testable: true,
        responseExample: {
          success: true,
          data: {
            fagkoder: [
              {
                id: 'rea3022',
                kode: 'REA3022',
                navn: 'Matematikk R1',
                beskrivelse: 'Matematikk på R1-nivå',
                faggrupper: ['Matematikk R1-nivå'],
              },
            ],
          },
        },
      },
      {
        method: 'POST',
        path: '/api/fagkoder',
        description: 'Opprett ny fagkode',
        requestBody: {
          kode: 'TEST001',
          navn: 'Test fag',
          beskrivelse: 'Test fagkode',
        },
        responseExample: {
          success: true,
          data: { id: 'test001', kode: 'TEST001', navn: 'Test fag' },
        },
      },
      {
        method: 'GET',
        path: '/api/fagkoder/[id]',
        description: 'Hent spesifikk fagkode',
        parameters: ['id: string'],
        testable: false, // Krever spesifikk ID
      },
      {
        method: 'GET',
        path: '/api/faggrupper',
        description: 'Hent alle faggrupper med antall fagkoder',
        testable: true,
        responseExample: {
          success: true,
          data: {
            faggrupper: [
              {
                id: 'matematikk-r1',
                navn: 'Matematikk R1-nivå',
                type: 'matematikk',
                antallFagkoder: 4,
              },
            ],
          },
        },
      },
      {
        method: 'POST',
        path: '/api/faggrupper',
        description: 'Opprett ny faggruppe',
        requestBody: {
          navn: 'Test faggruppe',
          type: 'test',
          beskrivelse: 'Test faggruppe',
        },
      },
      {
        method: 'GET',
        path: '/api/faggrupper/[id]/fagkoder',
        description: 'Hent fagkoder i en faggruppe',
        parameters: ['id: string'],
        testable: false, // Krever spesifikk ID
      },
    ],
  },
  {
    name: 'Institusjoner & Tilbud',
    icon: <Database className="h-4 w-4" />,
    description: 'Institusjoner og utdanningstilbud',
    endpoints: [
      {
        method: 'GET',
        path: '/api/institusjoner',
        description: 'Hent alle institusjoner med lokasjon og tilbud',
        testable: true,
        responseExample: {
          success: true,
          data: {
            institusjoner: [
              {
                id: 'ntnu',
                navn: 'Norges teknisk-naturvitenskapelige universitet',
                kortNavn: 'NTNU',
                type: 'universitet',
                lokasjon: { lat: 63.4305, lng: 10.3951 },
                antallTilbud: 8,
              },
            ],
          },
        },
      },
      {
        method: 'POST',
        path: '/api/institusjoner',
        description: 'Opprett ny institusjon',
        requestBody: {
          navn: 'Test Universitet',
          kortNavn: 'TU',
          type: 'universitet',
          lokasjon: { lat: 59.9139, lng: 10.7522 },
        },
      },
      {
        method: 'GET',
        path: '/api/utdanningstilbud',
        description: 'Hent alle utdanningstilbud',
        testable: true,
        responseExample: {
          success: true,
          data: {
            utdanningstilbud: [
              {
                id: 'ntnu-bygg-h25',
                navn: 'Bachelor i bygg- og miljøteknikk',
                institusjon: 'NTNU',
                studienivaa: 'bachelor',
                studiepoeng: 180,
              },
            ],
          },
        },
      },
    ],
  },
  {
    name: 'Søkere & Karakterer',
    icon: <Users className="h-4 w-4" />,
    description: 'Søkere, dokumentasjon og karakterer',
    endpoints: [
      {
        method: 'GET',
        path: '/api/sokere',
        description: 'Hent alle søkere',
        testable: true,
        responseExample: {
          success: true,
          data: {
            sokere: [
              {
                id: 'soker-1',
                fornavn: 'Ola',
                etternavn: 'Nordmann',
                fodselsdato: '2003-01-01',
                epost: 'ola@example.com',
              },
            ],
          },
        },
      },
      {
        method: 'POST',
        path: '/api/sokere',
        description: 'Opprett ny søker',
        requestBody: {
          fornavn: 'Test',
          etternavn: 'Testersen',
          fodselsdato: '2000-01-01',
          epost: 'test@example.com',
        },
      },
      {
        method: 'GET',
        path: '/api/sokere/[id]/karakterer',
        description: 'Hent søkers karakterer',
        parameters: ['id: string'],
        testable: false, // Krever spesifikk ID
      },
      {
        method: 'GET',
        path: '/api/dokumentasjon',
        description: 'Hent all dokumentasjon',
        testable: true,
      },
    ],
  },
  {
    name: 'Regelsett & OpptaksVeier',
    icon: <Settings className="h-4 w-4" />,
    description: 'Regelsett og standard-komponenter',
    endpoints: [
      {
        method: 'GET',
        path: '/api/regelsett',
        description: 'Hent alle regelsett med OpptaksVeier',
        testable: true,
        responseExample: {
          success: true,
          data: {
            regelsett: [
              {
                id: 'ntnu-bygg-h25',
                navn: 'NTNU Bygg- og miljøteknikk H25',
                versjon: '1.0',
                opptaksveier: [
                  {
                    id: 'forstegangsvitnemaal-ntnu-bygg',
                    navn: 'Førstegangsvitnemål',
                    grunnlag: 'Førstegangsvitnemål VGS',
                    krav: ['GSK', 'Matematikk R2'],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        method: 'GET',
        path: '/api/grunnlag',
        description: 'Hent alle grunnlag (standard-komponenter)',
        testable: true,
      },
      {
        method: 'GET',
        path: '/api/kravelementer',
        description: 'Hent alle kravelementer (standard-komponenter)',
        testable: true,
      },
      {
        method: 'GET',
        path: '/api/kvotetyper',
        description: 'Hent alle kvotetyper (standard-komponenter)',
        testable: true,
      },
      {
        method: 'GET',
        path: '/api/rangeringstyper',
        description: 'Hent alle rangeringstyper (standard-komponenter)',
        testable: true,
      },
    ],
  },
  {
    name: 'Spesielle',
    icon: <ExternalLink className="h-4 w-4" />,
    description: 'Graf-data og andre spesialendepunkter',
    endpoints: [
      {
        method: 'GET',
        path: '/api/graph',
        description: 'Hent graf-data for visualisering',
        testable: true,
        responseExample: {
          success: true,
          data: {
            nodes: [{ id: 'node1', label: 'NTNU', type: 'institusjon' }],
            edges: [{ from: 'node1', to: 'node2', label: 'TILBYR' }],
          },
        },
      },
    ],
  },
];

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState(apiCategories[0].name);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loadingEndpoints, setLoadingEndpoints] = useState<Record<string, boolean>>({});
  const [copiedPath, setCopiedPath] = useState<string>('');

  const testEndpoint = async (endpoint: ApiEndpoint) => {
    const key = `${endpoint.method}:${endpoint.path}`;
    setLoadingEndpoints((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(endpoint.path);
      const data = await response.json();

      setTestResults((prev) => ({
        ...prev,
        [key]: {
          status: response.status,
          success: response.ok,
          data: data,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [key]: {
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    }

    setLoadingEndpoints((prev) => ({ ...prev, [key]: false }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(''), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const selectedCategoryData = apiCategories.find((cat) => cat.name === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Dokumentasjon</h1>
        <p className="text-muted-foreground">
          Oversikt over alle tilgjengelige API-endepunkter med test-funksjonalitet
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {apiCategories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name}
              className="flex items-center gap-2 text-xs"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {apiCategories.map((category) => (
          <TabsContent key={category.name} value={category.name} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {category.endpoints.map((endpoint, index) => {
                const endpointKey = `${endpoint.method}:${endpoint.path}`;
                const testResult = testResults[endpointKey];
                const isLoading = loadingEndpoints[endpointKey];

                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code
                            className="text-sm font-mono cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onClick={() => copyToClipboard(`http://localhost:3000${endpoint.path}`)}
                          >
                            {endpoint.path}
                            {copiedPath === `http://localhost:3000${endpoint.path}` && (
                              <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />
                            )}
                          </code>
                        </div>

                        {endpoint.testable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testEndpoint(endpoint)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            Test
                          </Button>
                        )}
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {endpoint.parameters && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Parametere:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {endpoint.parameters.map((param, i) => (
                              <li key={i} className="font-mono">
                                • {param}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {endpoint.requestBody && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request Body:</h4>
                          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(endpoint.requestBody, null, 2)}
                          </pre>
                        </div>
                      )}

                      {endpoint.responseExample && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Response Example:</h4>
                          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(endpoint.responseExample, null, 2)}
                          </pre>
                        </div>
                      )}

                      {testResult && (
                        <Alert
                          className={testResult.success ? 'border-green-200' : 'border-red-200'}
                        >
                          <div className="flex items-center gap-2">
                            {testResult.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">
                              Test Result ({testResult.timestamp})
                            </span>
                            <Badge variant={testResult.success ? 'default' : 'destructive'}>
                              {testResult.status}
                            </Badge>
                          </div>
                          <AlertDescription className="mt-2">
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(testResult.data || testResult.error, null, 2)}
                            </pre>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Hurtig testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Base URL:</strong> <code>http://localhost:3000</code>
            </p>
            <p>
              <strong>Test med curl:</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {`curl http://localhost:3000/api/fagkoder
curl -X POST http://localhost:3000/api/fagkoder \\
  -H "Content-Type: application/json" \\
  -d '{"kode": "TEST001", "navn": "Test fag"}'`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
