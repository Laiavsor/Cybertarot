import { useCallback, useEffect, useRef, useState } from 'react';
import { CARDS, type TarotCard } from '../data/cards';
import type { SpreadDef, SpreadPosition } from '../data/spreads';
import { saveReading } from '../lib/storage';
import { sfx } from '../lib/sfx';
import CardFace from './CardFace';
import CardDetail from './CardDetail';
import ReadingResult, { type ResultDraw } from './ReadingResult';

interface Draw extends ResultDraw {}

interface Props {
  spread: SpreadDef;
  onExit: () => void;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Table({ spread, onExit }: Props) {
  const [stage, setStage] = useState<'setup' | 'drawing' | 'revealed'>('setup');
  const [question, setQuestion] = useState('');
  const [draws, setDraws] = useState<Draw[]>([]);
  const [glitchId, setGlitchId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [detail, setDetail] = useState<Draw | null>(null);
  const deckRef = useRef<TarotCard[]>([]);
  const total = spread.positions.length;

  const start = useCallback(() => {
    deckRef.current = shuffle(CARDS);
    setDraws([]); setSaved(false); setStage('drawing'); sfx.glitch();
  }, []);

  const dealNext = useCallback(() => {
    if (draws.length >= total) return;
    const card = deckRef.current[draws.length];
    const position = spread.positions[draws.length];
    const reversed = Math.random() < 0.5;
    sfx.deal();
    window.setTimeout(() => sfx.flip(), 180);
    setGlitchId(position.id);
    window.setTimeout(() => setGlitchId(null), 900);
    setDraws([...draws, { card, reversed, position }]);
  }, [draws, spread, total]);

  const reshuffle = useCallback(() => {
    deckRef.current = shuffle(CARDS);
    setDraws([]); setSaved(false); sfx.glitch();
  }, []);

  const save = useCallback(() => {
    if (saved) return;
    saveReading({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      spreadId: spread.id,
      spreadTitle: spread.title,
      question: question.trim(),
      draws: draws.map((d) => ({ cardId: d.card.id, reversed: d.reversed, positionId: d.position.id })),
    });
    setSaved(true);
  }, [saved, spread, question, draws]);

  useEffect(() => { window.scrollTo(0, 0); }, [stage]);

  /* ═══════════ ЭТАП: ВВОД ЗАПРОСА ═══════════ */
  if (stage === 'setup') {
    return (
      <div className="table-wrap">
        <div className="panel setup-panel">
          <span className="panel-tag">// ЗАГРУЗКА РАСКЛАДА</span>
          <h2>{spread.title}</h2>
          <p style={{ color: 'var(--amber)', letterSpacing: '.2em', fontSize: 10, textTransform: 'uppercase', marginBottom: 10 }}>{spread.tagline}</p>
          <p>{spread.desc}</p>
          <label htmlFor="q" style={{ fontSize: 10, letterSpacing: '.24em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Твой запрос к системе (необязательно)</label>
          <input
            id="q" className="q-input" style={{ marginTop: 8 }}
            value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 140))}
            placeholder="Например: стоит ли брать этот контракт…"
            autoComplete="off" enterKeyHint="go"
            onKeyDown={(e) => e.key === 'Enter' && start()}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4c5d75', fontSize: 9, marginTop: 4 }}>
            <span>{question.length}/140</span><span>ОТВЕТ ПРИДЁТ В ТЕЧЕНИЕ 3 ТИКОВ</span>
          </div>
          <button className="btn btn-magenta btn-block" style={{ marginTop: 16 }} onClick={start}>▸ НАЧАТЬ СДАЧУ</button>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={onExit}>← НАЗАД В МЕНЮ</button>
        </div>
      </div>
    );
  }

  /* ═══════════ ЭТАП: ТОЛКОВАНИЕ ═══════════ */
  if (stage === 'revealed') {
    return (
      <div className="table-wrap">
        <ReadingResult
          spread={spread} question={question} draws={draws}
          onCardTap={(d) => setDetail(d)}
          onSave={save} saved={saved}
          onNewReading={() => { setStage('setup'); setQuestion(''); setDraws([]); setSaved(false); }}
          onBack={onExit} backLabel="В МЕНЮ"
        />
        {detail && <CardDetail card={detail.card} reversed={detail.reversed} onClose={() => setDetail(null)} />}
      </div>
    );
  }

  /* ═══════════ ЭТАП: СДАЧА ═══════════ */
  const drawnById = Object.fromEntries(draws.map((d) => [d.position.id, d]));
  const nextPos = draws.length < total ? spread.positions[draws.length] : null;
  const remaining = total - draws.length;

  const renderCell = (pos: SpreadPosition, extraClass = '') => {
    const d = drawnById[pos.id];
    const isNext = nextPos?.id === pos.id;
    return (
      <div key={pos.id} className={`cc-slot ${extraClass}`.trim()}>
        {d ? (
          <CardFace card={d.card} reversed={d.reversed} dealt glitching={glitchId === pos.id} onClick={() => setDetail(d)} />
        ) : (
          <div className={`slot ${isNext ? 'next' : ''}`} style={{ width: 'auto' }}>
            <div className="slot-frame">{String(spread.positions.indexOf(pos) + 1).padStart(2, '0')}</div>
          </div>
        )}
        <div className="slot-label">
          <div className="t">{pos.title}</div>
          <div className="s">{pos.sub}</div>
          <div className="h">{pos.hint}</div>
        </div>
      </div>
    );
  };

  const renderSlots = () => {
    if (spread.id === 'dump') {
      const [core, crossing, root, vector, crown, foundation, line, perimeter, hidden, output] = spread.positions;
      return (
        <div className="celtic">
          <div className="celtic-cross">
            {renderCell(crown, 'cc-crown')}
            {renderCell(root, 'cc-past')}
            <div className="cc-slot cc-core">
              <div className="celtic-core-wrap">
                {drawnById['core'] ? (
                  <CardFace card={drawnById['core'].card} reversed={drawnById['core'].reversed} dealt glitching={glitchId === 'core'} onClick={() => setDetail(drawnById['core'])} />
                ) : (
                  <div className={`slot ${nextPos?.id === 'core' ? 'next' : ''}`} style={{ width: 'auto' }}>
                    <div className="slot-frame">01</div>
                  </div>
                )}
                {drawnById['crossing'] ? (
                  <div className="cc-crossing">
                    <CardFace card={drawnById['crossing'].card} reversed={drawnById['crossing'].reversed} dealt glitching={glitchId === 'crossing'} onClick={() => setDetail(drawnById['crossing'])} />
                  </div>
                ) : (
                  <div className="cc-crossing">
                    <div className={`slot ${nextPos?.id === 'crossing' ? 'next' : ''}`} style={{ width: '100%', height: '100%' }}>
                      <div className="slot-frame" style={{ width: '100%', height: '100%' }}>02</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="slot-label">
                <div className="t">Ядро × Помеха</div>
                <div className="s">CORE × CROSSING</div>
              </div>
            </div>
            {renderCell(vector, 'cc-future')}
            {renderCell(foundation, 'cc-base')}
          </div>
          <div className="celtic-staff">
            {[output, hidden, perimeter, line].map((p) => renderCell(p))}
          </div>
        </div>
      );
    }
    return <div className="slots-area">{spread.positions.map((p) => renderCell(p))}</div>;
  };

  return (
    <div className="table-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '.18em', color: 'var(--cyan)' }}>{spread.title}</div>
          {question.trim() && <div style={{ color: 'var(--green)', fontSize: 10.5, marginTop: 2, maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>&gt; «{question.trim()}»</div>}
        </div>
        <button className="icon-btn" onClick={reshuffle} title="Сдать заново">⟲ ПЕРЕСДАЧА</button>
      </div>

      <div className="deal-zone">
        {/* Колода */}
        <div className="panel deck-panel">
          <span className="panel-tag">// ДЕКА · 78 КАРТ</span>
          <div className="deck-stack" onClick={remaining > 0 ? dealNext : undefined} role="button" aria-label="Сдать карту" tabIndex={0}
               onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && remaining > 0 && dealNext()}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="deck-card" style={{ transform: `translate(${(i - 1) * 9}px, ${-(i - 1) * 7}px) rotate(${(i - 1) * 3}deg)`, zIndex: i }}>
                <CardFace card={CARDS[0]} faceDown />
              </div>
            ))}
          </div>
          {remaining > 0 ? (
            <div className="deck-hint">КОСНИСЬ КОЛОДЫ<br /><b>ОСТАЛОСЬ СДАТЬ: {remaining}</b></div>
          ) : (
            <div className="deck-exhausted">ДЕКА ИССЯКЛА<br />БУФЕР ПУСТ // ВСЕ КАРТЫ НА СТОЛЕ</div>
          )}
          {remaining === 0 && (
            <button className="btn btn-magenta btn-pulse" onClick={() => { sfx.reveal(); setStage('revealed'); }}>СФОРМИРОВАТЬ ТОЛКОВАНИЕ →</button>
          )}
        </div>

        {/* Слоты */}
        {spread.id === 'dump' ? (
          <div style={{ padding: '6px 2px', overflowX: 'auto' }}>{renderSlots()}</div>
        ) : (
          <div className="slots-area" style={{ paddingTop: 6 }}>{renderSlots()}</div>
        )}
      </div>

      {detail && <CardDetail card={detail.card} reversed={detail.reversed} onClose={() => setDetail(null)} />}
    </div>
  );
}
