/* Процедурный SVG-арт для младших арканов:
   классические pip-раскладки + киберпанк-эмблемы мастей */
import { useMemo } from 'react';
import { SUIT_META, type Suit, type TarotCard } from '../data/cards';

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

/** Эмблема масти в локальных координатах, центр (0,0), «радиус» ~1 */
function SuitEmblem({ suit, color, strokeWidth = 0.085, opacity = 1 }: { suit: Suit; color: string; strokeWidth?: number; opacity?: number }) {
  const sw = strokeWidth;
  switch (suit) {
    case 'swords':
      return (
        <g stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" opacity={opacity}>
          <path d="M 0 -1 L 0.13 -0.55 L 0.13 0.18 L -0.13 0.18 L -0.13 -0.55 Z" fill={color} fillOpacity="0.22" />
          <path d="M 0 -0.78 L 0 0.1" strokeWidth={sw * 0.55} opacity="0.85" />
          <path d="M -0.36 0.3 L 0.36 0.3" />
          <path d="M 0 0.3 L 0 0.66" />
          <circle cx="0" cy="0.78" r="0.13" fill={color} fillOpacity="0.3" />
        </g>
      );
    case 'banks':
      return (
        <g stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" opacity={opacity}>
          <rect x="-0.34" y="-0.62" width="0.68" height="1.24" rx="0.13" fill={color} fillOpacity="0.16" />
          <path d="M -0.34 -0.42 L 0.34 -0.42" opacity="0.7" strokeWidth={sw * 0.7} />
          <rect x="-0.13" y="-0.74" width="0.26" height="0.12" rx="0.05" fill={color} fillOpacity="0.35" stroke="none" />
          <path d="M 0.08 -0.16 L -0.2 0.18 L 0.02 0.18 L -0.08 0.5 L 0.22 0.06 L 0.0 0.06 Z" fill={color} stroke="none" opacity="0.95" />
        </g>
      );
    case 'wires':
      return (
        <g stroke={color} strokeWidth={sw} strokeLinecap="round" opacity={opacity} fill="none">
          <circle cx="0" cy="-0.12" r="0.16" fill={color} fillOpacity="0.3" />
          <circle cx="0" cy="-0.12" r="0.34" opacity="0.85" />
          <circle cx="0" cy="-0.12" r="0.52" opacity="0.6" />
          <circle cx="0" cy="-0.12" r="0.68" opacity="0.35" strokeWidth={sw * 0.7} />
          <path d="M -0.34 0.42 C -0.34 0.62 -0.42 0.7 -0.5 0.82" />
          <path d="M 0 0.56 L 0 0.86" />
          <path d="M 0.34 0.42 C 0.34 0.62 0.42 0.7 0.5 0.82" />
          <circle cx="-0.5" cy="0.88" r="0.06" fill={color} stroke="none" />
          <circle cx="0" cy="0.92" r="0.06" fill={color} stroke="none" />
          <circle cx="0.5" cy="0.88" r="0.06" fill={color} stroke="none" />
        </g>
      );
    case 'nuyen':
      return (
        <g stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" opacity={opacity} fill="none">
          <circle cx="0" cy="0" r="0.54" fill={color} fillOpacity="0.14" />
          <circle cx="0" cy="0" r="0.37" strokeDasharray="0.12 0.09" opacity="0.8" strokeWidth={sw * 0.7} />
          <path d="M -0.21 -0.22 L 0 0.02 L 0.21 -0.22" />
          <path d="M 0 0.02 L 0 0.3" />
          <path d="M -0.17 0.08 L 0.17 0.08" strokeWidth={sw * 0.8} />
          <path d="M -0.17 0.21 L 0.17 0.21" strokeWidth={sw * 0.8} />
        </g>
      );
  }
}

