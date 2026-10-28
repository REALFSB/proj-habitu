import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HabitsProvider } from '../context/HabitsContext';
import Tabs from './Tabs';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <HabitsProvider>
        <Tabs />
      </HabitsProvider>
    </NavigationContainer>
  );
}
