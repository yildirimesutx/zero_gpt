import React, { useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n/i18n';

const { width } = Dimensions.get('window');

const AboutUsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.headerText,
      headerTitleStyle: { color: colors.headerText },
    });
  }, [navigation, colors]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { backgroundColor: colors.background, flexGrow: 1 }
        ]}
      >
        <Image 
          source={require('../../assets/about_us_main_mobile.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <Text style={[styles.headerText, { color: colors.headerText }]}>{i18n.t('about_us')}</Text>
        <Text style={[styles.contentText, { color: colors.text }]}>{i18n.t('about_page_content-1')}</Text>
        <Text style={[styles.contentText, { color: colors.text }]}>{i18n.t('about_page_content-2')}</Text>
        <Text style={[styles.contentText, { color: colors.text }]}>{i18n.t('about_page_content-3')}</Text>
        <Text style={[styles.contentText, { color: colors.text }]}>{i18n.t('about_page_content-4')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 0, // marginTop kaldırıldı; SafeAreaView yönetiyor
  },
  image: {
    width: width - 40,
    height: (width - 40) * 0.6,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});
