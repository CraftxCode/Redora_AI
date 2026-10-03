export function StatusDot({ label = 'Online' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.14em] text-crimson-soft">
      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-crimson-bright shadow-[0_0_10px_2px_rgba(255,48,48,.7)]" />
      <span>{label.toUpperCase()}</span>
    </span>
  );
}
