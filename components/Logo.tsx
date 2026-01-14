
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="ksBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c2ff" />
            <stop offset="50%" stopColor="#006699" />
            <stop offset="100%" stopColor="#003366" />
          </linearGradient>
          <linearGradient id="lOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffba00" />
            <stop offset="50%" stopColor="#ff6600" />
            <stop offset="100%" stopColor="#cc3300" />
          </linearGradient>
          <linearGradient id="orbitGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#003366" />
            <stop offset="30%" stopColor="#00c2ff" />
            <stop offset="70%" stopColor="#ffba00" />
            <stop offset="100%" stopColor="#ff4e00" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* The Orbiting Ring */}
        <path 
          d="M60,140 C20,100 80,40 200,40 C320,40 380,100 340,140 C300,180 180,210 60,140Z" 
          stroke="url(#orbitGrad)" 
          strokeWidth="12" 
          fill="none" 
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* KSL Lettering with 3D effect via fake shadows/offsets */}
        <g transform="translate(80, 160) skewX(-15)">
          {/* K and S */}
          <text 
            x="0" y="0" 
            fill="url(#ksBlue)" 
            fontSize="100" 
            fontWeight="900" 
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-5px' }}
          >
            KS
          </text>
          {/* L */}
          <text 
            x="125" y="0" 
            fill="url(#lOrange)" 
            fontSize="100" 
            fontWeight="900" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            L
          </text>
        </g>

        {/* The Star/Sparkle on the orbit */}
        <g transform="translate(320, 55)">
          <path 
            d="M0,-25 L5, -5 L25, 0 L5, 5 L0, 25 L-5, 5 L-25, 0 L-5,-5 Z" 
            fill="#ffba00"
            filter="url(#glow)"
          />
        </g>
      </svg>
    </div>
  );
};

export const BrandName: React.FC = () => (
  <div className="flex items-center font-black italic tracking-tighter text-2xl md:text-3xl select-none">
    <span className="text-[#003366]">Kondtec</span>
    <span className="text-[#ff4e00] ml-1.5">Logo</span>
  </div>
);
