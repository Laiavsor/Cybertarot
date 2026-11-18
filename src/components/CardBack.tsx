/* Рубашка карты — неоновая «мандала взлома» (чистый SVG, без ассетов) */
export default function CardBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 500" className={className} width="100%" height="100%" role="img" aria-label="CyberTarot" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cb-bg" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#141f38" /><stop offset="0.6" stopColor="#0a101f" /><stop offset="1" stopColor="#05070d" />
        </radialGradient>
        <pattern id="cb-grid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 9 6 V 12 M 6 9 H 12" stroke="#00f0ff" strokeOpacity="0.16" strokeWidth="1.4" />
        </pattern>
        <linearGradient id="cb-eye" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00f0ff" /><stop offset="0.5" stopColor="#a259ff" /><stop offset="1" stopColor="#ff2ea6" />
        </linearGradient>
      </defs>

      <rect width="300" height="500" fill="url(#cb-bg)" />
      <rect width="300" height="500" fill="url(#cb-grid)" />
      <rect x="8" y="8" width="284" height="484" rx="12" fill="none" stroke="#00f0ff" strokeOpacity="0.8" strokeWidth="2.4" />
      <rect x="15" y="15" width="270" height="470" rx="8" fill="none" stroke="#ff2ea6" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="10 6" />

      {/* центральная мандала */}
      <g transform="translate(150 218)" fill="none" strokeLinecap="round">
        <circle r="96" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.55" />
        <circle r="118" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 10" />
        <circle r="72" stroke="#ff2ea6" strokeWidth="2.4" strokeOpacity="0.75" strokeDasharray="30 12" />
        <circle r="48" stroke="#ffb000" strokeWidth="1.4" strokeOpacity="0.7" strokeDasharray="2 6" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          return (
            <line key={i} x1={Math.cos(a) * 74} y1={Math.sin(a) * 74} x2={Math.cos(a) * 94} y2={Math.sin(a) * 94}
              stroke="#00f0ff" strokeWidth="4" strokeOpacity="0.8" />
          );
        })}
        {/* глаз */}
        <path d="M -58 0 C -30 -36 30 -36 58 0 C 30 36 -30 36 -58 0 Z" stroke="url(#cb-eye)" strokeWidth="4.5" strokeLinejoin="round" />
        <circle r="17" stroke="#00f0ff" strokeWidth="3" />
        <circle r="6" fill="#ff2ea6" stroke="none" />
      </g>

      {/* шины данных сверху и снизу */}
      <g stroke="#00f0ff" strokeOpacity="0.65" strokeWidth="2">
        <path d="M 34 74 H 108 V 96 H 150" fill="none" />
        <path d="M 266 74 H 192 V 96 H 150" fill="none" opacity="0.65" />
        <path d="M 34 362 H 108 V 340 H 150" fill="none" opacity="0.65" />
        <path d="M 266 362 H 192 V 340 H 150" fill="none" />
      </g>
      <circle cx="150" cy="96" r="3.4" fill="#ffb000" />
      <circle cx="150" cy="340" r="3.4" fill="#ffb000" />

      <text x="150" y="432" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="700" fontSize="16" letterSpacing="7" fill="#eaffff" opacity="0.92">CYBER</text>
      <text x="150" y="452" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="900" fontSize="16" letterSpacing="7" fill="#ff2ea6" opacity="0.95">TAROT</text>
    </svg>
  );
}
