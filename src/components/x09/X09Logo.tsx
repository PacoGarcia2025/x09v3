import React from 'react';

interface X09LogoProps {
  variant?: 'horizontal' | 'circular' | 'emblem' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
}

export const X09Logo: React.FC<X09LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  withGlow = true,
  animated = false,
}) => {
  // Size mapping
  const sizeClasses = {
    sm: variant === 'circular' ? 'w-10 h-10' : 'h-8 max-w-[200px]',
    md: variant === 'circular' ? 'w-16 h-16' : 'h-12 max-w-[280px]',
    lg: variant === 'circular' ? 'w-24 h-24' : 'h-16 max-w-[380px]',
    xl: variant === 'circular' ? 'w-36 h-36' : 'h-24 max-w-[540px]',
    hero: variant === 'circular' ? 'w-48 h-48 sm:w-60 sm:h-60' : 'h-28 sm:h-36 md:h-44 w-full max-w-[620px]',
  };

  /* -------------------------------------------------------------
     VARIANT 1: CIRCULAR EMBLEM (Matching "logo studio x09 v2 circular.png")
     ------------------------------------------------------------- */
  if (variant === 'circular' || variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
        {/* Ambient Neon Glow Aura */}
        {withGlow && (
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-purple-600/40 via-blue-600/30 to-cyan-400/40 blur-xl scale-110 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
        )}

        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Neon Glow Rings */}
            <linearGradient id="circOuterRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c026d3" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            <linearGradient id="circBevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3f4553" />
              <stop offset="50%" stopColor="#12151b" />
              <stop offset="100%" stopColor="#08090c" />
            </linearGradient>

            <radialGradient id="circBgRadial" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#1e1838" />
              <stop offset="50%" stopColor="#0c101a" />
              <stop offset="100%" stopColor="#050608" />
            </radialGradient>

            {/* Neon Edges for X */}
            <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Chrome Metallic Fill for STUDIO */}
            <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="55%" stopColor="#475569" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* 3D Black Body for X09 */}
            <linearGradient id="darkMetalBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252934" />
              <stop offset="40%" stopColor="#12141a" />
              <stop offset="100%" stopColor="#06070a" />
            </linearGradient>

            {/* Glowing filter for neon tubes */}
            <filter id="neonBlurFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Hexagon Pattern Background */}
            <pattern id="hexPattern" width="16" height="27.7" patternUnits="userSpaceOnUse">
              <path
                d="M8 0 L16 4.6 L16 13.8 L8 18.5 L0 13.8 L0 4.6 Z M0 27.7 L8 23.1 L16 27.7"
                fill="none"
                stroke="#2a2e45"
                strokeWidth="0.8"
                strokeOpacity="0.35"
              />
            </pattern>
          </defs>

          {/* 1. Outer Frame Circles with Neon Track */}
          <circle cx="250" cy="250" r="236" fill="#0b0d12" stroke="#1f2430" strokeWidth="4" />
          <circle cx="250" cy="250" r="226" fill="none" stroke="url(#circOuterRing)" strokeWidth="6" filter="url(#neonBlurFilter)" opacity="0.9" />
          <circle cx="250" cy="250" r="218" fill="url(#circBevel)" stroke="#171a23" strokeWidth="4" />

          {/* Inner Plate with Hex Pattern */}
          <circle cx="250" cy="250" r="206" fill="url(#circBgRadial)" />
          <circle cx="250" cy="250" r="206" fill="url(#hexPattern)" />

          {/* Inner Accent Ring */}
          <circle cx="250" cy="250" r="198" fill="none" stroke="#00e5ff" strokeWidth="2.5" opacity="0.8" strokeDasharray="300 8 40 8 180 12" />
          <circle cx="250" cy="250" r="192" fill="none" stroke="#d946ef" strokeWidth="1.5" opacity="0.6" strokeDasharray="80 10 150 10" />

          {/* 2. THE 3D "X" LETTER */}
          {/* Neon Underglow for X */}
          <path
            d="M 68 120 L 140 120 L 220 236 L 278 148 L 224 148 L 194 120 L 290 120 L 330 180 L 300 226 L 350 300 L 280 300 L 198 180 L 126 290 L 64 290 L 158 152 Z"
            fill="none"
            stroke="url(#neonPurple)"
            strokeWidth="14"
            filter="url(#neonBlurFilter)"
            opacity="0.75"
          />

          {/* Solid 3D X Body */}
          <g transform="translate(15, -5)">
            {/* Diagonal 1 (Top Left to Bottom Right) */}
            <path
              d="M 65 130 L 140 130 L 270 295 L 195 295 Z"
              fill="url(#darkMetalBody)"
              stroke="#00e5ff"
              strokeWidth="4"
            />
            {/* Metallic Highlight edge on diagonal 1 */}
            <path
              d="M 68 133 L 136 133 L 265 292"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="2.5"
              opacity="0.9"
            />
            {/* Diagonal 2 (Bottom Left to Top Right) */}
            <path
              d="M 195 130 L 270 130 L 140 295 L 65 295 Z"
              fill="url(#darkMetalBody)"
              stroke="#d946ef"
              strokeWidth="4"
            />
            {/* Top right purple edge reflection */}
            <path
              d="M 198 133 L 266 133 L 144 290"
              fill="none"
              stroke="#f5d0fe"
              strokeWidth="2.5"
              opacity="0.9"
            />
          </g>

          {/* 3. THE 3D "0" (ZERO) */}
          <g transform="translate(20, -5)">
            {/* Outer Hex-squircle Zero */}
            <path
              d="M 270 160 L 305 130 L 345 130 L 380 160 L 380 265 L 345 295 L 305 295 L 270 265 Z"
              fill="url(#darkMetalBody)"
              stroke="#00e5ff"
              strokeWidth="4.5"
            />
            {/* Inner Cutout */}
            <path
              d="M 302 180 L 320 162 L 330 162 L 348 180 L 348 245 L 330 263 L 320 263 L 302 245 Z"
              fill="#080a0f"
              stroke="#a855f7"
              strokeWidth="3.5"
            />
            {/* Top right highlight */}
            <path
              d="M 307 134 L 343 134 L 376 163"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.8"
            />
          </g>

          {/* 4. THE 3D "9" (NINE) */}
          <g transform="translate(25, -5)">
            {/* Outer Nine Shape */}
            <path
              d="M 390 160 L 425 130 L 465 130 L 495 160 L 495 240 L 455 295 L 395 295 L 435 250 L 460 250 L 470 236 L 470 215 L 440 236 L 390 236 Z"
              fill="url(#darkMetalBody)"
              stroke="#d946ef"
              strokeWidth="4.5"
            />
            {/* Nine Inner Cutout */}
            <path
              d="M 420 180 L 436 164 L 452 164 L 466 178 L 466 200 L 452 214 L 436 214 L 420 200 Z"
              fill="#080a0f"
              stroke="#00e5ff"
              strokeWidth="3"
            />
            {/* Neon rim stroke bottom swoop */}
            <path
              d="M 490 230 L 455 293 L 400 293"
              fill="none"
              stroke="#ec4899"
              strokeWidth="3.5"
              filter="url(#neonBlurFilter)"
            />
          </g>

          {/* 5. "STUDIO" CHROME 3D TEXT */}
          <g transform="translate(0, 10)">
            {/* Subtle glow behind STUDIO */}
            <text
              x="250"
              y="348"
              textAnchor="middle"
              fontFamily="'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="48"
              fontWeight="900"
              letterSpacing="6"
              fill="none"
              stroke="#6366f1"
              strokeWidth="6"
              filter="url(#neonBlurFilter)"
              opacity="0.7"
            >
              STUDIO
            </text>

            {/* Front Metallic Chrome STUDIO */}
            <text
              x="250"
              y="348"
              textAnchor="middle"
              fontFamily="'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="48"
              fontWeight="900"
              letterSpacing="6"
              fill="url(#chromeMetal)"
              stroke="#0f172a"
              strokeWidth="1.5"
            >
              STUDIO
            </text>
          </g>

          {/* 6. "2.0" NEON PILL BADGE */}
          <g transform="translate(250, 400)">
            {/* Pill Container */}
            <rect
              x="-95"
              y="-26"
              width="190"
              height="52"
              rx="14"
              fill="#07090e"
              stroke="url(#neonPurple)"
              strokeWidth="3"
            />
            <rect
              x="-92"
              y="-23"
              width="184"
              height="46"
              rx="11"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* "2" in Electric Cyan */}
            <text
              x="-38"
              y="11"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontSize="38"
              fontWeight="900"
              fill="#00e5ff"
              filter="url(#neonBlurFilter)"
              opacity="0.9"
            >
              2
            </text>
            <text
              x="-38"
              y="11"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontSize="38"
              fontWeight="900"
              fill="#ffffff"
            >
              2
            </text>

            {/* Dot "." */}
            <circle cx="-2" cy="7" r="5" fill="#00e5ff" filter="url(#neonBlurFilter)" />
            <circle cx="-2" cy="7" r="3.5" fill="#ffffff" />

            {/* "0" in Electric Magenta */}
            <text
              x="16"
              y="11"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontSize="38"
              fontWeight="900"
              fill="#d946ef"
              filter="url(#neonBlurFilter)"
              opacity="0.9"
            >
              0
            </text>
            <text
              x="16"
              y="11"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontSize="38"
              fontWeight="900"
              fill="#ffffff"
            >
              0
            </text>
          </g>

          {/* 7. SUBTITLE: "IDEIAS EM APLICAÇÕES REAIS" with Laser Whiskers */}
          <g transform="translate(250, 452)">
            {/* Left Laser Bar (Magenta to Purple) */}
            <line x1="-200" y1="-4" x2="-140" y2="-4" stroke="#d946ef" strokeWidth="3" filter="url(#neonBlurFilter)" />
            <line x1="-200" y1="-4" x2="-140" y2="-4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Text */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="'Space Grotesk', system-ui, sans-serif"
              fontSize="12"
              fontWeight="800"
              letterSpacing="5"
              fill="#e2e8f0"
            >
              IDEIAS EM APLICAÇÕES REAIS
            </text>

            {/* Right Laser Bar (Cyan to Blue) */}
            <line x1="140" y1="-4" x2="200" y2="-4" stroke="#00e5ff" strokeWidth="3" filter="url(#neonBlurFilter)" />
            <line x1="140" y1="-4" x2="200" y2="-4" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  /* -------------------------------------------------------------
     VARIANT 2: HORIZONTAL WIDESCREEN BANNER (Matching "logo studio x09 v2.png")
     ------------------------------------------------------------- */
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Dynamic Halo Glow on Hover / Ambient */}
      {withGlow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/30 via-indigo-500/20 to-cyan-500/30 blur-2xl scale-105 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity" />
      )}

      <svg
        viewBox="0 0 1000 300"
        className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Gradients */}
          <linearGradient id="hzPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="35%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <linearGradient id="hzCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="hzDarkMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e3544" />
            <stop offset="25%" stopColor="#171a22" />
            <stop offset="70%" stopColor="#0a0c10" />
            <stop offset="100%" stopColor="#040507" />
          </linearGradient>

          <linearGradient id="hzChrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="48%" stopColor="#94a3b8" />
            <stop offset="52%" stopColor="#334155" />
            <stop offset="85%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <filter id="hzGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. HUGE "X" GLYPH */}
        <g id="letterX">
          {/* Neon Glow Underlay */}
          <path
            d="M 50 35 L 140 35 L 285 225 L 205 225 Z"
            fill="none"
            stroke="url(#hzPurple)"
            strokeWidth="16"
            filter="url(#hzGlow)"
            opacity="0.8"
          />
          <path
            d="M 205 35 L 285 35 L 140 225 L 50 225 Z"
            fill="none"
            stroke="url(#hzCyan)"
            strokeWidth="16"
            filter="url(#hzGlow)"
            opacity="0.8"
          />

          {/* Solid 3D Beveled Diagonal 1 */}
          <path
            d="M 45 40 L 135 40 L 280 220 L 195 220 Z"
            fill="url(#hzDarkMetal)"
            stroke="#d946ef"
            strokeWidth="4"
          />
          {/* Chrome light-edge reflect */}
          <path
            d="M 50 43 L 130 43 L 275 217"
            fill="none"
            stroke="#fbcfe8"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Solid 3D Beveled Diagonal 2 */}
          <path
            d="M 195 40 L 280 40 L 135 220 L 45 220 Z"
            fill="url(#hzDarkMetal)"
            stroke="#00e5ff"
            strokeWidth="4"
          />
          {/* Chrome light-edge reflect */}
          <path
            d="M 198 43 L 275 43 L 140 217"
            fill="none"
            stroke="#cffafe"
            strokeWidth="2.5"
            opacity="0.9"
          />
        </g>

        {/* 2. HUGE "0" (ZERO) GLYPH */}
        <g id="letterZero">
          {/* Outer Octagonal Squircle Zero */}
          <path
            d="M 295 75 L 340 40 L 415 40 L 460 75 L 460 185 L 415 220 L 340 220 L 295 185 Z"
            fill="url(#hzDarkMetal)"
            stroke="#00e5ff"
            strokeWidth="5"
          />
          {/* Inner Zero Cutout */}
          <path
            d="M 345 92 L 365 72 L 390 72 L 410 92 L 410 168 L 390 188 L 365 188 L 345 168 Z"
            fill="#05070a"
            stroke="#a855f7"
            strokeWidth="3.5"
          />
          {/* Top Edge Specular Chrome Line */}
          <path
            d="M 342 45 L 413 45 L 453 77"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            opacity="0.85"
          />
        </g>

        {/* 3. HUGE "9" (NINE) GLYPH */}
        <g id="letterNine">
          {/* Outer Nine */}
          <path
            d="M 470 75 L 515 40 L 590 40 L 635 75 L 635 155 L 575 220 L 490 220 L 540 180 L 585 180 L 600 165 L 600 145 L 565 165 L 470 165 Z"
            fill="url(#hzDarkMetal)"
            stroke="#d946ef"
            strokeWidth="5"
          />
          {/* Inner Cutout */}
          <path
            d="M 520 92 L 540 72 L 565 72 L 585 92 L 585 125 L 565 145 L 540 145 L 520 125 Z"
            fill="#05070a"
            stroke="#00e5ff"
            strokeWidth="3.5"
          />
          {/* Neon lower tail swoop */}
          <path
            d="M 630 150 L 575 218 L 495 218"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="4"
            filter="url(#hzGlow)"
          />
        </g>

        {/* 4. "STUDIO" 3D CHROME BLOCK */}
        <g id="wordStudio" transform="translate(640, 20)">
          {/* Glow Shadow */}
          <text
            x="170"
            y="95"
            textAnchor="middle"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="78"
            fontWeight="900"
            letterSpacing="6"
            fill="none"
            stroke="#818cf8"
            strokeWidth="8"
            filter="url(#hzGlow)"
            opacity="0.75"
          >
            STUDIO
          </text>

          {/* Front Chrome Lettering */}
          <text
            x="170"
            y="95"
            textAnchor="middle"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="78"
            fontWeight="900"
            letterSpacing="6"
            fill="url(#hzChrome)"
            stroke="#090d14"
            strokeWidth="2"
          >
            STUDIO
          </text>
        </g>

        {/* 5. "2.0" NEON HORIZONTAL PILL */}
        <g id="badge20" transform="translate(640, 140)">
          {/* Pill Container */}
          <rect
            x="0"
            y="0"
            width="340"
            height="80"
            rx="20"
            fill="#080b12"
            stroke="url(#hzPurple)"
            strokeWidth="4"
          />
          <rect
            x="4"
            y="4"
            width="332"
            height="72"
            rx="16"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2"
            opacity="0.75"
          />

          {/* "2" In Bright Cyan */}
          <text
            x="85"
            y="60"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="64"
            fontWeight="900"
            fill="#00e5ff"
            filter="url(#hzGlow)"
            opacity="0.95"
          >
            2
          </text>
          <text
            x="85"
            y="60"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="64"
            fontWeight="900"
            fill="#ffffff"
          >
            2
          </text>

          {/* Dot "." */}
          <circle cx="160" cy="54" r="8" fill="#00e5ff" filter="url(#hzGlow)" />
          <circle cx="160" cy="54" r="5" fill="#ffffff" />

          {/* "0" in Electric Magenta */}
          <text
            x="205"
            y="60"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="64"
            fontWeight="900"
            fill="#d946ef"
            filter="url(#hzGlow)"
            opacity="0.95"
          >
            0
          </text>
          <text
            x="205"
            y="60"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="64"
            fontWeight="900"
            fill="#ffffff"
          >
            0
          </text>
        </g>

        {/* 6. SLOGAN BAR: "IDEIAS EM APLICAÇÕES REAIS" */}
        <g id="sloganBar" transform="translate(0, 275)">
          {/* Left Laser line (Magenta) */}
          <line x1="50" y1="-5" x2="220" y2="-5" stroke="#d946ef" strokeWidth="4" filter="url(#hzGlow)" />
          <line x1="50" y1="-5" x2="220" y2="-5" stroke="#ffffff" strokeWidth="1.8" />

          {/* Sleek Chrome Spaced Subtitle */}
          <text
            x="500"
            y="0"
            textAnchor="middle"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="20"
            fontWeight="800"
            letterSpacing="12"
            fill="#f1f5f9"
          >
            IDEIAS EM APLICAÇÕES REAIS
          </text>

          {/* Right Laser line (Cyan) */}
          <line x1="780" y1="-5" x2="950" y2="-5" stroke="#00e5ff" strokeWidth="4" filter="url(#hzGlow)" />
          <line x1="780" y1="-5" x2="950" y2="-5" stroke="#ffffff" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
};