/** Координаты pip-символов для 1..10 (отн. viewBox 300×500) */
const PIP_LAYOUTS: Record<number, [number, number, number][]> = {
  1: [[150, 248, 1.85]],
  2: [[150, 170, 1.25], [150, 330, 1.25]],
  3: [[150, 164, 1.1], [150, 250, 1.1], [150, 336, 1.1]],
  4: [[110, 172, 1.2], [190, 172, 1.2], [110, 330, 1.2], [190, 330, 1.2]],
  5: [[110, 172, 1.1], [190, 172, 1.1], [150, 250, 1.1], [110, 330, 1.1], [190, 330, 1.1]],
  6: [[110, 156, 1.0], [190, 156, 1.0], [110, 250, 1.0], [190, 250, 1.0], [110, 344, 1.0], [190, 344, 1.0]],
  7: [[110, 156, 0.95], [190, 156, 0.95], [150, 202, 0.78], [110, 250, 0.95], [190, 250, 0.95], [110, 344, 0.95], [190, 344, 0.95]],
  8: [[110, 140, 0.88], [190, 140, 0.88], [110, 212, 0.88], [190, 212, 0.88], [110, 288, 0.88], [190, 288, 0.88], [110, 364, 0.88], [190, 364, 0.88]],
  9: [[110, 140, 0.84], [190, 140, 0.84], [110, 212, 0.84], [190, 212, 0.84], [150, 251, 0.95], [110, 290, 0.84], [190, 290, 0.84], [110, 362, 0.84], [190, 362, 0.84]],
  10: [[110, 138, 0.8], [190, 138, 0.8], [150, 176, 0.62], [110, 213, 0.8], [190, 213, 0.8], [110, 290, 0.8], [190, 290, 0.8], [150, 327, 0.62], [110, 365, 0.8], [190, 365, 0.8]],
};

const CROWN = 'M -30 -62 L -22 -80 L -10 -64 L 0 -82 L 10 -64 L 22 -80 L 30 -62 Z';

function CourtGlyph({ rank, color }: { rank: number; color: string }) {
  switch (rank) {
    case 11: // PAGE — одинокая искра-звезда
      return <path d="M 150 128 L 154.5 141 L 168 145.5 L 154.5 150 L 150 163 L 145.5 150 L 132 145.5 L 145.5 141 Z" fill={color} opacity="0.95" />;
    case 12: // KNIGHT — шевроны скорости
      return (
        <g stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
          <path d="M 206 118 L 224 133 L 206 148" />
          <path d="M 222 118 L 240 133 L 222 148" opacity="0.6" />
        </g>
      );
    case 13: // QUEEN — корона
      return <path d={CROWN} transform="translate(150 172)" fill={color} fillOpacity="0.9" stroke="#05070d" strokeWidth="1.5" />;
    case 14: // KING — корона + двойная кайма (рендерится рамкой ниже)
      return <path d={CROWN} transform="translate(150 172) scale(1.15)" fill={color} fillOpacity="0.95" stroke="#05070d" strokeWidth="1.5" />;
    default:
      return null;
  }
}

const CIRCUIT_VARIANTS: string[][] = [
  ['M 30 118 h 34 v 18 h 22', 'M 270 118 h -30 v 24 h -26', 'M 26 400 h 40 v -14', 'M 274 400 h -44 v -14'],
  ['M 30 132 h 22 v 26 h 30', 'M 270 128 h -24 v 18 h -34', 'M 30 388 h 30 v -22 h 26', 'M 270 388 h -28 v -26 h -30'],
  ['M 26 126 h 46', 'M 274 126 h -46', 'M 26 394 h 46', 'M 274 394 h -46'],
];

