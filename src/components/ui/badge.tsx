import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'flag' | 'clear' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  flag: 'bg-red-50 text-flag border-red-200',
  clear: 'bg-emerald-50 text-clear border-emerald-200',
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
