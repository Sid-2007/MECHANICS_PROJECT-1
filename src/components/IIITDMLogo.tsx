/**
 * @file IIITDMLogo.tsx
 * Official emblem of Pandit Dwarka Prasad Mishra
 * Indian Institute of Information Technology, Design and Manufacturing (PDPM IIITDM) Jabalpur.
 * Employs the official high-resolution institutional seal with fallback to an authentic vector crest.
 */
import React, { useState } from 'react';

interface IIITDMLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const IIITDMLogo: React.FC<IIITDMLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Official Insignia Frame */}
      <div
        className="relative shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        {!imageError ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/en/1/18/Iiitdmj-logo.jpg"
            alt="Official Logo of PDPM IIITDM Jabalpur"
            className="w-full h-full object-contain rounded-full bg-white select-none pointer-events-none"
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          /* High-Definition SVG Fallback Emblem */
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full bg-slate-950"
            aria-label="PDPM IIITDM Jabalpur Logo"
          >
            <defs>
              <radialGradient id="iiitdm-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
              <radialGradient id="iiitdm-blue" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="70%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <linearGradient id="iiitdm-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Outer Circular Base */}
            <circle cx="60" cy="60" r="58" fill="url(#iiitdm-blue)" stroke="#f59e0b" strokeWidth="2.5" />

            {/* Industrial Gear Teeth (Manufacturing) */}
            <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.95">
              {[...Array(16)].map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x1 = 60 + 51 * Math.cos(rad);
                const y1 = 60 + 51 * Math.sin(rad);
                const x2 = 60 + 57 * Math.cos(rad);
                const y2 = 60 + 57 * Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>

            {/* Inner Ring */}
            <circle cx="60" cy="60" r="46" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
            <circle cx="60" cy="60" r="42" fill="#09142e" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Text Inscriptions */}
            <path id="textArcTop" d="M 23,60 A 37,37 0 0,1 97,60" fill="none" />
            <text className="text-[6.5px] font-mono font-bold tracking-widest uppercase fill-amber-300">
              <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
                IIITDM JABALPUR
              </textPath>
            </text>

            <path id="textArcBottom" d="M 97,60 A 37,37 0 0,1 23,60" fill="none" />
            <text className="text-[5.5px] font-mono font-medium tracking-wider uppercase fill-cyan-300">
              <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
                ESTD • 2005 • INDIA
              </textPath>
            </text>

            {/* Central Core */}
            <circle cx="60" cy="60" r="26" fill="#04091a" stroke="url(#iiitdm-gold)" strokeWidth="1.5" />

            {/* IT Orbits */}
            <ellipse cx="60" cy="60" rx="20" ry="8" transform="rotate(-30 60 60)" fill="none" stroke="#38bdf8" strokeWidth="0.9" opacity="0.8" />
            <ellipse cx="60" cy="60" rx="20" ry="8" transform="rotate(30 60 60)" fill="none" stroke="#f59e0b" strokeWidth="0.9" opacity="0.8" />

            {/* Flame of Knowledge */}
            <path
              d="M60 41 C56 46, 54 50, 56 55 C57 58, 63 58, 64 55 C66 50, 64 46, 60 41 Z"
              fill="url(#iiitdm-gold)"
            />
            <path
              d="M60 44 C58 47, 57 49, 58 52 C59 54, 61 54, 62 52 C63 49, 62 47, 60 44 Z"
              fill="#fff"
              opacity="0.85"
            />

            {/* Open Book of Engineering Design */}
            <path
              d="M48 67 C53 65, 57 66, 60 68 C63 66, 67 65, 72 67 L70 71 C66 69, 62 70, 60 72 C58 70, 54 69, 50 71 Z"
              fill="url(#iiitdm-cyan)"
            />
            <line x1="60" y1="68" x2="60" y2="72" stroke="#f59e0b" strokeWidth="1.2" />
          </svg>
        )}
      </div>

      {/* Optional Side Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
            PDPM IIITDM JABALPUR
          </div>
          <div className="text-[9px] sm:text-[10px] font-sans text-slate-300 tracking-tight">
            Engineering Mechanics • Group Project
          </div>
        </div>
      )}
    </div>
  );
};
