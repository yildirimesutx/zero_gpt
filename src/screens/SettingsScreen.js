import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { t } = useTranslation(); // Çeviriler için useTranslation kullanımı
  const { language, setLanguage } = useContext(LanguageContext);
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      {/* Dil Ayarları */}
      <Text style={styles.text}>{t('settings.title')}</Text>
      <Text style={styles.text}>{t('settings.language')}: {language}</Text>
      <Button title={t('settings.language') + ': English'} onPress={() => setLanguage('en')} />
      <Button title={t('settings.language') + ': Türkçe'} onPress={() => setLanguage('tr')} />

      {/* Tema Ayarları */}
      <Text style={styles.text}>{t('settings.theme')}</Text>
      <Button title={t('settings.theme') + ': Light'} onPress={() => setTheme('light')} />
      <Button title={t('settings.theme') + ': Dark'} onPress={() => setTheme('dark')} />
      <Button title={t('settings.theme') + ': System'} onPress={() => setTheme('system')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  light: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dark: {
    backgroundColor: '#000000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
