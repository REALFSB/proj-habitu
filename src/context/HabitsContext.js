import React, { createContext, useContext, useMemo, useState } from 'react';
import { deriveHabits, completionId } from '../utils/habitStats';
import { dateKey } from '../utils/dates';

const HabitsContext = createContext();
export const useHabits = () => useContext(HabitsContext);

// Os dados ficam apenas na memória (somem ao recarregar o app).
//  habitsRaw:   [{ id, name }]
//  completions: [{ id, habitId, date }]  -> uma por hábito por dia
export function HabitsProvider({ children }) {
  const [habitsRaw, setHabitsRaw] = useState([]);
  const [completions, setCompletions] = useState([]);

  // "Concluído hoje" e "sequência" são calculados a partir do histórico de conclusões
  const today = dateKey();
  const { habits, byDate } = useMemo(() => deriveHabits(habitsRaw, completions, today), [habitsRaw, completions, today]);

  // Marca/desmarca o hábito hoje
  const toggle = (habit) => {
    const id = completionId(today, habit.id);
    if (habit.done) {
      setCompletions((l) => l.filter((c) => c.id !== id));
    } else {
      setCompletions((l) => [...l, { id, habitId: habit.id, date: today }]);
    }
  };

  const addHabit = (name) => setHabitsRaw((l) => [...l, { id: String(Date.now()), name }]);

  // Remove o hábito junto com todo o seu histórico
  const removeHabit = (id) => {
    setHabitsRaw((l) => l.filter((h) => h.id !== id));
    setCompletions((l) => l.filter((c) => c.habitId !== id));
  };

  return (
    <HabitsContext.Provider value={{ habits, completions, byDate, toggle, addHabit, removeHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}
