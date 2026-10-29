import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, globalStyles as g } from '../theme';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !pass) return Alert.alert('Atenção', 'Preencha e-mail e senha.');
    setBusy(true);
    try {
      await (mode === 'login' ? signIn : signUp)(email.trim(), pass);
    } catch (e) {
      Alert.alert('Erro', e.message);
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={[g.screen, { justifyContent: 'center' }]}>
      <Text style={g.title}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
      <TextInput style={g.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={g.input} placeholder="Senha (mín. 6 caracteres)" secureTextEntry value={pass} onChangeText={setPass} />
      <Button title={mode === 'login' ? 'Entrar' : 'Cadastrar'} onPress={submit} disabled={busy} />
      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.primary, fontWeight: '600' }}>
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
