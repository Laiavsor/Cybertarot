/* «Нейро-оракул»: синтез толкования из данных колоды.
   Работает полностью офлайн — чистый шаблонный анализ позиций и мастей. */
import { SUIT_META, type TarotCard, type Suit } from '../data/cards';
import type { SpreadDef, SpreadPosition } from '../data/spreads';

export interface DrawInput {
  card: TarotCard;
  reversed: boolean;
  position: SpreadPosition;
}

export interface ReadingSection {
  num: string;
  title: string;
  sub: string;
  body: string;
  meta: string;      // «ПРЯМАЯ · ключи»
  cardName: string;  // «EIGHT OF WIRES»
  epithet: string;   // «FAST PACKET»
  nameRu: string;
}

export interface ReadingSynthesis {
  sections: ReadingSection[];
  themes: string[];
  summary: string[];
  verdict: string;
  reversedCount: number;
}

const VERDICTS = [
  'Система констатирует: выбор уже сделан — осталось его не сдрейфить обратно.',
  'Канал чист. Действуй, пока луна не сменила фазу.',
  'Оракул выдал редкое сочетание: карты согласны между собой. Редкость тоже надо уметь тратить.',
  'Займи позицию до того, как тебя позиционируют.',
  'Проверь питание. Потом — намерения. Потом — ныены.',
  'Город не прощает ожидания, но и не торопит без нужды. Слушай внутренний метроном.',
  'Зафиксируй в логах то, что выпало, — и перечитай через луну.',
];

export function buildReading(question: string, spread: SpreadDef, draws: DrawInput[]): ReadingSynthesis {
  const reversedCount = draws.filter((d) => d.reversed).length;
  const total = draws.length;

  const sections: ReadingSection[] = draws.map((d, i) => {
    const state = d.reversed ? 'ПЕРЕВЁРНУТАЯ' : 'ПРЯМАЯ';
    return {
      num: String(i + 1).padStart(2, '0'),
      title: d.position.title,
      sub: d.position.sub,
      body: d.reversed ? d.card.reversed : d.card.upright,
      meta: `${state} · ${d.card.keywords.join(' · ')}`,
      cardName: d.card.nameEn,
      epithet: d.card.epithet,
      nameRu: d.card.nameRu,
    };
  });

  // Доминирующие масти
  const suitCount: Partial<Record<Suit, number>> = {};
  let majors = 0;
  for (const d of draws) {
    if (d.card.arcana === 'major') majors += 1;
    else suitCount[d.card.suit!] = (suitCount[d.card.suit!] ?? 0) + 1;
  }
  const sortedSuits = (Object.entries(suitCount) as [Suit, number][]).sort((a, b) => b[1] - a[1]);

  const summary: string[] = [];
  if (majors > 0) {
    summary.push(
      `Старших арканов на линии: ${majors} из ${total}. Вопрос крупнее быта — архетипы вышли на смену, и это не мелкий тик, это сюжет.`
    );
  }
  const top = sortedSuits[0];
  if (top && top[1] >= Math.max(2, Math.ceil(total / 3))) {
    const [suit, n] = top;
    const domain = SUIT_META[suit].domain;
    const flavor: Record<Suit, string> = {
      swords: 'Разум становится полем боя: где спор, там и выход. Держи мысль острой и язык — за зубами.',
      banks: 'Эмоции правят циклом: чувства в этом раскладе — не фон, а двигатель. Пей дозированно и не заедай пустоту.',
      wires: 'Действие — единственный протокол: карты прямого тока требуют рук, а не раздумий. Делай, пока искрит.',
      nuyen: 'Материя в центре внимания: время, деньги, труд и договоры — считай честно, город уважает точную бухгалтерию.',
    };
    summary.push(`${SUIT_META[suit].nameEn} · ${n} карты из ${total} (${domain}). ${flavor[suit]}`);
  }
  if (reversedCount >= Math.ceil(total / 2)) {
    summary.push('Помехи на канале: перевёрнутых карт не меньше половины. Сигнал идёт с искажениями — ищи скрытое и не спеши с выводами.');
  } else if (reversedCount === 0 && total > 1) {
    summary.push('Канал без помех: все карты прямые. Редкий случай, когда система говорит прямо — слушай её в полный голос.');
  }

  // Сквозные темы = самые частые ключи
  const freq = new Map<string, number>();
  for (const d of draws) for (const k of d.card.keywords) freq.set(k, (freq.get(k) ?? 0) + 1);
  const themes = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
  if (themes.length) {
    summary.push(`Сквозные частоты: ${themes.join(' · ')}. Именно они повторяются по всему дампу — отнесись к ним как к подсказке маршрутизатора.`);
  }

  // Развилка «ВЫБОР» — сравнение двух путей
  if (spread.id === 'choice') {
    const byId = Object.fromEntries(draws.map((d) => [d.position.id, d])) as Record<string, DrawInput | undefined>;
    const aStack = [byId['gainA'], byId['costA']].filter((d): d is DrawInput => Boolean(d));
    const bStack = [byId['gainB'], byId['costB']].filter((d): d is DrawInput => Boolean(d));
    const aRev = aStack.filter((d) => d.reversed).length;
    const bRev = bStack.filter((d) => d.reversed).length;
    if (aRev !== bRev) {
      summary.push(aRev > bRev
        ? 'Путь А идёт с перевёрнутыми картами — тревожные сигналы по нему; путь Б звучит чище.'
        : 'Путь Б идёт с перевёрнутыми картами — внимательнее к его подводным камням; путь А звучит чище.');
    }
    const aMaj = aStack.filter((d) => d.card.arcana === 'major').length;
    const bMaj = bStack.filter((d) => d.card.arcana === 'major').length;
    if (aMaj + bMaj > 0) {
      const heavier = aMaj === bMaj ? 'обоих путей' : (aMaj > bMaj ? 'пути А' : 'пути Б');
      summary.push(`Старший аркан лежит на ${heavier}: этот выбор крупнее, чем кажется на схеме.`);
    }
  }

  // Финальный приговор — детерминированный выбор по составу расклада
  const seed = draws.reduce((acc, d) => acc + d.card.id.length * (d.reversed ? 3 : 7), 0) + total * 13;
  const verdict = VERDICTS[seed % VERDICTS.length];

  const trimmedQ = question.trim();
  if (trimmedQ) {
    summary.unshift(`Запрос в очереди: «${trimmedQ.slice(0, 140)}${trimmedQ.length > 140 ? '…' : ''}»`);
  }

  return { sections, themes, summary, verdict, reversedCount };
}

export function buildShareText(question: string, spread: SpreadDef, draws: DrawInput[]): string {
  const lines = [
    `CYBERTAROT // ${spread.title} (${spread.titleEn})`,
    question.trim() ? `Запрос: ${question.trim()}` : '',
    '',
    ...draws.map(
      (d, i) =>
        `${String(i + 1).padStart(2, '0')}. ${d.position.title} — ${d.card.nameEn}${d.reversed ? ' (reversed)' : ''} · ${d.reversed ? d.card.reversed : d.card.upright}`
    ),
    '',
    '— неоновый оракул нового города',
  ].filter(Boolean);
  return lines.join('\n');
}
