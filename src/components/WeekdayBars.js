import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, globalStyles as g } from '../theme';

// weekdays: [{ label, rate (0..1), hasData }] | best: item destacado
export default function WeekdayBars({ weekdays, best }) {
  return (
    <View style={styles.box}>
      {weekdays.map((w, i) => (
        <View key={i} style={{ alignItems: 'center' }}>
          <Text style={g.muted}>{w.hasData ? `${Math.round(w.rate * 100)}` : '-'}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { height: `${w.rate * 100}%`, backgroundColor: w === best ? colors.ok : colors.primary }]} />
          </View>
          <Text style={[g.muted, w === best && { color: colors.ok, fontWeight: '800' }]}>{w.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  track: { height: 90, width: 24, backgroundColor: colors.track, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden', marginVertical: 4 },
  fill: { borderRadius: 6 },
});
