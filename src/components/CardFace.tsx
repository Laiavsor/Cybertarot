import { useState } from 'react';
import { MAJOR_NUMERALS, type TarotCard } from '../data/cards';
import MinorArt from './MinorArt';
import CardBack from './CardBack';
import MajorFrame from './MajorFrame';

interface Props {
  card: TarotCard;
  reversed?: boolean;
  faceDown?: boolean;
  dealt?: boolean;      // сыграет анимация dealIn
  glitching?: boolean;  // глитч-полосы после сдачи
  width?: number;
  onClick?: () => void;
  className?: string;
}

export default function CardFace({ card, reversed, faceDown, dealt, glitching, width, onClick, className }: Props) {
  const [imgOk, setImgOk] = useState(true);
  const isMajor = card.arcana === 'major';

  const cls = [
    'card',
    faceDown ? 'face-down' : '',
    reversed ? 'reversed' : '',
    dealt ? 'dealt' : '',
    glitching ? 'glitching' : '',
    className ?? '',
  ].join(' ');

  return (
    <div
      className={cls}
      style={width ? { width, ['--cw' as string]: `${width}px` } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={`${card.nameEn}${reversed ? ' (перевёрнутая)' : ''}`}
    >
      <div className="card-inner">
        {/* ── Лицевая сторона ── */}
        <div className="card-face card-front-face">
          {isMajor && card.image && imgOk ? (
            <>
              <img className="card-front-img" src={card.image} alt={card.nameEn} loading="lazy" onError={() => setImgOk(false)} />
              <div className="card-front-shade" />
              <MajorFrame numeral={MAJOR_NUMERALS[card.majorNumber!]} title={card.nameEn} epithet={card.epithet} />
            </>
          ) : isMajor ? (
            <div className="card-missing">
              <div className="card-major-num" style={{ position: 'static' }}>{MAJOR_NUMERALS[card.majorNumber!]}</div>
              <b>{card.nameEn}</b>
              <span>{card.epithet}</span>
            </div>
          ) : (
            <MinorArt card={card} />
          )}
        </div>
        {/* ── Рубашка ── */}
        <div className="card-face card-back-face">
          <CardBack />
        </div>
      </div>
    </div>
  );
}
