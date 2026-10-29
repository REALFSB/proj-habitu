import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// options: [{ value, label }]
export default function PeriodSelector({ value, options, onChange }) {
  return (
    <View style={styles.row}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity key={o.value} style={[styles.pill, active && styles.active]} onPress={() => onChange(o.value)}>
            <Text style={[styles.text, active && { color: '#fff' }]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: colors.track, borderRadius: 12, padding: 4, marginTop: 12 },
  pill: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  active: { backgroundColor: colors.primary },
  text: { fontWeight: '700', color: colors.muted },
});
