import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import MainMenu from '../components/MainMenu';
import InfoSection from '../components/InfoSection';
import ValuesGrid from '../components/ValuesGrid';
import Projects from '../components/Projects';
import BlogPosts from '../components/Blogs';
import Events from '../components/Events';
import AIAssistantSection from '../components/AIAssistantSection';
import News from '../components/News';
import PartnerSection from './PartnerSection';

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollContent} nestedScrollEnabled={true}>
        {/* Menü */}
        <MainMenu />

        {/* AI Asistan */}
        <View style={styles.sectionAI}>
          <AIAssistantSection navigation={navigation} />
        </View>

        

        <View style={styles.section}>
          <PartnerSection />
          </View>

        {/* Blog Yazıları */}
        {/* <View style={styles.section}>
          <BlogPosts />
        </View> */}

        {/* Bilgi Bölümü */}
        <View style={styles.section}>console.log('HomeScreen component rendered');
          <InfoSection />
        </View>

            {/* Projeler */}
        {/* <View style={styles.section}>
          <News />
        </View> */}

          {/* Projeler */}
        {/* <View style={styles.section}>
          <Projects />
        </View> */}

        {/* Etkinlikler */}
        {/* <View style={styles.section}>
          <Events />
        </View> */}

        {/* Değerler Grid */}
        <View style={styles.section}>
          <ValuesGrid />
        </View>

      
      </ScrollView>

      {/* Sohbet Düğmesi */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('GptPage')}
      >
        <Image source={require('../../assets/robot.png')} style={styles.image} />
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionAI: {
    marginBottom: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  iconButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
