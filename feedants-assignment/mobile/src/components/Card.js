import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

export function Card({ children, style }) { return <View style={[styles.card, style]}>{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radius, padding: 16, marginBottom: 12 } });
