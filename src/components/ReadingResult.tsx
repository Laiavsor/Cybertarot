import { useMemo, useState } from 'react';
import type { TarotCard } from '../data/cards';
import type { SpreadDef, SpreadPosition } from '../data/spreads';
import type { DrawInput } from '../lib/interpret';
import { buildReading, buildShareText } from '../lib/interpret';
import { sfx } from '../lib/sfx';
import CardFace from './CardFace';

export interface ResultDraw {
  card: TarotCard;
  reversed: boolean;
  position: SpreadPosition;
}

interface Props {
  spread: SpreadDef;
  question: string;
  draws: ResultDraw[];
  onCardTap: (d: ResultDraw) => void;
  onSave?: () => void;      // если передан — покажется кнопка «Сохранить в лог»
  saved?: boolean;
  onNewReading?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export default function ReadingResult({ spread, question, draws, onCardTap, onSave, saved, onNewReading, onBack, backLabel }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const reading = useMemo(
    () => buildReading(question, spread, draws as DrawInput[]),
    [question, spread, draws]
  );

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2200); };

  const share = async () => {
    const text = buildShareText(question, spread, draws as DrawInput[]);
    try {
      if (navigator.share) { await navigator.share({ title: 'CyberTarot', text }); return; }
      throw new Error('no share');
    } catch {
      try { await navigator.clipboard.writeText(text); flash('СКОПИРОВАНО В БУФЕР'); }
      catch { flash('БУФЕР НЕДОСТУПЕН'); }
    }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(buildShareText(question, spread, draws as DrawInput[])); flash('СКОПИРОВАНО В БУФЕР'); }
    catch { flash('БУФЕР НЕДОСТУПЕН'); }
  };

  const renderSlot = (d: ResultDraw, extraClass = '', label = true) => (
    <div key={d.position.id} className={`cc-slot ${extraClass}`.trim()}>
      <CardFace card={d.card} reversed={d.reversed} onClick={() => onCardTap(d)} />
      {label && (
        <div className="slot-label">
          <div className="t">{d.position.title}</div>
          <div className="s">{d.position.sub}</div>
        </div>
      )}
    </div>
  );

  const renderSpread = () => {
    if (spread.id === 'hack') {
      return <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 2px' }}>
        <CardFace card={draws[0].card} reversed={draws[0].reversed} onClick={() => onCardTap(draws[0])} width={220} />
      </div>;
    }
    if (spread.id === 'neurolink') {
      return <div className="slots-area" style={{ paddingTop: 4 }}>{draws.map((d) => renderSlot(d))}</div>;
    }
    // Кельтский крест
    const byId = Object.fromEntries(draws.map((d) => [d.position.id, d]));
    const core = byId['core'], crossing = byId['crossing'];
    return (
      <div className="celtic">
        <div className="celtic-cross">
          {renderSlot(byId['crown'], 'cc-crown')}
          {renderSlot(byId['root'], 'cc-past')}
          <div className="cc-slot cc-core">
            <div className="celtic-core-wrap">
              <CardFace card={core.card} reversed={core.reversed} onClick={() => onCardTap(core)} />
              <div className="cc-crossing">
                <CardFace card={crossing.card} reversed={crossing.reversed} onClick={() => onCardTap(crossing)} />
              </div>
            </div>
            <div className="slot-label"><div className="t">Ядро × Помеха</div><div className="s">CORE × CROSSING</div></div>
          </div>
          {renderSlot(byId['vector'], 'cc-future')}
          {renderSlot(byId['foundation'], 'cc-base')}
        </div>
        <div className="celtic-staff">
          {(['output', 'hidden', 'perimeter', 'line'] as const).map((id) => renderSlot(byId[id]))}
        </div>
      </div>
    );
  };

  return (
    <div className="reading-grid">
      <div className="reading-head">
        {question.trim() && <div className="rh-q">&gt; «{question.trim()}»</div>}
        <div className="rh-meta">{spread.title} · {spread.titleEn} · {draws.length} КАРТ</div>
      </div>

      {renderSpread()}

      {/* разбор по позициям */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reading.sections.map((s) => (
          <div key={s.num} className="section-card">
            <div className="sc-top">
              <span className="sc-num">[{s.num}]</span>
              <span className="sc-title">{s.title}</span>
              <span className="sc-sub">{s.sub}</span>
            </div>
            <div className="sc-card">{s.cardName} <small>// {s.epithet}</small></div>
            <div className="sc-meta">{s.meta} · «{s.nameRu}»</div>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      {/* сводка системы */}
      <div className="summary-box">
        <h3>// СВОДКА СИСТЕМЫ</h3>
        <ul style={{ margin: 0, padding: 0 }}>
          {reading.summary.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
        <div className="verdict">&gt; ПРИКАЗ: {reading.verdict}</div>
      </div>

      {/* действия */}
      <div className="reading-actions">
        {onBack && <button className="btn btn-ghost" onClick={onBack}>← {backLabel ?? 'НАЗАД'}</button>}
        {onSave && (
          <button className={`btn ${saved ? 'btn-ghost' : 'btn-magenta btn-pulse'}`} onClick={() => { if (!saved) { sfx.save(); onSave(); } }} disabled={saved}>
            {saved ? '✓ В ЛОГЕ' : '▸ СОХРАНИТЬ В ЛОГ'}
          </button>
        )}
        <button className="btn btn-ghost" onClick={copy}>⧉ КОПИРОВАТЬ</button>
        <button className="btn btn-ghost" onClick={share}>⇪ ПОДЕЛИТЬСЯ</button>
        {onNewReading && <button className="btn" onClick={onNewReading}>⟲ НОВЫЙ РАСКЛАД</button>}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
