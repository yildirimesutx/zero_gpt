// src/screens/AIAssistantSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import i18n from '../i18n/i18n';

const { width } = Dimensions.get('window');

const AIAssistantSection = ({ navigation }) => {
  const theme = useTheme();
  // DarkTheme'de background: '#000000' olduğundan bunu kontrol edebiliriz.
  const isDark = theme.colors.background === '#000000';

  return (
    <View
      style={[
        styles.container,
        {
          width: width * 0.9,
          backgroundColor: isDark ? '#2c2c2c' : '#e8f5e9',
        },
      ]}
    >
      <Image
        source={require('../../assets/robot-assistant.png')}
        style={styles.image}
      />
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#004d00' }]}>
        {i18n.t('ai_assistant_section.header')}
      </Text>
      <Text style={[styles.description, { color: isDark ? '#ccc' : '#666' }]}>
      {i18n.t('ai_assistant_section.text')}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#11A624' : '#004d00' }]}
        onPress={() => navigation.navigate('GptPage')}
      >
        <Text style={styles.buttonText}> {i18n.t('ai_assistant_section.buton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AIAssistantSection;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
