import { scenarios } from '@/data/scenarios';
import { cn } from '@/lib/utils';

interface Props {
  activeId: string;
  onChange: (id: string) => void;
}

export function ScenarioSelector({ activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Choose a scenario"
      className="flex flex-wrap gap-2"
    >
      {scenarios.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              active
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50',
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
