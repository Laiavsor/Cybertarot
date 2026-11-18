import { useEffect, useState } from 'react';
import type { SpreadDef } from './data/spreads';
import { getSound, setSound } from './lib/storage';
import { setSfxEnabled, sfx } from './lib/sfx';
import BootScreen from './components/BootScreen';
import MainMenu from './components/MainMenu';
import Table from './components/Table';
import Library from './components/Library';
import History from './components/History';

type Screen = 'boot' | 'menu' | 'table' | 'library' | 'history';

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot');
  const [activeSpread, setActiveSpread] = useState<SpreadDef | null>(null);
  const [session, setSession] = useState(0);
  const [sound, setSoundState] = useState<boolean>(() => getSound());

  useEffect(() => { setSfxEnabled(sound); }, [sound]);
  useEffect(() => { document.title = 'CYBERTAROT // НЕОНОВЫЙ ОРАКУЛ'; }, []);

  const toggleSound = () => {
    const next = !sound;
    setSoundState(next);
    setSound(next);
    setSfxEnabled(next);
    if (next) sfx.blip();
  };

  const pickSpread = (s: SpreadDef) => {
    setActiveSpread(s);
    setSession((n) => n + 1);
    setScreen('table');
  };

  const inBoot = screen === 'boot';

  return (
    <div className="crt">
      <div className="noise" />
      <div className="shell">
        {!inBoot && (
          <header className="topbar">
            <div className="topbar-logo" onClick={() => setScreen('menu')} role="button" aria-label="В меню" tabIndex={0}
                 onKeyDown={(e) => e.key === 'Enter' && setScreen('menu')}>
              CYBER<span className="slash">//</span>TAROT
            </div>
            <div className="topbar-actions">
              <button className={`icon-btn ${screen === 'library' ? 'active' : ''}`} onClick={() => { sfx.blip(); setScreen('library'); }} title="Колода" aria-label="Колода">▦</button>
              <button className={`icon-btn ${screen === 'history' ? 'active' : ''}`} onClick={() => { sfx.blip(); setScreen('history'); }} title="Лог раскладов" aria-label="Лог раскладов">≣</button>
              <button className={`icon-btn ${sound ? 'active' : ''}`} onClick={toggleSound} title="Звук" aria-label="Переключить звук">{sound ? '♪' : '∅'}</button>
            </div>
          </header>
        )}

        {inBoot ? (
          <BootScreen onEnter={() => setScreen('menu')} />
        ) : (
          <main className="screen">
            {screen === 'menu' && (
              <MainMenu
                onPickSpread={pickSpread}
                onOpenLibrary={() => setScreen('library')}
                onOpenHistory={() => setScreen('history')}
              />
            )}
            {screen === 'table' && activeSpread && (
              <Table key={`${activeSpread.id}-${session}`} spread={activeSpread} onExit={() => setScreen('menu')} />
            )}
            {screen === 'library' && <Library />}
            {screen === 'history' && <History />}
          </main>
        )}
      </div>
    </div>
  );
}
