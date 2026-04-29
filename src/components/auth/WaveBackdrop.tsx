const WaveBackdrop = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,hsl(var(--olive-light)/0.45),transparent_60%),linear-gradient(135deg,hsl(var(--olive-deep)),hsl(var(--olive)))]" />

      {/* Soft glow */}
      <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-cream/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-olive-light/30 blur-[120px]" />

      {/* Animated waves */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-2/3 opacity-60"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--cream))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--cream))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--cream))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${320 + i * 18} C 200 ${260 + i * 14}, 400 ${380 + i * 14}, 600 ${300 + i * 16} S 1000 ${360 + i * 14}, 1200 ${300 + i * 16}`}
            stroke="url(#waveStroke)"
            strokeWidth="1.2"
            style={{
              animation: `waveFloat ${8 + i * 0.6}s ease-in-out ${i * 0.2}s infinite alternate`,
              transformOrigin: "center",
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes waveFloat {
          0%   { transform: translateY(0) scaleY(1); }
          100% { transform: translateY(-12px) scaleY(1.06); }
        }
      `}</style>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

export default WaveBackdrop;
