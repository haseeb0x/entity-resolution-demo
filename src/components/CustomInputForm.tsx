import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EntityResolutionResult } from './EntityResolutionResult';
import { LegacyResult } from './LegacyResult';
import { MechanismPanel } from './MechanismPanel';
import { TransactionContext } from './TransactionContext';
import { Badge } from '@/components/ui/badge';
import type { Customer, EntityType } from '@/types';
import { screenCustomer, type ScreenResult } from '@/lib/matching/screen';

const COUNTRIES: { code: string; label: string }[] = [
  { code: 'CA', label: 'Canada' },
  { code: 'US', label: 'United States' },
  { code: 'MX', label: 'Mexico' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'RU', label: 'Russia' },
  { code: 'SA', label: 'Saudi Arabia' },
  { code: 'YE', label: 'Yemen' },
  { code: 'EG', label: 'Egypt' },
  { code: 'LB', label: 'Lebanon' },
  { code: 'SY', label: 'Syria' },
  { code: 'IQ', label: 'Iraq' },
  { code: 'IR', label: 'Iran' },
  { code: 'PK', label: 'Pakistan' },
  { code: 'SO', label: 'Somalia' },
];

function buildCustomer(
  name: string,
  dob: string,
  country: string,
  entityType: EntityType,
): Customer | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const tokens = trimmed.split(/\s+/);
  const givenNames = tokens.slice(0, -1);
  const familyName = tokens[tokens.length - 1] ?? '';
  return {
    id: 'cust_custom',
    fullName: trimmed,
    givenNames: givenNames.length > 0 ? givenNames : tokens,
    familyName: givenNames.length > 0 ? familyName : '',
    dob: dob || undefined,
    country: country || '—',
    entityType,
    isSynthetic: true,
    transactionDescription: 'Custom screening request',
  };
}

export function CustomInputForm() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('CA');
  const [entityType, setEntityType] = useState<EntityType>('natural_person');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [results, setResults] = useState<ScreenResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = buildCustomer(name, dob, country, entityType);
    setCustomer(c);
    setResults(c ? screenCustomer(c) : null);
  };

  const noMatch =
    results && !results.legacy && !results.entityResolution && customer;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Screen a custom record</CardTitle>
          <p className="mt-1 text-sm text-stone-600">
            Enter a name, DOB, and country. The same matching logic runs
            against the bundled watchlist.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="e.g. Yevgeny Prigozhin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of birth (or year)</Label>
              <Input
                id="dob"
                type="text"
                placeholder="YYYY-MM-DD or YYYY"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="entityType">Entity type</Label>
              <select
                id="entityType"
                value={entityType}
                onChange={(e) =>
                  setEntityType(e.target.value as EntityType)
                }
                className="mt-1.5 flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              >
                <option value="natural_person">Natural person</option>
                <option value="organization">Organization</option>
                <option value="vessel">Vessel</option>
                <option value="aircraft">Aircraft</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <Button type="submit">Run screening</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setName('Yevgeny Prigozhin');
                  setDob('1961-06-01');
                  setCountry('RU');
                  setEntityType('natural_person');
                }}
              >
                Try a known true positive
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {customer && results && !noMatch && (
        <>
          <TransactionContext customer={customer} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.legacy ? (
              <LegacyResult
                result={results.legacy.result}
                watchlistEntry={results.legacy.bestEntry}
              />
            ) : (
              <NoHitCard
                title="Legacy name-matching system"
                tone="text-flag"
                body="No watchlist entry exceeded the 0.85 Jaro–Winkler threshold."
              />
            )}
            {results.entityResolution ? (
              <EntityResolutionResult
                result={results.entityResolution.result}
                watchlistEntry={results.entityResolution.bestEntry}
              />
            ) : (
              <NoHitCard
                title="Entity resolution"
                tone="text-clear"
                body="No watchlist entry crossed the 50% match-probability threshold after weighing all available attributes."
              />
            )}
          </div>
          {results.entityResolution && (
            <MechanismPanel result={results.entityResolution.result} />
          )}
        </>
      )}

      {noMatch && (
        <Card>
          <CardContent>
            <div className="py-4 text-center text-sm text-stone-600">
              <p className="font-medium text-stone-800">No matches found.</p>
              <p className="mt-1">
                Neither system surfaced a watchlist entry above its threshold.
                That outcome is itself useful — most customers are not on a
                sanctions list.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function NoHitCard({
  title,
  tone,
  body,
}: {
  title: string;
  tone: string;
  body: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <p className={`text-xs font-semibold uppercase tracking-wider ${tone}`}>
          {title}
        </p>
        <CardTitle className="mt-1">No hit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Badge tone="clear">CLEAR</Badge>
          <p className="text-sm text-stone-600">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
