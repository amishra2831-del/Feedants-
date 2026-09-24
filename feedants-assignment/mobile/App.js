import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';

export default function App() {
  return <SafeAreaProvider><CompetitionDetailsScreen /></SafeAreaProvider>;
}
