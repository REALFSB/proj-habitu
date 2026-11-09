import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, globalStyles as g } from '../theme';

const SIZE = 18;
const GAP = 3;

// columns: matriz de semanas; célula = { key, count, level (0..1 | null) } ou null (espaço vazio)
export default function Heatmap({ columns }) {
  const cellStyle = (c) => {
    if (!c) return { backgroundColor: 'transparent' };
    if (c.level === null) return { backgroundColor: colors.track, opacity: 0.4 }; // dia sem hábitos criados
    if (c.level === 0) return { backgroundColor: colors.track };
    return { backgroundColor: colors.primary, opacity: 0.3 + 0.7 * Math.min(1, c.level) };
  };

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <View style={{ marginRight: 6 }}>
          {'DSTQQSS'.split('').map((l, i) => (
            <Text key={i} style={styles.label}>{l}</Text>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {columns.map((col, ci) => (
            <View key={ci}>
              {col.map((c, ri) => <View key={ri} style={[styles.cell, cellStyle(c)]} />)}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.legend}>
        <Text style={g.muted}>Menos</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((l) => (
          <View key={l} style={[styles.cell, { margin: 2 }, cellStyle({ level: l })]} />
        ))}
        <Text style={g.muted}>Mais</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  row: { flexDirection: 'row' },
  cell: { width: SIZE, height: SIZE, borderRadius: 4, margin: GAP / 2 },
  label: { height: SIZE + GAP, lineHeight: SIZE + GAP, fontSize: 11, color: colors.muted },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
});
