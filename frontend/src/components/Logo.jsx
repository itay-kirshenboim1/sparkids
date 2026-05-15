export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="50%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
        <linearGradient id="wandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1"/>
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.6"/>
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="12" fill="url(#grad1)"/>

      {/* Glow behind star */}
      <circle cx="14" cy="14" r="9" fill="white" opacity="0.15">
        <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite"/>
      </circle>

      {/* Magic wand stick */}
      <line x1="19" y1="19" x2="33" y2="33" stroke="url(#wandGrad)" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="19" y1="19" x2="33" y2="33" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>

      {/* Star at top of wand */}
      <g filter="url(#glow)">
        <path d="M14,5 L15.8,10.5 L21.5,10.5 L17,14 L18.7,19.5 L14,16 L9.3,19.5 L11,14 L6.5,10.5 L12.2,10.5 Z"
          fill="url(#starGlow)">
          <animateTransform attributeName="transform" type="rotate"
            values="0 14 12;15 14 12;0 14 12;-15 14 12;0 14 12"
            dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.8;1" dur="1.5s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* Paint dots — trail */}
      <circle cx="26" cy="8" r="2.2" fill="#fde68a" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2.2;2.8;2.2" dur="1.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="33" cy="12" r="1.6" fill="#f9a8d4" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.2;0.85" dur="1.8s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="35" cy="20" r="1.2" fill="#6ee7b7" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.6s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="5" r="1.4" fill="#a5f3fc" opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.15;0.75" dur="2.1s" begin="0.9s" repeatCount="indefinite"/>
      </circle>

      {/* Sparkle bottom left */}
      <path d="M7,28 L7.8,31 L11,32 L7.8,33 L7,36 L6.2,33 L3,32 L6.2,31 Z"
        fill="white" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.4s" begin="0.4s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="scale"
          values="1;1.3;1" dur="2.4s" begin="0.4s" repeatCount="indefinite"
          additive="sum" transformOrigin="7 32"/>
      </path>
    </svg>
  );
}
