import { SPREADS, type SpreadDef } from '../data/spreads';
import { sfx } from '../lib/sfx';

interface Props {
  onPickSpread: (s: SpreadDef) => void;
  onOpenLibrary: () => void;
  onOpenHistory: () => void;
}

export default function MainMenu({ onPickSpread, onOpenLibrary, onOpenHistory }: Props) {
  return (
    <div>
      <div className="menu-hero">
        <h1>CYBER<span style={{ color: 'var(--magenta)' }}>//</span>TAROT</h1>
        <p>НЕОНОВЫЙ ОРАКУЛ · SPRAWL EDITION</p>
      </div>

      <div className="spread-list" role="list">
        {SPREADS.map((s) => (
          <button key={s.id} className="spread-item" role="listitem"
                  onMouseEnter={() => sfx.hover()}
                  onClick={() => { sfx.blip(); onPickSpread(s); }}>
            <div className="spread-num">{s.num}</div>
            <div>
              <div className="spread-tag">{s.tagline}</div>
              <div className="spread-title">{s.title}</div>
              <div className="spread-desc">{s.desc}</div>
            </div>
            <div className="spread-count">{s.positions.length} {s.positions.length === 1 ? 'КАРТА' : 'КАРТ'}</div>
          </button>
        ))}
      </div>

      <div className="menu-foot">
        <button className="btn btn-ghost" onClick={onOpenLibrary}>▦ КОЛОДА · 78 КАРТ</button>
        <button className="btn btn-ghost" onClick={onOpenHistory}>≣ ЛОГ РАСКЛАДОВ</button>
      </div>
      <div style={{ textAlign: 'center', color: '#3d4c61', fontSize: 8.5, letterSpacing: '.3em', marginTop: 14, textTransform: 'uppercase' }}>
        Swords = Мечи · Banks = Энергобанки · Wires = Провода · Nuyen = Ньюены
      </div>
    </div>
  );
}
