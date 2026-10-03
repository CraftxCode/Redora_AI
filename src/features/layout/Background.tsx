/** Layered cinematic backdrop: glow + grid + rings + particles + grain. Pure CSS, GPU-friendly. */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 1 + (i % 3),
  delay: (i * 0.9) % 9,
  duration: 8 + (i % 5) * 1.5,
}));

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_78%_8%,rgba(229,9,20,.20),transparent_70%),radial-gradient(45%_45%_at_8%_62%,rgba(112,0,8,.26),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.032)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute -right-[18%] -top-[22%] animate-ring rounded-full border border-white/[0.06]"
          style={{ width: `${46 + i * 16}vmax`, height: `${46 + i * 16}vmax`, animationDelay: `${i * 1.4}s` }}
        />
      ))}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-drift rounded-full bg-crimson-soft"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
