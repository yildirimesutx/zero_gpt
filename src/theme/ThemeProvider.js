// src/theme/ThemeProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from './themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState(null);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const pref = await AsyncStorage.getItem('userTheme');
        if (pref) setUserPreference(pref);
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };
    loadPreference();
  }, []);

  // Eğer kullanıcı tercihi varsa onu, yoksa sistem temasını kullanıyoruz.
  const currentThemeName = userPreference ? userPreference : systemColorScheme === 'dark' ? 'dark' : 'light';
  const currentTheme = currentThemeName === 'dark' ? DarkTheme : LightTheme;

  // Eski kullanımı bozmamak için, context değeri doğrudan tema nesnesi gibi kullanılacak; 
  // ek olarak setUserTheme fonksiyonunu da aynı nesneye ekliyoruz.
  const themeWithSetter = {
    ...currentTheme,
    setUserTheme: async (newTheme) => {
      try {
        await AsyncStorage.setItem('userTheme', newTheme);
        setUserPreference(newTheme);
      } catch (error) {
        console.error("Error setting theme:", error);
      }
    },
  };

  return (
    <ThemeContext.Provider value={themeWithSetter}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
