import { dateKey, addDays } from './dates';

const pct = (r) => Math.round(r * 100);

export const parseKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Dia (AAAA-MM-DD, fuso local) em que o hábito foi criado. O Firestore devolve createTime em UTC.
export const createdKey = (h) =>
  h.createTime ? dateKey(new Date(h.createTime.replace(/\.\d+Z$/, 'Z'))) : '0000-00-00';

// Últimos n dias terminando em `end`, do mais antigo ao mais novo
export const daysRange = (n, end = new Date()) =>
  Array.from({ length: n }, (_, i) => dateKey(addDays(end, i - (n - 1))));

// Maior sequência de dias consecutivos de todo o histórico
export function longestStreak(dates) {
  let best = 0;
  let run = 0;
  let prev = null;
  [...dates].sort().forEach((k) => {
    run = prev && dateKey(addDays(parseKey(prev), 1)) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  });
  return best;
}

// Estatísticas de um conjunto de dias.
// "Esperado" = para cada dia, quantos hábitos já existiam naquela data (hábito novo não penaliza o passado).
function periodStats(habits, completions, keys) {
  const keySet = new Set(keys);
  const created = Object.fromEntries(habits.map((h) => [h.id, createdKey(h)]));
  const perDay = {};
  const perHabit = Object.fromEntries(habits.map((h) => [h.id, 0]));

  completions.forEach((c) => {
    if (keySet.has(c.date) && c.habitId in created) {
      perDay[c.date] = (perDay[c.date] || 0) + 1;
      perHabit[c.habitId] += 1;
    }
  });

  let done = 0;
  let expected = 0;
  let perfectDays = 0;
  const days = keys.map((k) => {
    const active = habits.filter((h) => created[h.id] <= k).length;
    const count = perDay[k] || 0;
    done += count;
    expected += active;
    if (active > 0 && count >= active) perfectDays += 1;
    return { key: k, count, active };
  });

  return { days, done, expected, perfectDays, perHabit, created, rate: expected ? Math.min(1, done / expected) : 0 };
}

export function computeMetrics(habits, completions, period) {
  const keys = daysRange(period);
  const cur = periodStats(habits, completions, keys);
  const prev = periodStats(habits, completions, daysRange(period, addDays(new Date(), -period)));
  const trend = prev.expected > 0 ? pct(cur.rate) - pct(prev.rate) : null; // pontos percentuais

  // Datas de conclusão por hábito (para a maior sequência)
  const datesByHabit = {};
  completions.forEach((c) => {
    if (!datesByHabit[c.habitId]) datesByHabit[c.habitId] = new Set();
    datesByHabit[c.habitId].add(c.date);
  });

  return {
    keys,
    rate: cur.rate,
    trend,
    done: cur.done,
    expected: cur.expected,
    perfectDays: cur.perfectDays,
    avgPerDay: period ? cur.done / period : 0,
    currentStreak: Math.max(0, ...habits.map((h) => h.streak)),
    bestStreak: Math.max(0, ...habits.map((h) => longestStreak(datesByHabit[h.id] || new Set()))),
  };
}
