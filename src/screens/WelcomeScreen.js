import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { colors, globalStyles as g } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={[g.screen, { justifyContent: 'center', alignItems: 'center' }]}>
      <Ionicons name="leaf" size={96} color={colors.primary} />
      <Text style={g.title}>Habitu</Text>
      <Text style={[g.muted, { textAlign: 'center', marginVertical: 16 }]}>
        Construa bons hábitos, um dia de cada vez.
      </Text>
      <Button title="Começar" onPress={() => navigation.navigate('Login')} style={{ width: '80%' }} />
    </SafeAreaView>
  );
}
