import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { createHabitsService, completionId } from '../services/habitsService';
import { deriveHabits } from '../utils/habitStats';
import { dateKey } from '../utils/dates';

const HabitsContext = createContext();
export const useHabits = () => useContext(HabitsContext);

export function HabitsProvider({ children }) {
  const { session } = useAuth();
  const service = useMemo(() => createHabitsService(session), [session]);

  const [habitsRaw, setHabitsRaw] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await service.fetchAll();
      setHabitsRaw(data.habits);
      setCompletions(data.completions);
    } catch (e) {
      Alert.alert('Erro ao carregar', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [service]);

  useEffect(() => { load(); }, [load]);

  const refresh = () => { setRefreshing(true); load(); };

  const today = dateKey();
  const { habits, byDate } = useMemo(() => deriveHabits(habitsRaw, completions, today), [habitsRaw, completions, today]);

  // Marca/desmarca o hábito hoje (atualiza a tela na hora e sincroniza em seguida)
  const toggle = async (habit) => {
    const id = completionId(today, habit.id);
    try {
      if (habit.done) {
        setCompletions((l) => l.filter((c) => c.id !== id));
        await service.removeCompletion(id);
      } else {
        setCompletions((l) => [...l, { id, habitId: habit.id, date: today }]);
        await service.addCompletion(habit.id, today);
      }
    } catch (e) {
      Alert.alert('Erro ao registrar', e.message);
      load();
    }
  };

  const addHabit = async (name) => {
    await service.createHabit(name);
    await load();
  };

  const removeHabit = async (id) => {
    const ids = completions.filter((c) => c.habitId === id).map((c) => c.id);
    setHabitsRaw((l) => l.filter((h) => h.id !== id));
    setCompletions((l) => l.filter((c) => c.habitId !== id));
    try {
      await service.deleteHabit(id, ids);
    } catch (e) {
      Alert.alert('Erro ao excluir', e.message);
      load();
    }
  };

  return (
    <HabitsContext.Provider value={{ habits, completions, byDate, loading, refreshing, refresh, toggle, addHabit, removeHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}
