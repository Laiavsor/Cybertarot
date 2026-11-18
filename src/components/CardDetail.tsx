import { useEffect } from 'react';
import { MAJOR_NUMERALS, SUIT_META, type TarotCard } from '../data/cards';
import CardFace from './CardFace';

interface Props {
  card: TarotCard;
  reversed?: boolean;
  onClose: () => void;
}

export default function CardDetail({ card, reversed, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const suit = card.suit ? SUIT_META[card.suit] : null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={card.nameEn}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Закрыть">✕ ESC</button>
        <div className="modal-body">
          <div className="modal-art">
            <CardFace card={card} reversed={reversed} width={200} />
            {reversed && <div style={{ textAlign: 'center', marginTop: 8, color: 'var(--magenta)', fontSize: 10, letterSpacing: '.3em' }}>⟲ ПЕРЕВЁРНУТАЯ</div>}
          </div>
          <div className="modal-info">
            <div className="m-ep">{card.epithet}</div>
            <div className="m-name">{card.nameEn}</div>
            <div className="m-ru">
              {card.arcana === 'major'
                ? `Старший аркан · ${MAJOR_NUMERALS[card.majorNumber!]} · ${card.nameRu}`
                : `${card.suitRu} · ${card.nameRu}`}
            </div>
            <div className="m-kw">{card.keywords.map((k) => <span key={k} className="kw-chip">{k}</span>)}</div>
            <div className="m-block up">
              <h4>▲ Прямая позиция</h4>
              <p>{card.upright}</p>
            </div>
            <div className="m-block rev">
              <h4>▼ Перевёрнутая позиция</h4>
              <p>{card.reversed}</p>
            </div>
            <div className="m-suit">
              {suit
                ? `МАСТЬ: ${suit.nameEn} (${suit.title}) — ${suit.domain}. В новой редакции дека заменяет классические ценности: вместо кубков — жестяные электро-банки со стимом, вместо посохов — живые провода, вместо пентаклей — ныены, валюта sprawl-а.`
                : 'СТАРШИЙ АРКАН: архетип на линии. Здесь система говорит не о быте, а о сюжете — о том, что движет историю города и человека внутри неё.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
