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
  const id = `logo-${size}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
      >
        <defs>
          <linearGradient id={`${id}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7931A" />
            <stop offset="50%" stopColor="#FFAB40" />
            <stop offset="100%" stopColor="#F7931A" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#F7931A" />
          </linearGradient>
        </defs>

        {/* Outer circle */}
        <circle cx="50" cy="50" r="46" fill="#0D0D0D" stroke={`url(#${id}-g)`} strokeWidth="2" />

        {/* Lotus petals — 5 petals, clean and crisp */}
        <path d="M50 16 C46 28, 42 36, 50 44 C58 36, 54 28, 50 16Z" fill={`url(#${id}-g2)`} opacity="0.95" />
        <path d="M72 24 C64 32, 60 38, 54 44 C62 42, 70 40, 72 24Z" fill={`url(#${id}-g)`} opacity="0.8" />
        <path d="M28 24 C36 32, 40 38, 46 44 C38 42, 30 40, 28 24Z" fill={`url(#${id}-g)`} opacity="0.8" />
        <path d="M76 52 C66 48, 60 46, 54 48 C60 54, 68 58, 76 52Z" fill={`url(#${id}-g)`} opacity="0.65" />
        <path d="M24 52 C34 48, 40 46, 46 48 C40 54, 32 58, 24 52Z" fill={`url(#${id}-g)`} opacity="0.65" />

        {/* Center Bitcoin node */}
        <circle cx="50" cy="48" r="10" fill="#0D0D0D" stroke={`url(#${id}-g2)`} strokeWidth="2" />
        <circle cx="50" cy="48" r="6" fill={`url(#${id}-g2)`} />
        <text x="50" y="52" textAnchor="middle" fill="#0D0D0D" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">₿</text>

        {/* Stem */}
        <path d="M38 60 Q44 68, 50 70 Q56 68, 62 60" fill="none" stroke={`url(#${id}-g)`} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M42 66 Q46 72, 50 74 Q54 72, 58 66" fill="none" stroke={`url(#${id}-g)`} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

        {/* India tricolor dots */}
        <circle cx="44" cy="80" r="1.5" fill="#FF9933" opacity="0.7" />
        <circle cx="50" cy="80" r="1.5" fill="#FFFFFF" opacity="0.5" />
        <circle cx="56" cy="80" r="1.5" fill="#138808" opacity="0.7" />
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
      <IndiaBitcoinWordmark size={wordmarkSize} />
    </a>
  );
}
