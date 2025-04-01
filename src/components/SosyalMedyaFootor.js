import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const icons = [
  {
    name: 'Facebook',
    source: require('../../assets/header/Facebook.png'),
    url: 'https://www.facebook.com/sifiratikgovtr',
  },
  {
    name: 'LinkedIn',
    source: require('../../assets/header/Linkedin.png'),
    url: 'https://www.linkedin.com/in/s%C4%B1f%C4%B1rat%C4%B1k/',
  },
  {
    name: 'X',
    source: require('../../assets/header/X.png'),
    url: 'https://x.com/sifiratikgov',
  },
  {
    name: 'YouTube',
    source: require('../../assets/header/Youtube.png'),
    url: 'https://www.youtube.com/@sifir_atik',
  },
  {
    name: 'Instagram',
    source: require('../../assets/header/Instagram.png'),
    url: 'https://www.instagram.com/sifiratikgov',
  },
];

const SosyalMedyaFooter = () => {
  const theme = useTheme();
  // Tema üzerinden dark mod kontrolü yapıyoruz.
  const isDark = theme.colors.background === '#000000';
  // Dark modda '#121212', light modda '#f9f9f9' arka plan rengi
  const containerBg = isDark ? '#121212' : '#f9f9f9';

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.log('Bağlantı açılamadı:', err);
    }
  };

  return (
    <View style={[styles.footerContainer, { backgroundColor: containerBg }]}>
      {icons.map((icon, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => openLink(icon.url)}
          style={styles.iconWrapper}
        >
          <Image source={icon.source} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SosyalMedyaFooter;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    marginHorizontal: 10,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
