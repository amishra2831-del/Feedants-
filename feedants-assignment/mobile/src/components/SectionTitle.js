import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
export function SectionTitle({ children }) { return <View style={styles.wrap}><Text style={styles.title}>{children}</Text><View style={styles.line}/></View>; }
const styles = StyleSheet.create({ wrap: { marginBottom: 10 }, title: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 7 }, line: { height: 1, backgroundColor: colors.border } });
