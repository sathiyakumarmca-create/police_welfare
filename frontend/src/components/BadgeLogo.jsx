import React from 'react';

export default function BadgeLogo({ size = "lg", className = "" }) {
  const dimensions = size === "sm" ? "w-16 h-16" : size === "md" ? "w-28 h-28" : "w-44 h-44 sm:w-52 sm:h-52";

  return (
    <div className={`relative inline-flex items-center justify-center filter drop-shadow-2xl ${dimensions} ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full transform transition duration-500 hover:scale-105">
        <defs>
          <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#900C3F" />
            <stop offset="50%" stopColor="#7A0016" />
            <stop offset="100%" stopColor="#4A000E" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A1" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997A15" />
          </linearGradient>

          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Serrated Red Gear / Star Edge */}
        <g fill="url(#maroonGrad)" stroke="url(#goldGrad)" strokeWidth="4">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const rOuter = 180;
            const rInner = 165;
            const x1 = 200 + rOuter * Math.cos(rad);
            const y1 = 200 + rOuter * Math.sin(rad);
            const radNext = ((angle + 7.5) * Math.PI) / 180;
            const x2 = 200 + rInner * Math.cos(radNext);
            const y2 = 200 + rInner * Math.sin(radNext);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="12" strokeLinecap="round" />;
          })}
          <circle cx="200" cy="200" r="168" fill="url(#maroonGrad)" stroke="url(#goldGrad)" strokeWidth="6" />
        </g>

        {/* Inner White Field */}
        <circle cx="200" cy="200" r="148" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="4" />

        {/* Golden Sun Rays Top Semicircle */}
        <g fill="url(#goldGrad)">
          {[-60, -40, -20, 0, 20, 40, 60].map((angle, idx) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = 200 + 75 * Math.cos(rad);
            const y1 = 180 + 75 * Math.sin(rad);
            const x2 = 200 + 138 * Math.cos(rad - 0.12);
            const y2 = 180 + 138 * Math.sin(rad - 0.12);
            const x3 = 200 + 138 * Math.cos(rad + 0.12);
            const y3 = 180 + 138 * Math.sin(rad + 0.12);
            return <polygon key={idx} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} />
          })}
        </g>

        {/* Green Support Leaves / Open Hands */}
        <path
          d="M 85 240 C 95 310, 160 325, 200 325 C 240 325, 305 310, 315 240 C 275 285, 230 295, 200 295 C 170 295, 125 285, 85 240 Z"
          fill="url(#greenGrad)"
        />
        <path
          d="M 98 210 Q 145 280 200 285 Q 255 280 302 210 Q 255 260 200 265 Q 145 260 98 210 Z"
          fill="#166534"
          opacity="0.8"
        />

        {/* Police Officer Silhouette in Center */}
        <g fill="#1E293B">
          {/* Police Cap */}
          <path d="M 160 135 Q 200 120 240 135 Q 248 145 242 152 Q 200 142 158 152 Q 152 145 160 135 Z" />
          <ellipse cx="200" cy="130" rx="35" ry="12" fill="#0F172A" />
          {/* Officer Badge Star on Cap */}
          <polygon points="200,123 203,129 210,129 204,133 206,139 200,135 194,139 196,133 190,129 197,129" fill="url(#goldGrad)" />

          {/* Head & Shoulders */}
          <circle cx="200" cy="155" r="16" />
          <path d="M 150 200 C 150 178, 170 172, 200 172 C 230 172, 250 178, 250 200 L 250 215 L 150 215 Z" />
          
          {/* Collar & Uniform Detail */}
          <polygon points="200,178 185,200 215,200" fill="#FFFFFF" />
          <polygon points="200,185 193,200 207,200" fill="#900C3F" />
        </g>

        {/* Red Cross / Health Emblem (Left) */}
        <g transform="translate(130, 208) scale(0.7)">
          <circle cx="20" cy="20" r="18" fill="#DC2626" />
          <path d="M 20 8 L 20 32 M 8 20 L 32 20" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Family Icon Silhouette (Center-Right Front) */}
        <g fill="#0F172A" transform="translate(180, 220) scale(0.65)">
          {/* Father */}
          <circle cx="15" cy="15" r="8" />
          <path d="M 0 45 C 0 30, 10 25, 15 25 C 20 25, 30 30, 30 45 Z" />
          {/* Mother */}
          <circle cx="45" cy="17" r="7" stroke="#0F172A" strokeWidth="1" />
          <path d="M 32 45 C 32 32, 40 27, 45 27 C 50 27, 58 32, 58 45 Z" />
          {/* Children */}
          <circle cx="30" cy="30" r="5" />
          <path d="M 22 45 C 22 38, 27 35, 30 35 C 33 35, 38 38, 38 45 Z" />
        </g>

        {/* Ribbon Banner at Bottom */}
        <g filter="url(#glow)">
          {/* Ribbon Wings */}
          <path d="M 40 315 L 80 295 L 80 335 L 40 335 Z" fill="#7A0016" />
          <path d="M 360 315 L 320 295 L 320 335 L 360 335 Z" fill="#7A0016" />
          {/* Main Banner Box */}
          <rect x="60" y="300" width="280" height="42" rx="6" fill="url(#maroonGrad)" stroke="url(#goldGrad)" strokeWidth="3" />
          {/* Tamil Text in Banner */}
          <text
            x="200"
            y="327"
            fontFamily="'Noto Sans Tamil', sans-serif"
            fontWeight="bold"
            fontSize="18"
            fill="#FFF099"
            textAnchor="middle"
          >
            காவலர் குடும்ப நல அறக்கட்டளை
          </text>
        </g>
      </svg>
    </div>
  );
}
