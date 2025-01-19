import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
  );
}
