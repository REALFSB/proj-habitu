import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles as g } from '../theme';

export default function HabitItem({ habit, onToggle, onLongPress }) {
  return (
    <TouchableOpacity style={g.card} onPress={onToggle} onLongPress={onLongPress}>
      <Ionicons name={habit.done ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={habit.done ? colors.ok : colors.muted} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={[g.cardTitle, habit.done && { textDecorationLine: 'line-through', color: colors.muted }]}>{habit.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
