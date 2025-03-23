import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n/i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const { colors, setUserTheme } = useTheme();
  const navigation = useNavigation();
  
  // Başlangıç tema tercihini, renk değerine göre belirleyelim.
  const initialTheme = colors.background === '#000000' ? 'dark' : 'light';
  const initialLanguage = i18n.locale.startsWith('tr') ? 'tr' : 'en';
  
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  
  // Pasif buton rengi: dark modda beyaz, light modda koyu yeşil tonunda (#004d00)
  const passiveOptionColor = colors.background === '#000000' ? '#FFF' : '#004d00';

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    setUserTheme(newTheme);
    console.log("Theme changed to:", newTheme);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.locale = lang;
    console.log("Language changed to:", lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}></Text>
      
      {/* Theme Settings Card */}
      <View style={[styles.card, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="color-palette" size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {i18n.t('theme.theme')}</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, selectedTheme === 'light' && styles.optionButtonActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Ionicons 
              name="sunny" 
              size={20} 
              color={selectedTheme === 'light' ? '#fff' : passiveOptionColor} 
            />
            <Text style={[
              styles.optionText, 
              selectedTheme === 'light' 
                ? styles.optionTextActive 
                : { color: passiveOptionColor }
            ]}>
               {i18n.t('theme.light')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionButton, selectedTheme === 'dark' && styles.optionButtonActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Ionicons 
              name="moon" 
              size={20} 
              color={selectedTheme === 'dark' ? '#fff' : passiveOptionColor} 
            />
            <Text style={[
              styles.optionText, 
              selectedTheme === 'dark' 
                ? styles.optionTextActive 
                : { color: passiveOptionColor }
            ]}>
              {i18n.t('theme.dark')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Language Settings Card */}
      <View style={[styles.card, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="language" size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{i18n.t('language.language')}</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, selectedLanguage === 'en' && styles.optionButtonActive]}
            onPress={() => handleLanguageChange('en')}
          >
            <Ionicons 
              name="flag" 
              size={20} 
              color={selectedLanguage === 'en' ? '#fff' : passiveOptionColor} 
            />
            <Text style={[
              styles.optionText, 
              selectedLanguage === 'en' 
                ? styles.optionTextActive 
                : { color: passiveOptionColor }
            ]}>
              {i18n.t('language.english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionButton, selectedLanguage === 'tr' && styles.optionButtonActive]}
            onPress={() => handleLanguageChange('tr')}
          >
            <Ionicons 
              name="flag" 
              size={20} 
              color={selectedLanguage === 'tr' ? '#fff' : passiveOptionColor} 
            />
            <Text style={[
              styles.optionText, 
              selectedLanguage === 'tr' 
                ? styles.optionTextActive 
                : { color: passiveOptionColor }
            ]}>
              {i18n.t('language.turkisch')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Modern Ana Sayfa Butonu */}
      <TouchableOpacity 
        style={[styles.homeButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={20} color="#FFF" />
        <Text style={styles.homeButtonText}>{i18n.t('home_page.home_page')}</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    // iOS shadow:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android elevation:
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: '#004d00',
    borderColor: '#004d00',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 6,
    // color ayarı inline olarak veriliyor.
  },
  optionTextActive: {
    color: '#fff',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    // iOS shadow:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation:
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#FFF',
    marginLeft: 8,
    textAlign: 'center',
  },
});
