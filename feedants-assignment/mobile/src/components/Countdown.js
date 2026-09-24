import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

function diffParts(target) {
  const ms = Math.max(new Date(target).getTime() - Date.now(), 0);
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [days, hours, minutes, seconds];
}
export function Countdown({ target, label }) {
  const [parts, setParts] = useState(() => target ? diffParts(target) : [0,0,0,0]);
  useEffect(() => { if (!target) return; const id = setInterval(() => setParts(diffParts(target)), 1000); return () => clearInterval(id); }, [target]);
  const [d,h,m,s] = parts;
  return <View style={styles.bar}><Ionicons name="hourglass-outline" size={18} color={colors.primary} /><Text style={styles.label}>{label}</Text><Text style={styles.time}>{String(d).padStart(2,'0')}d : {String(h).padStart(2,'0')}h : {String(m).padStart(2,'0')}m : {String(s).padStart(2,'0')}s</Text><Ionicons name="timer-outline" size={19} color={colors.primary} /></View>;
}
const styles = StyleSheet.create({ bar: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, label: { fontWeight: '700', color: colors.text, flex: 1, fontSize: 12 }, time: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' } });
