'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Settings,
  FileText,
  Target,
  Trophy,
  Route,
  ChevronRight,
  Edit,
  Eye,
  Save,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOpptaksVeiData } from '@/hooks/useOpptaksVeiData';

// Helper for formatting Neo4j dates
function formatNeo4jDate(dateObj: any): string {
  if (!dateObj) return '-';

  if (typeof dateObj === 'object' && dateObj.year) {
    const year = dateObj.year.low || dateObj.year;
    const month = dateObj.month.low || dateObj.month;
    const day = dateObj.day.low || dateObj.day;
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  }

  try {
    return new Date(dateObj).toLocaleDateString('nb-NO');
  } catch {
    return '-';
  }
}

// Nested logical expression structure for complex requirements
interface LogicalExpression {
  type: 'GROUP' | 'REQUIREMENT';
  operator?: 'AND' | 'OR'; // for GROUP type
  children?: LogicalExpression[]; // for GROUP type
  requirementId?: string; // for REQUIREMENT type
  requirementName?: string; // for display purposes
}

interface OpptaksVei {
  id: string;
  navn: string;
  beskrivelse?: string;
  aktiv: boolean;
  grunnlag?: string;
  logicalExpression: LogicalExpression;
  kvote?: string;
  rangering?: string;
}

interface Regelsett {
  id: string;
  navn: string;
  versjon: string;
  gyldigFra: string;
  gyldigTil?: string;
  beskrivelse?: string;
  aktiv: boolean;
  opprettet: string;
  erMal?: boolean;
  malType?: string;
  opptaksVeier?: OpptaksVei[];
}

interface RegelsettDetailPageProps {
  params: Promise<{ id: string }>;
}

// LogicalExpressionBuilder Component
interface LogicalExpressionBuilderProps {
  expression: LogicalExpression;
  onChange: (expression: LogicalExpression) => void;
  availableRequirements: { id: string; navn: string }[];
  disabled?: boolean;
}

