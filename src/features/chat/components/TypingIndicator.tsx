export function TypingIndicator() {
  return (
    <li className="flex" aria-label="Redora AI is typing">
      <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line-1 bg-surface-2 px-4 py-3.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-dots rounded-full bg-crimson-soft" style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </span>
    </li>
  );
}
