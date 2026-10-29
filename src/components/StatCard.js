import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function StatCard({ icon, value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14 },
  icon: { fontSize: 22 },
  value: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 4 },
  label: { fontSize: 13, color: colors.muted },
});
