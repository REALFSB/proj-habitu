import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { HabitsProvider } from '../context/HabitsContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Deslogado -> telas de entrada | Logado -> abas do app (com os dados dos hábitos)
export default function AppNavigator() {
  const { session } = useAuth();
  return (
    <NavigationContainer>
      {session ? (
        <HabitsProvider key={session.uid}>
          <Tabs />
        </HabitsProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
