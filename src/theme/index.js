import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6C5CE7',
  bg: '#F5F6FA',
  card: '#FFFFFF',
  text: '#2D3436',
  muted: '#636E72',
  ok: '#00B894',
  danger: '#D63031',
  track: '#DFE6E9',
};

// Estilos compartilhados entre as telas
export const globalStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 10 },
  muted: { color: colors.muted, fontSize: 14 },
  input: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginVertical: 8, fontSize: 16 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
});
