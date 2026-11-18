import { useMemo, useState } from 'react';
import { CARDS, SUIT_META, SUIT_ORDER, type Suit, type TarotCard } from '../data/cards';
import { sfx } from '../lib/sfx';
import CardFace from './CardFace';
import CardDetail from './CardDetail';

type Filter = 'all' | 'major' | Suit;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'ВСЕ · 78' },
  { id: 'major', label: 'СТАРШИЕ · 22' },
  { id: 'swords', label: 'МЕЧИ · SWORDS' },
  { id: 'banks', label: 'БАНКИ · BANKS' },
  { id: 'wires', label: 'ПРОВОДА · WIRES' },
  { id: 'nuyen', label: 'НЬЮЕНЫ · NUYEN' },
];

export default function Library() {
  const [filter, setFilter] = useState<Filter>('all');
  const [detail, setDetail] = useState<TarotCard | null>(null);

  const list = useMemo(() => {
    if (filter === 'all') return CARDS;
    if (filter === 'major') return CARDS.filter((c) => c.arcana === 'major');
    return CARDS.filter((c) => c.suit === filter);
  }, [filter]);

  return (
    <div>
      <div className="lib-head">
        <h2>▦ КОЛОДА</h2>
        <span className="lib-count">ПОКАЗАНО: {list.length}</span>
      </div>
      <div className="chip-row" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id}
                  className={`chip ${filter === f.id ? 'active' : ''}`}
                  style={filter === f.id && f.id !== 'all' && f.id !== 'major' ? { background: SUIT_META[f.id as Suit].color, borderColor: SUIT_META[f.id as Suit].color } : undefined}
                  onClick={() => { sfx.blip(); setFilter(f.id); }}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {list.map((c) => (
          <button key={c.id} className="lib-cell" onClick={() => { sfx.blip(); setDetail(c); }}>
            <CardFace card={c} width={undefined} />
            <span className="lc-name"><b>{c.nameEn}</b>{c.nameRu}{c.arcana === 'minor' && c.suit ? ` · ${SUIT_META[c.suit].nameRu}` : ''}</span>
          </button>
        ))}
      </div>
      {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
