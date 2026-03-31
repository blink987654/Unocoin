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
          {/* Main gradient — bitcoin orange to gold */}
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7931A" />
            <stop offset="50%" stopColor="#FFAB40" />
            <stop offset="100%" stopColor="#F7931A" />
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

        {/* The "U" letterform — custom drawn, not a font */}
        <path
          d="M35 30 L35 58 C35 72 42 80 50 80 C58 80 65 72 65 58 L65 30"
          fill="none"
          stroke={`url(#${id}-grad)`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-glow)`}
        />

        {/* Horizontal bars — Bitcoin-inspired serifs */}
        <line
          x1="28"
          y1="30"
          x2="42"
          y2="30"
          stroke={`url(#${id}-grad)`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="58"
          y1="30"
          x2="72"
          y2="30"
          stroke={`url(#${id}-grad)`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Small vertical tick marks at top — like Bitcoin's ₿ strokes */}
        <line
          x1="35"
          y1="23"
          x2="35"
          y2="30"
          stroke={`url(#${id}-grad)`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="65"
          y1="23"
          x2="65"
          y2="30"
          stroke={`url(#${id}-grad)`}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Subtle corner accent — top right */}
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
