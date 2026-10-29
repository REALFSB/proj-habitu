import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, globalStyles as g } from '../theme';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [notif, setNotif] = useState(true);
  return (
    <SafeAreaView style={g.screen} edges={['top']}>
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <Ionicons name="person-circle" size={96} color={colors.primary} />
        <Text style={g.title}>{session.email.split('@')[0]}</Text>
        <Text style={g.muted}>{session.email}</Text>
      </View>
      <View style={[g.card, { justifyContent: 'space-between' }]}>
        <Text style={g.cardTitle}>Notificações diárias</Text>
        <Switch value={notif} onValueChange={setNotif} trackColor={{ true: colors.primary }} />
      </View>
      <Button title="Sair" onPress={signOut} style={{ backgroundColor: colors.danger, marginTop: 24 }} />
    </SafeAreaView>
  );
}
