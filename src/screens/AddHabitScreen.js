import React, { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useHabits } from '../context/HabitsContext';
import { globalStyles as g } from '../theme';

export default function AddHabitScreen({ navigation }) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');

  const save = () => {
    if (!name.trim()) return;
    addHabit(name.trim());
    setName('');
    navigation.navigate('Início');
  };

  return (
    <SafeAreaView style={g.screen} edges={['top']}>
      <Text style={g.title}>Novo hábito</Text>
      <TextInput style={g.input} placeholder="Ex.: Meditar 10 min" value={name} onChangeText={setName} />
      <Button title="Salvar" onPress={save} />
    </SafeAreaView>
  );
}
