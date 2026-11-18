/* Локальный лог раскладов + настройки звука */
import type { Suit } from '../data/cards';

export interface SavedDraw {
  cardId: string;
  reversed: boolean;
  positionId: string;
}
export interface SavedReading {
  id: string;
  ts: number;
  spreadId: string;
  spreadTitle: string;
  question: string;
  draws: SavedDraw[];
}

const HKEY = 'cybertarot.history';
const SKEY = 'cybertarot.sound';

export const loadHistory = (): SavedReading[] => {
  try {
    const raw = localStorage.getItem(HKEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SavedReading[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const saveReading = (r: SavedReading) => {
  const list = loadHistory();
  list.unshift(r);
  try { localStorage.setItem(HKEY, JSON.stringify(list.slice(0, 60))); } catch { /* quota */ }
};

export const deleteReading = (id: string) => {
  try { localStorage.setItem(HKEY, JSON.stringify(loadHistory().filter((r) => r.id !== id))); } catch { /* noop */ }
};

export const clearHistory = () => {
  try { localStorage.removeItem(HKEY); } catch { /* noop */ }
};

export const getSound = (): boolean => {
  try { return localStorage.getItem(SKEY) !== 'off'; } catch { return true; }
};
export const setSound = (on: boolean) => {
  try { localStorage.setItem(SKEY, on ? 'on' : 'off'); } catch { /* noop */ }
};
