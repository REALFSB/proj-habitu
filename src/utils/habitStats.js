import { dateKey, addDays } from './dates';

// Dias consecutivos concluídos. Se hoje ainda não foi feito, a sequência de ontem continua valendo.
export function calcStreak(dates) {
  let d = new Date();
  if (!dates.has(dateKey(d))) d = addDays(d, -1);
  let n = 0;
  while (dates.has(dateKey(d))) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

// Combina hábitos + conclusões e devolve:
//  habits: cada hábito com { done (hoje), streak }
//  byDate: { 'AAAA-MM-DD': [nomes dos hábitos concluídos] }
export function deriveHabits(habitsRaw, completions, today) {
  const sets = {};
  completions.forEach((c) => {
    (sets[c.habitId] = sets[c.habitId] || new Set()).add(c.date);
  });
  const names = Object.fromEntries(habitsRaw.map((h) => [h.id, h.name]));
  const byDate = {};
  completions.forEach((c) => {
    if (names[c.habitId]) (byDate[c.date] = byDate[c.date] || []).push(names[c.habitId]);
  });
  const habits = habitsRaw.map((h) => {
    const set = sets[h.id] || new Set();
    return { ...h, done: set.has(today), streak: calcStreak(set) };
  });
  return { habits, byDate };
}
