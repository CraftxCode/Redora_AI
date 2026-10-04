import { QUICK_ACTIONS } from '@/data/redoraKnowledge';

export function QuickActions({ disabled, onPick }: { disabled: boolean; onPick: (label: string, entryId: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Quick actions">
      {QUICK_ACTIONS.map((a) => (
        <li key={a.entryId}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPick(a.label, a.entryId)}
            className="rounded-full border border-line-2 bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson/70 hover:bg-crimson/10 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:py-1.5"
          >
            {a.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
