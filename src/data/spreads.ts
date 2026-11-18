/* Расклады CyberTarot */
export interface SpreadPosition {
  id: string;
  title: string;
  sub: string;   // EN
  hint: string;  // русская подсказка под слотом
}
export interface SpreadDef {
  id: 'hack' | 'neurolink' | 'dump';
  num: string;
  title: string;
  titleEn: string;
  tagline: string;
  desc: string;
  positions: SpreadPosition[];
}

export const SPREADS: SpreadDef[] = [
  {
    id: 'hack',
    num: '01',
    title: 'БЫСТРЫЙ ХАК',
    titleEn: 'RAPID HACK',
    tagline: 'один вердикт системы',
    desc: 'Одна карта. Один ответ. Для вопросов, которым не нужно десять карт — нужен честный сигнал.',
    positions: [
      { id: 'verdict', title: 'Вердикт', sub: 'THE VERDICT', hint: 'что система видит по твоему запросу' },
    ],
  },
  {
    id: 'neurolink',
    num: '02',
    title: 'НЕЙРОЛИНК',
    titleEn: 'NEUROLINK',
    tagline: 'прошлое · настоящее · будущее',
    desc: 'Три карты, один канал. Что загружено, что исполняется сейчас и что отдаст система.',
    positions: [
      { id: 'past', title: 'Прошлое', sub: 'INPUT // THE ROOT', hint: 'что уже загружено в систему' },
      { id: 'present', title: 'Настоящее', sub: 'RUNTIME // NOW', hint: 'что исполняется прямо сейчас' },
      { id: 'future', title: 'Будущее', sub: 'OUTPUT // THE VECTOR', hint: 'что отдаст система дальше' },
    ],
  },
  {
    id: 'dump',
    num: '03',
    title: 'ПОЛНЫЙ ДАМП',
    titleEn: 'FULL DUMP · CELTIC CROSS',
    tagline: 'полное сканирование ситуации',
    desc: 'Десять карт, Кельтский крест. Когда одного сигнала мало — полный аудит расклада.',
    positions: [
      { id: 'core', title: 'Ядро', sub: 'THE CORE', hint: 'ситуация в центре' },
      { id: 'crossing', title: 'Помеха', sub: 'THE CROSSING', hint: 'что пересекает путь · крест на тебе' },
      { id: 'root', title: 'Архив', sub: 'THE ROOT', hint: 'что позади · корни дела' },
      { id: 'vector', title: 'Горизонт', sub: 'THE VECTOR', hint: 'что впереди · ближайший тик' },
      { id: 'crown', title: 'Венчающий', sub: 'THE CROWN', hint: 'цель и вершина' },
      { id: 'foundation', title: 'Фундамент', sub: 'THE FOUNDATION', hint: 'основание ситуации' },
      { id: 'line', title: 'Твоя линия', sub: 'THE LINE', hint: 'твой совет и твоя линия поведения' },
      { id: 'perimeter', title: 'Периметр', sub: 'THE PERIMETER', hint: 'окружение · внешние силы' },
      { id: 'hidden', title: 'Скрытый джекпот', sub: 'THE HIDDEN', hint: 'надежды и страхи · что под грифом' },
      { id: 'output', title: 'Итог', sub: 'THE OUTPUT', hint: 'что выдаст система · финал тика' },
    ],
  },
];

export const getSpread = (id: string) => SPREADS.find((s) => s.id === id)!;
