"use client";

export function UnocoinLogo({
  size = 36,
  className = "",
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const id = `logo-${size}`;

  return (
    <div
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow on hover */}
      {animated && (
        <div
          className="absolute inset-0 bg-bitcoin/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ margin: -4 }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
      >
        <defs>
          {/* Main gradient — bitcoin orange to gold with shimmer */}
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7931A">
              <animate attributeName="stopColor" values="#F7931A;#FFAB40;#FFD54F;#FFAB40;#F7931A" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FFAB40">
              <animate attributeName="stopColor" values="#FFAB40;#FFD54F;#F7931A;#FFD54F;#FFAB40" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#F7931A">
              <animate attributeName="stopColor" values="#F7931A;#F7931A;#FFAB40;#FFD54F;#F7931A" dur="5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Inner shadow gradient */}
          <linearGradient id={`${id}-inner`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7931A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0.05" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background — rounded square with subtle inner gradient */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill="#111111"
          stroke={`url(#${id}-grad)`}
          strokeWidth="2.5"
        />

        {/* Inner fill for depth */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="20"
          fill={`url(#${id}-inner)`}
        />

        {/* Bitcoin ₿ symbol */}
        {/* Vertical strokes extending above and below */}
        <line x1="45" y1="18" x2="45" y2="82" stroke={`url(#${id}-grad)`} strokeWidth="5" strokeLinecap="round" filter={`url(#${id}-glow)`} />
        <line x1="55" y1="18" x2="55" y2="82" stroke={`url(#${id}-grad)`} strokeWidth="5" strokeLinecap="round" filter={`url(#${id}-glow)`} />

        {/* Top bumps of the ₿ */}
        <path
          d="M36 28 H54 C64 28 66 36 58 40 H36"
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-glow)`}
        />

        {/* Horizontal middle bar */}
        <line x1="36" y1="50" x2="58" y2="50" stroke={`url(#${id}-grad)`} strokeWidth="5" strokeLinecap="round" />

        {/* Bottom bumps of the ₿ */}
        <path
          d="M36 50 H56 C68 50 68 62 58 66 H36"
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-glow)`}
        />

        {/* Subtle corner accent */}
        <circle
          cx="80"
          cy="20"
          r="3"
          fill="#F7931A"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export function UnocoinWordmark({
  size = "text-xl",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <span className={`${size} font-bold tracking-tight ${className}`}>
      <span className="text-text-primary">Uno</span>
      <span className="text-bitcoin">coin</span>
    </span>
  );
}

export function IndiaBitcoinWordmark({
  size = "text-xl",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <span className={`${size} font-bold tracking-tight`}>
        <span className="text-text-primary">India</span>
        <span className="text-bitcoin">Bitcoin</span>
        <span className="text-text-tertiary text-[0.6em]">.com</span>
      </span>
      <span className="text-[9px] text-text-tertiary tracking-wider uppercase">
        Powered by Unocoin
      </span>
    </div>
  );
}

export function UnocoinBrand({
  logoSize = 36,
  wordmarkSize = "text-xl",
  className = "",
  animated = true,
}: {
  logoSize?: number;
  wordmarkSize?: string;
  className?: string;
  animated?: boolean;
}) {
  return (
    <a href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <UnocoinLogo size={logoSize} animated={animated} />
      <UnocoinWordmark size={wordmarkSize} />
    </a>
  );
}

export function IndiaBitcoinBrand({
  logoSize = 36,
  wordmarkSize = "text-xl",
  className = "",
  animated = true,
}: {
  logoSize?: number;
  wordmarkSize?: string;
  className?: string;
  animated?: boolean;
}) {
  return (
    <a href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <UnocoinLogo size={logoSize} animated={animated} />
      <IndiaBitcoinWordmark size={wordmarkSize} />
    </a>
  );
}
