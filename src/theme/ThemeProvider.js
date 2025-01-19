// src/theme/ThemeProvider.js
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native'; // Sistem temasını algılamak için
import { LightTheme, DarkTheme } from './themes';

// 1. Context oluştur
const ThemeContext = createContext(LightTheme);

// 2. Provider tanımı
export const ThemeProvider = ({ children }) => {
    
  // Kullanıcının cihaz temasını alalım: 'dark' veya 'light'
  const colorScheme = useColorScheme();

  // colorScheme 'dark' ise DarkTheme objesini, değilse LightTheme objesini seçiyoruz
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Kolaylık için bir custom hook oluşturalım
export const useTheme = () => useContext(ThemeContext);
