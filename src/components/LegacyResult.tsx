import type { LegacyResult as LegacyResultData, WatchlistEntry } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  result: LegacyResultData;
  watchlistEntry: WatchlistEntry;
}

export function LegacyResult({ result, watchlistEntry }: Props) {
  const isFlag = result.verdict === 'FLAG';
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wider text-flag">
          Legacy name-matching system
        </p>
        <CardTitle className="mt-1">Jaro–Winkler · threshold 0.85</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">
              Matched against
            </p>
            <p className="mt-0.5 font-medium text-stone-900">
              {watchlistEntry.fullName}
            </p>
            <p className="text-xs text-stone-500">
              {watchlistEntry.listSource.replace('_', ' ')}
              {watchlistEntry.sanctionsProgram &&
                ` · ${watchlistEntry.sanctionsProgram}`}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">
              Similarity
            </p>
            <p className="mt-0.5 text-3xl font-semibold tabular-nums text-stone-900">
              {result.similarity.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={isFlag ? 'flag' : 'clear'}>{result.verdict}</Badge>
            <p className="text-sm text-stone-600">{result.explanation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
