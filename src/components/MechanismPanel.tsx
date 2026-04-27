import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import * as Collapsible from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { EntityResolutionResultData, MatchField } from '@/types';

interface Props {
  result: EntityResolutionResultData;
}

export function MechanismPanel({ result }: Props) {
  const [open, setOpen] = useState(false);

  const sorted = [...result.fields].sort(
    (a, b) => Math.abs(b.weight) - Math.abs(a.weight),
  );
  const top = sorted.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mechanism</CardTitle>
        <p className="mt-1 text-sm text-stone-600">
          The Fellegi–Sunter model adds a log-odds weight per comparison field.
          Positive weights argue for a match; negative weights argue against.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {top.map((f) => (
            <li key={f.fieldName} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 inline-block w-3.5 text-center font-mono text-base font-bold',
                  f.weight >= 0 ? 'text-clear' : 'text-flag',
                )}
                aria-hidden
              >
                {f.weight >= 0 ? '✓' : '✗'}
              </span>
              <div>
                <span className="font-medium text-stone-900">
                  {f.fieldName}
                </span>{' '}
                <span className="text-stone-600">— {f.explanation}</span>{' '}
                <span
                  className={cn(
                    'mono text-xs',
                    f.weight >= 0 ? 'text-clear' : 'text-flag',
                  )}
                >
                  ({f.weight >= 0 ? '+' : ''}
                  {f.weight.toFixed(2)})
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-stone-700">
          <span className="mono">
            Σ = {result.totalLogOdds.toFixed(2)}
          </span>{' '}
          → P(match) = {(result.matchProbability * 100).toFixed(1)}% →{' '}
          <span
            className={cn(
              'font-semibold',
              result.verdict === 'FLAG' ? 'text-flag' : 'text-clear',
            )}
          >
            {result.verdict}
          </span>
        </p>

        <Collapsible.Root open={open} onOpenChange={setOpen} className="mt-5">
          <Collapsible.Trigger
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900',
            )}
          >
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform',
                open && 'rotate-180',
              )}
            />
            {open ? 'Hide the full math' : 'View the full math'}
          </Collapsible.Trigger>
          <Collapsible.Content className="mt-4 overflow-hidden">
            <FullMathTable
              fields={result.fields}
              total={result.totalLogOdds}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      </CardContent>
    </Card>
  );
}

function FullMathTable({
  fields,
  total,
}: {
  fields: MatchField[];
  total: number;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-soft">
      <table className="w-full text-xs mono">
        <thead className="bg-stone-50 text-stone-600">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Field</th>
            <th className="px-3 py-2 text-left font-medium">Customer</th>
            <th className="px-3 py-2 text-left font-medium">Watchlist</th>
            <th className="px-3 py-2 text-right font-medium">u</th>
            <th className="px-3 py-2 text-right font-medium">Weight</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.fieldName} className="border-t border-soft">
              <td className="px-3 py-2 text-stone-700">{f.fieldName}</td>
              <td className="px-3 py-2 text-stone-700">
                {f.customerValue ?? '—'}
              </td>
              <td className="px-3 py-2 text-stone-700">
                {f.watchlistValue ?? '—'}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-stone-600">
                {f.uProbability !== undefined
                  ? f.uProbability < 0.001
                    ? f.uProbability.toExponential(2)
                    : f.uProbability.toFixed(4)
                  : '—'}
              </td>
              <td
                className={cn(
                  'px-3 py-2 text-right tabular-nums font-medium',
                  f.weight >= 0 ? 'text-clear' : 'text-flag',
                )}
              >
                {f.weight >= 0 ? '+' : ''}
                {f.weight.toFixed(3)}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-stone-300 bg-stone-50">
            <td colSpan={4} className="px-3 py-2 text-right font-medium">
              Σ log-odds
            </td>
            <td
              className={cn(
                'px-3 py-2 text-right font-bold tabular-nums',
                total >= 0 ? 'text-clear' : 'text-flag',
              )}
            >
              {total >= 0 ? '+' : ''}
              {total.toFixed(3)}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="border-t border-soft bg-stone-50 px-3 py-2 text-xs text-stone-500">
        Per-field weights: matched = log<sub>2</sub>(m / u); unmatched = log
        <sub>2</sub>((1 − m) / (1 − u)). m and u values are documented in{' '}
        <code>fellegi-sunter.ts</code>.
      </p>
    </div>
  );
}
