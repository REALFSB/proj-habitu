import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, globalStyles as g } from '../theme';

export default function RateBar({ position, name, rate, detail }) {
  const pct = Math.round(rate * 100);
  const color = pct >= 70 ? colors.ok : pct >= 40 ? colors.primary : colors.danger;
  return (
    <View style={styles.box}>
      <View style={styles.head}>
        <Text style={[g.cardTitle, { flex: 1 }]} numberOfLines={1}>{position}. {name}</Text>
        <Text style={[g.cardTitle, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={g.muted}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 10, backgroundColor: colors.track, borderRadius: 5, marginVertical: 8, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
});
