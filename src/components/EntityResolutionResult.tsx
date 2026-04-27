import type {
  EntityResolutionResultData,
  WatchlistEntry,
} from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  result: EntityResolutionResultData;
  watchlistEntry: WatchlistEntry;
}

export function EntityResolutionResult({ result, watchlistEntry }: Props) {
  const isFlag = result.verdict === 'FLAG';
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wider text-clear">
          Entity resolution
        </p>
        <CardTitle className="mt-1">
          Fellegi–Sunter · threshold 50%
        </CardTitle>
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
            <div className="mt-1 grid grid-cols-2 gap-x-4 text-xs text-stone-500">
              <span>
                {watchlistEntry.entityType.replace('_', ' ')}
                {watchlistEntry.dob && ` · b. ${watchlistEntry.dob}`}
              </span>
              <span>
                {watchlistEntry.country}
                {watchlistEntry.sanctionsProgram &&
                  ` · ${watchlistEntry.sanctionsProgram}`}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">
              Match probability
            </p>
            <p className="mt-0.5 text-3xl font-semibold tabular-nums text-stone-900">
              {(result.matchProbability * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-stone-500">
              Σ log-odds = {result.totalLogOdds.toFixed(2)}
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
