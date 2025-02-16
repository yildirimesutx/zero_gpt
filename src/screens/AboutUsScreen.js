// src/screens/AboutUsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import i18n from '../i18n/i18n';

const { width } = Dimensions.get('window');

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../../assets/about_us_main_mobile.jpg')} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <Text style={styles.headerText}>{i18n.t('about_us')}</Text>
      <Text style={styles.contentText}>{i18n.t('about_page_content-1')}</Text>
      <Text style={styles.contentText}>{i18n.t('about_page_content-2')}</Text>
      <Text style={styles.contentText}>{i18n.t('about_page_content-3')}</Text>
      <Text style={styles.contentText}>{i18n.t('about_page_content-4')}</Text>
    </ScrollView>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // Arka plan rengi isteğe göre değiştirilebilir.
    marginTop:50
  },
  image: {
    width: width - 40, // Container padding'ını göz önünde bulundurarak
    height: (width - 40) * 0.6, // Orantılı yükseklik (örneğin %60 oranında)
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004d00', // İstediğiniz renk
    textAlign: 'center',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
