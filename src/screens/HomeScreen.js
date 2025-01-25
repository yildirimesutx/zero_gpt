import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import MainMenu from '../components/MainMenu';
import InfoSection from '../components/InfoSection';
import ValuesGrid from '../components/ValuesGrid';
import Projects from '../components/Projects';
import BlogPosts from '../components/Blogs';
import Events from '../components/Events';

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollContent}>
      {/* Menü */}
      <MainMenu />

      {/* Blog Yazıları */}
      <View style={styles.section}>
        <BlogPosts />
      </View>

      <View style={styles.section}>
        <InfoSection />
      </View>

      {/* Etkinlikler */}
      <View style={styles.section}>
        <Events />
      </View>

      <View style={styles.section}>
      <ValuesGrid/>
      </View>

    

      {/* Projeler */}
      <View style={styles.section}>
        <Projects />
      </View>

      {/* Alt Değerler */}
     
    </ScrollView>

      {/* Sohbet Butonu */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('GptPage')}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#f9f9f9',
  },

  section: {
    marginBottom: 20, // Her bölüm arasına boşluk
    paddingHorizontal: 10, // Yandan boşluklar
  },
  iconButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
