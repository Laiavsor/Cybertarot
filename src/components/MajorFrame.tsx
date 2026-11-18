/* Рамка старшего аркана поверх нейро-арта:
   схемный неоновый контур, угловые сигилы, цифра сверху, плашка-название снизу.
   Текст всегда чёткий — SVG, впечённой в картинку типографики нет. */

interface Props {
  numeral: string;
  title: string;
  epithet: string;
}

/** один угловой схемный узел; используется 4 раза через <use> с поворотами */
function CornerNode() {
  return (
    <g stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9">
      <path d="M 16 52 V 30 A 14 14 0 0 1 30 16 H 52" />
      <path d="M 16 84 V 66 H 34 V 50" opacity="0.75" />
      <path d="M 84 16 H 66 V 34" opacity="0.75" />
      <circle cx="34" cy="50" r="2.6" fill="#00f0ff" stroke="none" />
      <circle cx="66" cy="34" r="2.6" fill="#00f0ff" stroke="none" />
      <circle cx="52" cy="16" r="2" fill="#ff2ea6" stroke="none" />
    </g>
  );
}

export default function MajorFrame({ numeral, title, epithet }: Props) {
  const uid = `mf-${title.replace(/\s+/g, '')}`;
  return (
    <svg viewBox="0 0 300 500" width="100%" height="100%" aria-hidden="true"
         style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'drop-shadow(0 0 6px rgba(0,240,255,.35))' }}>
      <defs>
        <linearGradient id={`${uid}-frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00f0ff" />
          <stop offset="0.45" stopColor="#35e0ff" />
          <stop offset="0.72" stopColor="#8a5cff" />
          <stop offset="1" stopColor="#ff2ea6" />
        </linearGradient>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00f0ff" />
          <stop offset="1" stopColor="#ff2ea6" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* внешний схемный контур */}
      <rect x="8" y="8" width="284" height="484" rx="14" fill="none" stroke={`url(#${uid}-frame)`} strokeWidth="3.4" strokeOpacity="0.95" />
      <rect x="14.5" y="14.5" width="271" height="471" rx="10" fill="none" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="16 9" />

      {/* угловые схемные узлы (зеркалим поворотами) */}
      <g id={`${uid}-c`}><CornerNode /></g>
      <use href={`#${uid}-c`} transform="rotate(90 150 250)" />
      <use href={`#${uid}-c`} transform="rotate(180 150 250)" />
      <use href={`#${uid}-c`} transform="rotate(270 150 250)" />

      {/* угловые сигилы: дельта слева, глаз справа */}
      <g transform="translate(38 116)" stroke="#00f0ff" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.95">
        <path d="M 0 -11 L 10 8 H -10 Z" strokeLinejoin="round" />
        <path d="M -4.5 1.5 H 4.5" strokeWidth="1.6" />
      </g>
      <g transform="translate(262 116)" stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.95">
        <circle r="8.4" />
        <circle r="3.4" fill="#ff2ea6" stroke="none" />
      </g>
      <g transform="translate(38 384)" stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.95">
        <circle r="8.4" />
        <circle r="3.4" fill="#ff2ea6" stroke="none" />
      </g>
      <g transform="translate(262 384)" stroke="#00f0ff" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.95">
        <path d="M 0 -11 L 10 8 H -10 Z" />
        <path d="M -4.5 1.5 H 4.5" strokeWidth="1.6" />
      </g>

      {/* цифра сверху */}
      <text x="150" y="66" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="900"
            fontSize="46" letterSpacing="10" fill="#c9ffff" stroke="#030a14" strokeWidth="7"
            paintOrder="stroke fill" filter={`url(#${uid}-soft)`}>
        {numeral}
      </text>

      {/* боковые засечки */}
      <g stroke="#00f0ff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
        <path d="M 8 236 h 8 M 8 246 h 12 M 8 256 h 8" />
        <path d="M 292 236 h -8 M 292 246 h -12 M 292 256 h -8" />
      </g>

      {/* плашка-название снизу */}
      <path d="M 34 424 L 46 410 H 254 L 266 424 V 478 L 254 492 H 46 L 34 478 Z"
            fill="rgba(4,8,18,0.82)" stroke={`url(#${uid}-plate)`} strokeWidth="1.8" strokeOpacity="0.95" />
      <text x="150" y="447" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="800"
            fontSize="21" letterSpacing="2" fill="#ffffff" stroke="#030a14" strokeWidth="4"
            paintOrder="stroke fill" textLength="196" lengthAdjust="spacingAndGlyphs" filter={`url(#${uid}-soft)`}>
        {title}
      </text>
      <text x="150" y="471" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="9"
            letterSpacing="4.5" fill="#ffb000">
        {epithet}
      </text>
    </svg>
  );
}