export default function MinorArt({ card }: { card: TarotCard }) {
  const suit = card.suit!;
  const meta = SUIT_META[suit];
  const c = meta.color;
  const seed = hash(card.id);
  const rank = card.rank!;
  const isCourt = rank >= 11;
  const isAce = rank === 1;
  const variant = CIRCUIT_VARIANTS[seed % CIRCUIT_VARIANTS.length];
  const uid = `g-${card.id}`;

  const pips = PIP_LAYOUTS[Math.min(rank, 10)] || [];

  return (
    <svg viewBox="0 0 300 500" width="100%" height="100%" role="img" aria-label={card.nameEn} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1626" />
          <stop offset="0.5" stopColor="#070c18" />
          <stop offset="1" stopColor="#04070f" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.46" r="0.62">
          <stop offset="0" stopColor={c} stopOpacity="0.34" />
          <stop offset="0.55" stopColor={c} stopOpacity="0.07" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-neon`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="b1" />
          <feGaussianBlur stdDeviation="8" result="b2" />
          <feMerge>
            <feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* фон */}
      <rect width="300" height="500" fill={`url(#${uid}-bg)`} />
      <rect width="300" height="500" fill={`url(#${uid}-glow)`} />

      {/* цепи по краям */}
      <g stroke={c} strokeWidth="1.6" fill="none" opacity="0.35">
        {variant.map((d, i) => <path key={i} d={d} />)}
        {variant.map((_, i) => <circle key={`c${i}`} cx={i % 2 === 0 ? 96 : 204} cy={i < 2 ? 131 : 388} r="2.4" fill={c} stroke="none" />)}
      </g>

      {/* рамки */}
      <rect x="7" y="7" width="286" height="486" rx="12" fill="none" stroke={c} strokeWidth={rank === 14 ? 3.4 : 2} strokeOpacity="0.85" />
      <rect x="13" y="13" width="274" height="474" rx="8" fill="none" stroke={c} strokeWidth="1" strokeOpacity="0.3" />
      {/* угловые зарубки */}
      <g stroke={c} strokeWidth="4" strokeLinecap="round" opacity="0.95">
        <path d="M 7 40 V 19 A 12 12 0 0 1 19 7 H 40" fill="none" />
        <path d="M 293 40 V 19 A 12 12 0 0 0 281 7 H 260" fill="none" />
        <path d="M 7 460 V 481 A 12 12 0 0 0 19 493 H 40" fill="none" />
        <path d="M 293 460 V 481 A 12 12 0 0 1 281 493 H 260" fill="none" />
      </g>

      {/* верхняя плашка: ранг + масть */}
      <rect x="34" y="24" width="232" height="58" rx="6" fill="#050a14" stroke={c} strokeOpacity="0.65" strokeWidth="1.4" />
      <text x="150" y="50" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="700" fontSize="17" letterSpacing="3" fill="#f2fbff">
        {['ACE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN','PAGE','KNIGHT','QUEEN','KING'][rank - 1]}
      </text>
      <text x="150" y="72" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="10.5" letterSpacing="6" fill={c}>
        OF {meta.nameEn}
      </text>

      {/* центр */}
      {isAce && (
        <g filter={`url(#${uid}-neon)`}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r1 = 74, r2 = i % 2 ? 108 : 128;
            return <line key={i} x1={150 + Math.cos(a) * r1} y1={250 + Math.sin(a) * r1} x2={150 + Math.cos(a) * r2} y2={250 + Math.sin(a) * r2} stroke={c} strokeWidth="2" strokeOpacity="0.55" />;
          })}
          <g transform="translate(150 250) scale(34)"><SuitEmblem suit={suit} color={c} strokeWidth={0.1} /></g>
        </g>
      )}
      {!isAce && !isCourt && (
        <g filter={`url(#${uid}-neon)`}>
          {PIP_LAYOUTS[rank].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${15 * s})`}><SuitEmblem suit={suit} color={c} /></g>
          ))}
        </g>
      )}
      {isCourt && (
        <g filter={`url(#${uid}-neon)`}>
          {/* ореол */}
          <circle cx="150" cy="252" r="86" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.5" />
          <circle cx="150" cy="252" r="72" fill="none" stroke={c} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="6 6" />
          <CourtGlyph rank={rank} color={c} />
          <g transform="translate(150 256) scale(27)"><SuitEmblem suit={suit} color={c} strokeWidth={0.1} /></g>
        </g>
      )}

      {/* нижняя плашка: эпитет */}
      <rect x="30" y="412" width="240" height="46" rx="6" fill="#050a14" stroke={c} strokeOpacity="0.5" strokeWidth="1.2" />
      <text x="150" y="432" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="500" fontSize="9.5" letterSpacing="4" fill="#ffb000">
        {card.epithet}
      </text>
      <text x="150" y="450" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="8" letterSpacing="5" fill="#5c7186">
        {meta.title}
      </text>
    </svg>
  );
}