function LogicalExpressionBuilder({
  expression,
  onChange,
  availableRequirements,
  disabled = false,
}: LogicalExpressionBuilderProps) {
  const updateExpression = (newExpression: LogicalExpression) => {
    onChange(newExpression);
  };

  const addRequirement = (requirementId: string) => {
    const requirement = availableRequirements.find((r) => r.id === requirementId);
    if (!requirement) return;

    const newReq: LogicalExpression = {
      type: 'REQUIREMENT',
      requirementId: requirement.id,
      requirementName: requirement.navn,
    };

    if (expression.type === 'GROUP') {
      updateExpression({
        ...expression,
        children: [...(expression.children || []), newReq],
      });
    }
  };

  const addGroup = (operator: 'AND' | 'OR') => {
    const newGroup: LogicalExpression = {
      type: 'GROUP',
      operator,
      children: [],
    };

    if (expression.type === 'GROUP') {
      updateExpression({
        ...expression,
        children: [...(expression.children || []), newGroup],
      });
    }
  };

  const removeChild = (index: number) => {
    if (expression.type === 'GROUP' && expression.children) {
      const newChildren = expression.children.filter((_, i) => i !== index);
      updateExpression({
        ...expression,
        children: newChildren,
      });
    }
  };

  const updateChild = (index: number, newChild: LogicalExpression) => {
    if (expression.type === 'GROUP' && expression.children) {
      const newChildren = [...expression.children];
      newChildren[index] = newChild;
      updateExpression({
        ...expression,
        children: newChildren,
      });
    }
  };

  const updateOperator = (operator: 'AND' | 'OR') => {
    if (expression.type === 'GROUP') {
      updateExpression({
        ...expression,
        operator,
      });
    }
  };

  if (expression.type === 'REQUIREMENT') {
    return (
      <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded">
        <span className="text-sm font-medium text-emerald-800">
          {expression.requirementName || 'Ukjent krav'}
        </span>
        {!disabled && (
          <X
            className="h-4 w-4 cursor-pointer text-emerald-600 hover:text-red-600"
            onClick={() => onChange({ type: 'GROUP', operator: 'AND', children: [] })}
          />
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      {/* Group operator selector */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700">Gruppe:</span>
        {!disabled ? (
          <Select value={expression.operator || 'AND'} onValueChange={updateOperator}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant={expression.operator === 'OR' ? 'warning' : 'info'} className="text-xs">
            {expression.operator || 'AND'}
          </Badge>
        )}
        <span className="text-xs text-gray-500">
          {expression.operator === 'OR' ? 'Minst ett må oppfylles' : 'Alle må oppfylles'}
        </span>
      </div>

      {/* Children */}
      <div className="space-y-2 ml-4">
        {expression.children?.map((child, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <LogicalExpressionBuilder
                expression={child}
                onChange={(newChild) => updateChild(index, newChild)}
                availableRequirements={availableRequirements}
                disabled={disabled}
              />
            </div>
            {!disabled && (
              <X
                className="h-4 w-4 mt-2 cursor-pointer text-gray-400 hover:text-red-600"
                onClick={() => removeChild(index)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add buttons */}
      {!disabled && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Select onValueChange={addRequirement}>
            <SelectTrigger className="w-48 text-sm">
              <SelectValue placeholder="+ Legg til krav" />
            </SelectTrigger>
            <SelectContent>
              {availableRequirements
                .filter((req) => !extractRequirementsFromExpression(expression).includes(req.id))
                .map((req) => (
                  <SelectItem key={req.id} value={req.id}>
                    {req.navn}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => addGroup('AND')} className="text-xs">
            + AND gruppe
          </Button>

          <Button variant="outline" size="sm" onClick={() => addGroup('OR')} className="text-xs">
            + OR gruppe
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to extract requirement IDs from expression
function extractRequirementsFromExpression(expression: LogicalExpression): string[] {
  if (expression.type === 'REQUIREMENT') {
    return expression.requirementId ? [expression.requirementId] : [];
  }

  if (expression.type === 'GROUP' && expression.children) {
    return expression.children.flatMap((child) => extractRequirementsFromExpression(child));
  }

  return [];
}

// Convert LogicalExpression to display text
function renderLogicalExpressionText(expression: LogicalExpression): string {
  if (expression.type === 'REQUIREMENT') {
    return expression.requirementName || 'Ukjent krav';
  }

  if (expression.type === 'GROUP' && expression.children) {
    const parts = expression.children.map((child) => {
      const text = renderLogicalExpressionText(child);
      return child.type === 'GROUP' ? `(${text})` : text;
    });
    return parts.join(` ${expression.operator || 'AND'} `);
  }

  return '';
}

export default function RegelsettDetailPage({ params }: RegelsettDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<string>('');
  const [regelsett, setRegelsett] = useState<Regelsett | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRegelsett, setEditedRegelsett] = useState<Regelsett | null>(null);
  const [nyOpptaksVei, setNyOpptaksVei] = useState({
    navn: '',
    beskrivelse: '',
    grunnlagId: '',
    logicalExpression: { type: 'GROUP', operator: 'AND', children: [] } as LogicalExpression,
    kvoteId: '',
    rangeringId: '',
    aktiv: true,
  });
  const [oppretterOpptaksVei, setOppretterOpptaksVei] = useState(false);
  const [lagrerEndringer, setLagrerEndringer] = useState(false);

  // Hent dropdown-data for opptaksveier
  const dropdownData = useOpptaksVeiData();

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

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true' && regelsett) {
      enterEditMode();
    }
  }, [searchParams, regelsett]);

  const enterEditMode = () => {
    if (regelsett) {
      setEditedRegelsett(JSON.parse(JSON.stringify(regelsett)));
      setIsEditMode(true);
    }
  };

  const exitEditMode = () => {
    setEditedRegelsett(null);
    setIsEditMode(false);
    router.push(`/admin/regelsett/${id}`);
  };

  const updateOpptaksVei = (index: number, field: string, value: any) => {
    if (!editedRegelsett) return;

    const updatedVeier = [...(editedRegelsett.opptaksVeier || [])];
    updatedVeier[index] = { ...updatedVeier[index], [field]: value };

    setEditedRegelsett({
      ...editedRegelsett,
      opptaksVeier: updatedVeier,
    });
  };

  const saveChanges = async () => {
    if (!editedRegelsett || !regelsett || lagrerEndringer) return;

    setLagrerEndringer(true);
    
    try {
      // Batch all save operations without fetching in between
      const savePromises = [];
      const veierToSave = editedRegelsett.opptaksVeier || [];

      for (const editedVei of veierToSave) {
        const originalVei = regelsett.opptaksVeier?.find((v) => v.id === editedVei.id);

        if (!originalVei || hasOpptaksVeiChanged(originalVei, editedVei)) {
          const kravIds = extractRequirementsFromExpression(editedVei.logicalExpression);

          const savePromise = fetch(`/api/opptaksveier/${editedVei.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              navn: editedVei.navn,
              beskrivelse: editedVei.beskrivelse,
              grunnlagId: editedVei.grunnlag,
              kravIds: kravIds,
              kvoteId: editedVei.kvote,
              rangeringId: editedVei.rangering,
              aktiv: editedVei.aktiv,
              logicalExpression: editedVei.logicalExpression,
            }),
          }).then(async response => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`Feil ved lagring av opptaksvei "${editedVei.navn}": ${errorData.error || response.statusText}`);
            }
            return response;
          });

          savePromises.push(savePromise);
        }
      }

      // Wait for all saves to complete before refreshing
      if (savePromises.length > 0) {
        await Promise.all(savePromises);
        console.log(`Successfully saved ${savePromises.length} opptaksveier`);
      } else {
        console.log('No changes detected, skipping save');
      }

      // Only fetch fresh data after all saves are complete
      await fetchRegelsett();
      exitEditMode();
    } catch (error) {
      console.error('Feil ved lagring:', error);
      // Show detailed error to user but don't exit edit mode
      alert(`Feil ved lagring av endringer: ${error instanceof Error ? error.message : 'Ukjent feil'}\n\nVennligst prøv igjen.`);
    } finally {
      setLagrerEndringer(false);
    }
  };

  const hasOpptaksVeiChanged = (original: OpptaksVei, edited: OpptaksVei): boolean => {
    return (
      original.navn !== edited.navn ||
      original.beskrivelse !== edited.beskrivelse ||
      original.grunnlag !== edited.grunnlag ||
      original.kvote !== edited.kvote ||
      original.rangering !== edited.rangering ||
      original.aktiv !== edited.aktiv ||
      JSON.stringify(original.logicalExpression) !== JSON.stringify(edited.logicalExpression)
    );
  };

  const opprettOpptaksVei = async () => {
    if (!id || oppretterOpptaksVei) return;

    setOppretterOpptaksVei(true);
    try {
      const kravIds = extractRequirementsFromExpression(nyOpptaksVei.logicalExpression);

      const response = await fetch(`/api/regelsett/${id}/opptaksveier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nyOpptaksVei,
          kravIds: kravIds,
          logicalExpression: nyOpptaksVei.logicalExpression,
        }),
      });

      if (response.ok) {
        // Reset form og refresh data
        setNyOpptaksVei({
          navn: '',
          beskrivelse: '',
          grunnlagId: '',
          logicalExpression: { type: 'GROUP', operator: 'AND', children: [] },
          kvoteId: '',
          rangeringId: '',
          aktiv: true,
        });

        await fetchRegelsett();
      } else {
        console.error('Feil ved opprettelse av opptaksvei');
      }
    } catch (error) {
      console.error('Feil ved opprettelse av opptaksvei:', error);
    } finally {
      setOppretterOpptaksVei(false);
    }
  };

  const getDropdownNavn = (collection: any[], id: string) => {
    return collection.find((item) => item.id === id)?.navn || id;
  };

  const getDropdownValue = (collection: any[], searchValue: string) => {
    const item = collection.find((item) => item.id === searchValue || item.navn === searchValue);
    return item?.id || searchValue;
  };

  const currentRegelsett = isEditMode && editedRegelsett ? editedRegelsett : regelsett;

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!currentRegelsett) {
    return (
      <div className="container mx-auto p-8">
        <p>Regelsett ikke funnet</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/regelsett">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake til regelsett
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentRegelsett.navn}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Versjon {currentRegelsett.versjon}</span>
              <span>•</span>
              <span>Gyldig fra {formatNeo4jDate(currentRegelsett.gyldigFra)}</span>
              {currentRegelsett.erMal && (
                <>
                  <span>•</span>
                  <Badge variant="secondary">Mal: {currentRegelsett.malType}</Badge>
                </>
              )}
            </div>
          </div>
          <Badge variant={currentRegelsett.aktiv ? 'default' : 'secondary'}>
            {currentRegelsett.aktiv ? 'Aktiv' : 'Inaktiv'}
          </Badge>
        </div>

        {currentRegelsett.beskrivelse && (
          <p className="mt-4 text-muted-foreground">{currentRegelsett.beskrivelse}</p>
        )}
      </div>

      {/* Opptaksveier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Opptaksveier
                <Badge variant="secondary" className="text-xs">
                  {currentRegelsett.opptaksVeier?.length || 0} veier
                </Badge>
                {isEditMode && (
                  <Badge variant="outline" className="text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    Redigeringsmodus
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Hver vei representerer en komplett regel fra grunnlag til kvote
              </CardDescription>
            </div>

            {isEditMode ? (
              <div className="flex gap-2">
                <Button 
                  onClick={saveChanges} 
                  disabled={lagrerEndringer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {lagrerEndringer ? 'Lagrer...' : 'Lagre endringer'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exitEditMode}
                  disabled={lagrerEndringer}
                >
                  <X className="h-4 w-4 mr-2" />
                  Avbryt
                </Button>
              </div>
            ) : (
              <Button onClick={enterEditMode}>
                <Edit className="h-4 w-4 mr-2" />
                Rediger opptaksveier
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Eksisterende opptaksveier */}
          {currentRegelsett.opptaksVeier && currentRegelsett.opptaksVeier.length > 0 && (
            <div className="divide-y divide-gray-200">
              {currentRegelsett.opptaksVeier.map((vei, index) => (
                <div key={vei.id} className="py-8 first:pt-0 last:pb-0">
                  <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                    {/* Vei-header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          {isEditMode ? (
                            <Input
                              value={vei.navn}
                              onChange={(e) => updateOpptaksVei(index, 'navn', e.target.value)}
                              className="font-semibold text-lg"
                            />
                          ) : (
                            <h3 className="font-semibold text-lg">{vei.navn}</h3>
                          )}
                        </div>
                      </div>
                      <Badge variant={vei.aktiv ? 'default' : 'secondary'}>
                        {vei.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>

                    {/* Beslutningstre */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {/* Grunnlag */}
                        <div className="flex-1">
                          <div className="bg-green-100 text-green-800 rounded-lg p-3 text-center border-2 border-green-200">
                            <FileText className="h-4 w-4 mx-auto mb-1" />
                            <p className="text-xs font-medium mb-1">GRUNNLAG</p>
                            {isEditMode ? (
                              <Select
                                value={getDropdownValue(dropdownData.grunnlag, vei.grunnlag || '')}
                                onValueChange={(value) =>
                                  updateOpptaksVei(index, 'grunnlag', value)
                                }
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg grunnlag" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.grunnlag.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>
                                      {g.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="text-sm font-semibold">
                                {getDropdownNavn(dropdownData.grunnlag, vei.grunnlag || '') ||
                                  'Ikke satt'}
                              </p>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="h-6 w-6 text-gray-400" />

                        {/* Krav - Nested LogicalExpression */}
                        <div className="flex-1">
                          <div className="bg-orange-100 text-orange-800 rounded-lg p-3 border-2 border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="h-4 w-4" />
                              <p className="text-xs font-medium">KRAV</p>
                            </div>

                            <LogicalExpressionBuilder
                              expression={
                                vei.logicalExpression || {
                                  type: 'GROUP',
                                  operator: 'AND',
                                  children: [],
                                }
                              }
                              onChange={(newExpression) =>
                                updateOpptaksVei(index, 'logicalExpression', newExpression)
                              }
                              availableRequirements={dropdownData.kravelementer}
                              disabled={!isEditMode || dropdownData.loading}
                            />
                          </div>
                        </div>

                        <ChevronRight className="h-6 w-6 text-gray-400" />

                        {/* Kvote og Rangering */}
                        <div className="flex-1 space-y-2">
                          {/* Kvote */}
                          <div className="bg-purple-100 text-purple-800 rounded-lg p-3 text-center border-2 border-purple-200">
                            <Trophy className="h-4 w-4 mx-auto mb-1" />
                            <p className="text-xs font-medium mb-1">KVOTE</p>
                            {isEditMode ? (
                              <Select
                                value={getDropdownValue(dropdownData.kvotetyper, vei.kvote || '')}
                                onValueChange={(value) => updateOpptaksVei(index, 'kvote', value)}
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg kvote" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.kvotetyper.map((kv) => (
                                    <SelectItem key={kv.id} value={kv.id}>
                                      {kv.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="text-sm font-semibold">
                                {getDropdownNavn(dropdownData.kvotetyper, vei.kvote || '') ||
                                  'Ikke satt'}
                              </p>
                            )}
                          </div>

                          {/* Rangering */}
                          <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center border-2 border-blue-200">
                            <Settings className="h-4 w-4 mx-auto mb-1" />
                            <p className="text-xs font-medium mb-1">RANGERING</p>
                            {isEditMode ? (
                              <Select
                                value={getDropdownValue(
                                  dropdownData.rangeringstyper,
                                  vei.rangering || ''
                                )}
                                onValueChange={(value) =>
                                  updateOpptaksVei(index, 'rangering', value)
                                }
                              >
                                <SelectTrigger className="text-sm font-semibold bg-white border">
                                  <SelectValue placeholder="Velg rangering" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dropdownData.rangeringstyper.map((rt) => (
                                    <SelectItem key={rt.id} value={rt.id}>
                                      {rt.navn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="text-sm font-semibold">
                                {getDropdownNavn(
                                  dropdownData.rangeringstyper,
                                  vei.rangering || ''
                                ) || 'Ikke satt'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tom tilstand */}
          {(!currentRegelsett.opptaksVeier || currentRegelsett.opptaksVeier.length === 0) &&
            !isEditMode && (
              <div className="text-center py-12 text-muted-foreground">
                <Route className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium mb-2">Ingen opptaksveier enda</h3>
                <p className="text-sm mb-6 max-w-md mx-auto">
                  Opprett din første opptaksvei for å definere hvilke grunnlag, krav, kvoter og
                  rangeringer som skal brukes.
                </p>
                <Button size="lg" onClick={enterEditMode}>
                  <Plus className="h-4 w-4 mr-2" />
                  Opprett første opptaksvei
                </Button>
              </div>
            )}

          {/* Legg til ny vei - kun i edit mode */}
          {isEditMode && (
            <div className="py-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Opprett ny opptaksvei
                </h3>

                <div className="space-y-4">
                  {/* Navn og beskrivelse */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Navn *</label>
                      <Input
                        value={nyOpptaksVei.navn}
                        onChange={(e) =>
                          setNyOpptaksVei((prev) => ({ ...prev, navn: e.target.value }))
                        }
                        placeholder="f.eks. Ordinær opptaksvei"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Beskrivelse</label>
                      <Input
                        value={nyOpptaksVei.beskrivelse}
                        onChange={(e) =>
                          setNyOpptaksVei((prev) => ({ ...prev, beskrivelse: e.target.value }))
                        }
                        placeholder="Valgfri beskrivelse"
                      />
                    </div>
                  </div>

                  {/* Beslutningstre-preview */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                      {/* Grunnlag */}
                      <div className="flex-1">
                        <div className="bg-green-100 text-green-800 rounded-lg p-3 text-center border-2 border-green-200">
                          <FileText className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-2">GRUNNLAG *</p>
                          <Select
                            value={nyOpptaksVei.grunnlagId}
                            onValueChange={(value) =>
                              setNyOpptaksVei((prev) => ({ ...prev, grunnlagId: value }))
                            }
                            disabled={dropdownData.loading}
                          >
                            <SelectTrigger className="text-sm font-semibold bg-white border">
                              <SelectValue placeholder="Velg grunnlag" />
                            </SelectTrigger>
                            <SelectContent>
                              {dropdownData.grunnlag.map((g) => (
                                <SelectItem key={g.id} value={g.id}>
                                  {g.navn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <ChevronRight className="h-6 w-6 text-gray-400" />

                      {/* Krav - Nested LogicalExpression Builder */}
                      <div className="flex-1">
                        <div className="bg-orange-100 text-orange-800 rounded-lg p-3 border-2 border-orange-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4" />
                            <p className="text-xs font-medium">KRAV</p>
                          </div>

                          <LogicalExpressionBuilder
                            expression={nyOpptaksVei.logicalExpression}
                            onChange={(newExpression) =>
                              setNyOpptaksVei((prev) => ({
                                ...prev,
                                logicalExpression: newExpression,
                              }))
                            }
                            availableRequirements={dropdownData.kravelementer}
                            disabled={dropdownData.loading}
                          />
                        </div>
                      </div>

                      <ChevronRight className="h-6 w-6 text-gray-400" />

                      {/* Kvote og Rangering */}
                      <div className="flex-1 space-y-2">
                        {/* Kvote */}
                        <div className="bg-purple-100 text-purple-800 rounded-lg p-3 text-center border-2 border-purple-200">
                          <Trophy className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-2">KVOTE *</p>
                          <Select
                            value={nyOpptaksVei.kvoteId}
                            onValueChange={(value) =>
                              setNyOpptaksVei((prev) => ({ ...prev, kvoteId: value }))
                            }
                            disabled={dropdownData.loading}
                          >
                            <SelectTrigger className="text-sm font-semibold bg-white border">
                              <SelectValue placeholder="Velg kvote" />
                            </SelectTrigger>
                            <SelectContent>
                              {dropdownData.kvotetyper.map((kv) => (
                                <SelectItem key={kv.id} value={kv.id}>
                                  {kv.navn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Rangering */}
                        <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center border-2 border-blue-200">
                          <Settings className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs font-medium mb-2">RANGERING *</p>
                          <Select
                            value={nyOpptaksVei.rangeringId}
                            onValueChange={(value) =>
                              setNyOpptaksVei((prev) => ({ ...prev, rangeringId: value }))
                            }
                            disabled={dropdownData.loading}
                          >
                            <SelectTrigger className="text-sm font-semibold bg-white border">
                              <SelectValue placeholder="Velg rangering" />
                            </SelectTrigger>
                            <SelectContent>
                              {dropdownData.rangeringstyper.map((rt) => (
                                <SelectItem key={rt.id} value={rt.id}>
                                  {rt.navn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end">
                    <Button
                      onClick={opprettOpptaksVei}
                      disabled={
                        !nyOpptaksVei.navn ||
                        !nyOpptaksVei.grunnlagId ||
                        !nyOpptaksVei.kvoteId ||
                        !nyOpptaksVei.rangeringId ||
                        oppretterOpptaksVei
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Opprett opptaksvei
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
