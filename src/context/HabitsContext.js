import React, { createContext, useContext, useState } from 'react';

const HabitsContext = createContext();
export const useHabits = () => useContext(HabitsContext);

// Versão inicial: os hábitos ficam apenas na memória (somem ao recarregar o app)
export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);

  const addHabit = (name) => setHabits((list) => [...list, { id: String(Date.now()), name, done: false }]);

  const toggle = (id) => setHabits((list) => list.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  const removeHabit = (id) => setHabits((list) => list.filter((h) => h.id !== id));

  return <HabitsContext.Provider value={{ habits, addHabit, toggle, removeHabit }}>{children}</HabitsContext.Provider>;
}
