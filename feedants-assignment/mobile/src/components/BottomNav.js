import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
export function BottomNav() { return <View style={styles.nav}><Item icon="home-outline" text="Home"/><Item icon="search-outline" text="Explore"/><View style={styles.plus}><Ionicons name="add" size={28} color={colors.white}/></View><Item icon="trophy-outline" text="Competitions" active/><Item icon="person-circle-outline" text="Profile"/></View>; }
function Item({ icon, text, active }) { return <View style={styles.item}><Ionicons name={icon} size={22} color={active ? colors.primary : '#8790A5'}/><Text style={[styles.text, active && styles.active]}>{text}</Text></View>; }
const styles = StyleSheet.create({ nav: { height: 72, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, item: { alignItems: 'center', width: 72 }, text: { fontSize: 9, marginTop: 2, color: '#8790A5' }, active: { color: colors.primary, fontWeight: '800' }, plus: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: -24, borderWidth: 5, borderColor: colors.white } });
