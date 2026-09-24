import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
export function Pill({ children }) { return <View style={styles.pill}><Text style={styles.text}>{children}</Text></View>; }
const styles = StyleSheet.create({ pill: { backgroundColor: '#F3F5F8', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, marginRight: 6 }, text: { fontSize: 11, fontWeight: '700', color: colors.text } });
