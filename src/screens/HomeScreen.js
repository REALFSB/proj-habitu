import React from 'react';
import { Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HabitItem from '../components/HabitItem';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitsContext';
import { colors, globalStyles as g } from '../theme';

export default function HomeScreen() {
  const { session } = useAuth();
  const { habits, loading, refreshing, refresh, toggle, removeHabit } = useHabits();
  const name = session.email.split('@')[0];
  const done = habits.filter((h) => h.done).length;

  const confirmDelete = (habit) =>
    Alert.alert('Excluir hábito', `Remover "${habit.name}" e todo o seu histórico?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeHabit(habit.id) },
    ]);

  return (
    <SafeAreaView style={g.screen} edges={['top']}>
      <Text style={g.title}>Olá, {name}! 👋</Text>
      <Text style={g.muted}>{done} de {habits.length} hábitos concluídos hoje</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          style={{ marginTop: 16 }}
          data={habits}
          keyExtractor={(h) => h.id}
          refreshing={refreshing}
          onRefresh={refresh}
          ListEmptyComponent={<Text style={[g.muted, { textAlign: 'center', marginTop: 40 }]}>Nenhum hábito ainda. Crie um na aba "Novo".</Text>}
          renderItem={({ item }) => (
            <HabitItem habit={item} onToggle={() => toggle(item)} onLongPress={() => confirmDelete(item)} />
          )}
        />
      )}
      <Text style={[g.muted, { textAlign: 'center', fontSize: 12 }]}>Toque para concluir • Segure para excluir • Puxe para atualizar</Text>
    </SafeAreaView>
  );
}
