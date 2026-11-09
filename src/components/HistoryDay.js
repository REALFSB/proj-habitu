import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles as g } from '../theme';
import { prettyDate } from '../utils/dates';

export default function HistoryDay({ date, names, total }) {
  return (
    <View style={[g.card, { flexDirection: 'column', alignItems: 'stretch' }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={g.cardTitle}>{prettyDate(date)}</Text>
        <Text style={g.muted}>{names.length}/{total}</Text>
      </View>
      {names.map((n, i) => <Text key={i} style={g.muted}>✓ {n}</Text>)}
    </View>
  );
}
