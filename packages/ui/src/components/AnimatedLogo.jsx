import React from 'react';

export function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center justify-center animated-logo">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes dropBounce {
          0% { transform: translateY(-40px); opacity: 0; }
          50% { opacity: 1; }
          70% { transform: translateY(0); opacity: 1; }
          85% { transform: translateY(-4px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .anim-glass { animation: fadeScale 0.4s ease-out 0s both; transform-origin: 45px 50px; }
        .anim-cap { animation: dropBounce 0.8s ease-in-out 0.2s both; }
        .anim-text { animation: fadeUp 0.6s ease-out 0.8s both; }
        
        /* Exported class for login forms to use */
        .login-form-anim { animation: fadeUp 0.6s ease-out 1.2s both; }
      `}} />

      {/* SVG Icon */}
      <svg viewBox="0 0 100 100" className="w-[60px] h-[60px] overflow-visible mb-1.5">
        {/* Glass Group */}
        <g className="anim-glass">
          {/* Handle */}
          <line x1="56" y1="64" x2="78" y2="86" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
          {/* Circle */}
          <circle cx="45" cy="50" r="19" stroke="#0f172a" strokeWidth="8" fill="none" />
        </g>
        
        {/* Cap Group */}
        <g className="anim-cap">
          {/* Base */}
          <path d="M 27 38 L 27 48 Q 45 56 63 48 L 63 38 Z" fill="#0f172a" />
          {/* Board */}
          <polygon points="45,20 77,32 45,44 13,32" fill="#0f172a" />
          {/* Button */}
          <circle cx="45" cy="32" r="2.5" fill="#1e293b" />
          {/* Tassel String */}
          <path d="M 45 32 Q 67 33 67 46" fill="none" stroke="#6C35DE" strokeWidth="2.5" />
          {/* Tassel End */}
          <rect x="64" y="46" width="6" height="12" fill="#6C35DE" rx="1.5" />
        </g>
      </svg>

      {/* Text */}
      <div className="anim-text flex items-center text-[28px] font-black tracking-tight leading-none">
        <span className="text-[#0f172a]">juno</span>
        <span className="text-[#6C35DE]">space</span>
      </div>
    </div>
  );
}
