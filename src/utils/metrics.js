import { dateKey, addDays } from './dates';

const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
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

  // Ranking de hábitos no período
  const ranking = habits
    .map((h) => {
      const expected = keys.filter((k) => k >= cur.created[h.id]).length;
      const done = cur.perHabit[h.id];
      return {
        id: h.id,
        name: h.name,
        done,
        expected,
        rate: expected ? Math.min(1, done / expected) : 0,
        streak: h.streak,
        best: longestStreak(datesByHabit[h.id] || new Set()),
      };
    })
    .sort((a, b) => b.rate - a.rate);

  // Desempenho por dia da semana
  const acc = Array.from({ length: 7 }, () => ({ done: 0, expected: 0 }));
  cur.days.forEach((d) => {
    const w = parseKey(d.key).getDay();
    acc[w].done += d.count;
    acc[w].expected += d.active;
  });
  const weekdays = acc.map((x, i) => ({
    label: 'DSTQQSS'[i],
    name: WEEKDAYS[i],
    hasData: x.expected > 0,
    rate: x.expected ? Math.min(1, x.done / x.expected) : 0,
  }));
  const ranked = weekdays.filter((w) => w.hasData).sort((a, b) => b.rate - a.rate);
  const bestDay = ranked[0];
  const worstDay = ranked[ranked.length - 1];

  // Mapa de calor: colunas de 7 dias (domingo → sábado), como num calendário
  const cells = [
    ...Array(parseKey(keys[0]).getDay()).fill(null),
    ...cur.days.map((d) => ({ key: d.key, count: d.count, level: d.active ? d.count / d.active : null })),
  ];
  while (cells.length % 7) cells.push(null);
  const heatColumns = [];
  for (let i = 0; i < cells.length; i += 7) heatColumns.push(cells.slice(i, i + 7));

  // Insights em texto
  const insights = [];
  if (cur.expected === 0) {
    insights.push('Crie hábitos e marque conclusões para ver análises aqui.');
  } else {
    if (ranking.length) insights.push(`🏅 Hábito mais consistente: ${ranking[0].name} (${pct(ranking[0].rate)}%).`);
    if (bestDay) insights.push(`📅 Seu melhor dia é ${bestDay.name} (${pct(bestDay.rate)}% de conclusão).`);
    if (worstDay && worstDay !== bestDay) insights.push(`⚠️ O dia mais fraco é ${worstDay.name} (${pct(worstDay.rate)}%).`);
    if (trend !== null && trend !== 0)
      insights.push(trend > 0 ? `📈 ${trend} pontos acima do período anterior.` : `📉 ${Math.abs(trend)} pontos abaixo do período anterior.`);
    if (cur.perfectDays > 0) insights.push(`✨ ${cur.perfectDays} dia(s) perfeito(s): todos os hábitos concluídos.`);
  }

  return {
    keys,
    rate: cur.rate,
    trend,
    done: cur.done,
    expected: cur.expected,
    perfectDays: cur.perfectDays,
    avgPerDay: period ? cur.done / period : 0,
    currentStreak: Math.max(0, ...habits.map((h) => h.streak)),
    bestStreak: Math.max(0, ...ranking.map((r) => r.best)),
    heatColumns,
    weekdays,
    bestDay,
    ranking,
    insights,
  };
}
