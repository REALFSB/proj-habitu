import React, { useState } from 'react';
import { Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useHabits } from '../context/HabitsContext';
import { globalStyles as g } from '../theme';

export default function AddHabitScreen({ navigation }) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await addHabit(name.trim());
      setName('');
      navigation.navigate('Início');
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={g.screen} edges={['top']}>
      <Text style={g.title}>Novo hábito</Text>
      <TextInput style={g.input} placeholder="Ex.: Meditar 10 min" value={name} onChangeText={setName} />
      <Button title="Salvar" onPress={save} disabled={busy} />
    </SafeAreaView>
  );
}
