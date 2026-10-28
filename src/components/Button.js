import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Button({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity style={[styles.btn, style, disabled && { opacity: 0.6 }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
