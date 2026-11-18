import { useCallback, useEffect, useState } from 'react';
import { CARD_MAP } from '../data/cards';
import { getSpread } from '../data/spreads';
import { clearHistory, deleteReading, loadHistory, type SavedReading } from '../lib/storage';
import { sfx } from '../lib/sfx';
import ReadingResult, { type ResultDraw } from './ReadingResult';
import CardDetail from './CardDetail';

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function History() {
  const [items, setItems] = useState<SavedReading[]>([]);
  const [viewing, setViewing] = useState<SavedReading | null>(null);
  const [detail, setDetail] = useState<ResultDraw | null>(null);

  const reload = useCallback(() => setItems(loadHistory()), []);
  useEffect(() => { reload(); }, [reload]);

  if (viewing) {
    const spread = getSpread(viewing.spreadId);
    const draws: ResultDraw[] = viewing.draws
      .map((d) => {
        const card = CARD_MAP[d.cardId];
        const position = spread.positions.find((p) => p.id === d.positionId);
        return card && position ? { card, reversed: d.reversed, position } : null;
      })
      .filter((x): x is ResultDraw => x !== null);
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: 9.5, letterSpacing: '.24em', marginBottom: 8, textTransform: 'uppercase' }}>
          Архив · {fmtDate(viewing.ts)}
        </div>
        <ReadingResult
          spread={spread} question={viewing.question} draws={draws}
          onCardTap={(d) => setDetail(d)}
          onBack={() => setViewing(null)} backLabel="В ЛОГ"
        />
        {detail && <CardDetail card={detail.card} reversed={detail.reversed} onClose={() => setDetail(null)} />}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="lib-head">
        <h2>≣ ЛОГ РАСКЛАДОВ</h2>
        {items.length > 0 && (
          <button className="icon-btn danger" onClick={() => { if (window.confirm('Очистить весь лог раскладов?')) { clearHistory(); reload(); sfx.denied(); } }}>
            ⌫ ОЧИСТИТЬ
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <b>ЛОГ ПУСТ</b><br />
          Ещё ни одного сеанса с оракулом.<br />
          Вернись в меню, выбери расклад — и пусть город откроется.
        </div>
      ) : (
        <div className="history-list">
          {items.map((r) => (
            <div key={r.id} className="panel history-item">
              <div className="h-body" role="button" tabIndex={0} onClick={() => { sfx.blip(); setViewing(r); }}
                   onKeyDown={(e) => e.key === 'Enter' && setViewing(r)}>
                <div className="h-spread">{r.spreadTitle} <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>· {r.draws.length} КАРТ</span></div>
                {r.question.trim() && <div className="h-q">&gt; «{r.question}»</div>}
                <div className="h-cards">{r.draws.map((d) => CARD_MAP[d.cardId]?.nameEn).filter(Boolean).join(' · ')}</div>
                <div className="h-date">{fmtDate(r.ts)}</div>
              </div>
              <button className="icon-btn danger" aria-label="Удалить запись"
                      onClick={() => { deleteReading(r.id); reload(); sfx.denied(); }}>⌫</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
