// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import i18n from '../i18n/i18n';

const SettingsScreen = () => {
  // Güncellenmiş ThemeProvider'dan { colors, setUserTheme } döndürülüyor.
  const { colors, setUserTheme } = useTheme();
  
  // Başlangıç tema tercihini, renk değerine göre belirleyelim.
  const initialTheme = colors.background === '#000000' ? 'dark' : 'light';
  const initialLanguage = i18n.locale.startsWith('tr') ? 'tr' : 'en';
  
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    setUserTheme(newTheme); // Global tema güncellemesi
    console.log("Theme changed to:", newTheme);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.locale = lang;
    console.log("Language changed to:", lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}>Settings</Text>
      
      {/* Tema Ayarları */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              selectedTheme === 'light' && styles.activeButton
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Text style={[
              styles.buttonText, 
              selectedTheme === 'light' && styles.activeButtonText
            ]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              selectedTheme === 'dark' && styles.activeButton
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Text style={[
              styles.buttonText, 
              selectedTheme === 'dark' && styles.activeButtonText
            ]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Dil Ayarları */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Language</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              selectedLanguage === 'en' && styles.activeButton
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[
              styles.buttonText, 
              selectedLanguage === 'en' && styles.activeButtonText
            ]}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              selectedLanguage === 'tr' && styles.activeButton
            ]}
            onPress={() => handleLanguageChange('tr')}
          >
            <Text style={[
              styles.buttonText, 
              selectedLanguage === 'tr' && styles.activeButtonText
            ]}>
              Türkçe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#004d00',
  },
  buttonText: {
    fontSize: 16,
    color: '#004d00',
  },
  activeButtonText: {
    color: '#fff',
  },
});
