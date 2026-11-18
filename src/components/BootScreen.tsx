import { useEffect, useRef, useState } from 'react';
import { sfx } from '../lib/sfx';

const LINES = [
  'CYBERTAROT BIOS v2.7 // NEON MOTHERBOARD',
  '> проверка периферии ............ OK',
  '> калибровка неоновых трубок .... OK',
  '> дешифровка арканов [78/78] .... OK',
  '> подключение к sprawl ........... OK',
  '> канал открыт · оракул на линии',
];

export default function BootScreen({ onEnter }: { onEnter: () => void }) {
  const [done, setDone] = useState(0);      // сколько символов напечатано суммарно
  const [booted, setBooted] = useState(false);
  const timer = useRef<number | null>(null);
  const total = LINES.join('\n').length;

  useEffect(() => {
    sfx.boot();
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 3;
      if (i >= total) {
        window.clearInterval(timer.current!);
        setDone(total);
        setBooted(true);
      } else {
        setDone(i);
      }
    }, 14);
    return () => { if (timer.current) window.clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = () => {
    if (!booted) {
      // первый тап — пропустить анимацию печати
      if (timer.current) window.clearInterval(timer.current);
      setDone(total);
      setBooted(true);
      return;
    }
    sfx.glitch();
    onEnter();
  };

  const flat = LINES.join('\n').slice(0, done);

  return (
    <div className="boot" onClick={tap} role="button" aria-label="Войти в CyberTarot">
      <svg className="boot-mandala" width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="52" stroke="#00f0ff" strokeWidth="2" strokeDasharray="8 6" />
        <circle cx="60" cy="60" r="38" stroke="#ff2ea6" strokeWidth="2" />
        <path d="M22 60 C 36 38 84 38 98 60 C 84 82 36 82 22 60 Z" stroke="#eaffff" strokeWidth="2.4" />
        <circle cx="60" cy="60" r="11" stroke="#ffb000" strokeWidth="2" />
        <circle cx="60" cy="60" r="3.5" fill="#ff2ea6" stroke="none" />
      </svg>
      <div className="boot-log">
        <pre className="terminal-line" style={{ margin: 0, minHeight: 108 }}>{flat}<span style={{ opacity: booted ? 0 : 1 }}>▌</span></pre>
      </div>
      <h1 className="boot-title">CYBER<span style={{ color: 'var(--magenta)', WebkitTextStroke: '0' }}>//</span>TAROT</h1>
      <div className="boot-sub">Неоновый оракул нового города</div>
      {booted && <div className="boot-cta">НАЖМИ · ВОЙТИ</div>}
    </div>
  );
}
