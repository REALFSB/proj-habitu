import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PeriodSelector from '../components/PeriodSelector';
import StatCard from '../components/StatCard';
import { useHabits } from '../context/HabitsContext';
import { computeMetrics } from '../utils/metrics';
import { colors, globalStyles as g } from '../theme';

const PERIODS = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
];

export default function DashboardScreen() {
  const { habits, completions } = useHabits();
  const [period, setPeriod] = useState(30);

  // Todas as métricas saem do histórico de conclusões
  const m = useMemo(() => computeMetrics(habits, completions, period), [habits, completions, period]);
  const pct = Math.round(m.rate * 100);

  return (
    <SafeAreaView style={g.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={g.title}>Dashboard</Text>
        <PeriodSelector value={period} options={PERIODS} onChange={setPeriod} />

        {/* Taxa de conclusão */}
        <View style={{ backgroundColor: colors.primary, borderRadius: 18, padding: 20, marginTop: 16 }}>
          <Text style={{ color: '#E6E3FB', fontWeight: '600' }}>Taxa de conclusão · últimos {period} dias</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
            <Text style={{ color: '#fff', fontSize: 52, fontWeight: '800' }}>{pct}%</Text>
            {m.trend !== null && (
              <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 12, marginBottom: 10 }}>
                {m.trend >= 0 ? '▲' : '▼'} {Math.abs(m.trend)} pts vs. anterior
              </Text>
            )}
          </View>
          <View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5, marginTop: 6, overflow: 'hidden' }}>
            <View style={{ height: 10, width: `${pct}%`, backgroundColor: '#fff', borderRadius: 5 }} />
          </View>
          <Text style={{ color: '#E6E3FB', marginTop: 8 }}>{m.done} de {m.expected} conclusões possíveis</Text>
        </View>

        {/* Cartões de métricas */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <StatCard icon="✅" value={m.done} label="Conclusões" />
          <StatCard icon="✨" value={m.perfectDays} label="Dias perfeitos" />
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <StatCard icon="🔥" value={`${m.currentStreak}d`} label="Sequência atual" />
          <StatCard icon="🏆" value={`${m.bestStreak}d`} label="Melhor sequência" />
        </View>
        <Text style={[g.muted, { marginTop: 8 }]}>Média de {m.avgPerDay.toFixed(1)} conclusões por dia</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
