import type {
  EntityResolutionResultData,
  LegacyResult as LegacyResultData,
  WatchlistEntry,
} from '@/types';
import { LegacyResult } from './LegacyResult';
import { EntityResolutionResult } from './EntityResolutionResult';

interface Props {
  legacy: LegacyResultData;
  entityResolution: EntityResolutionResultData;
  watchlistEntry: WatchlistEntry;
}

export function ComparisonPanel({
  legacy,
  entityResolution,
  watchlistEntry,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LegacyResult result={legacy} watchlistEntry={watchlistEntry} />
      <EntityResolutionResult
        result={entityResolution}
        watchlistEntry={watchlistEntry}
      />
    </div>
  );
}
