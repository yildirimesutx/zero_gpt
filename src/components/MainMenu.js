import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n/i18n';

const MainMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const lang = i18n.locale;
  console.log("lang", lang);

  return (
    <>
      {/* Status Bar ve Arka Plan Uyumu */}
      <LinearGradient
        colors={['#397d31', '#48a03e']}
        style={styles.statusBarBackground}
      >
        <StatusBar
          translucent
          backgroundColor="#397d31"
          barStyle="light-content"
        />
      </LinearGradient>

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.containerWrapper}>
          {/* Header ve Karşılama Mesajı */}
          <LinearGradient
            colors={['#48a03e', '#67c04d']}
            style={styles.headerAndWelcomeContainer}
          >
            <View style={styles.headerContainer}>
              {/* Logo alanı container'ı */}
              <View style={styles.logoContainer}>
                {lang && lang.toLowerCase().startsWith("tr") ? 
                  <Image
                    source={require('../../assets/logo_tr.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  /> :
                  <Image
                    source={require('../../assets/logo_new2.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                }
              </View>
              <TouchableOpacity onPress={handleMenuPress}>
                <MaterialIcons name="menu" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                {i18n.t('heroSection.title')}
              </Text>
              <Text style={styles.subText}>
                {i18n.t('heroSection.subtitle')}
              </Text>
            </View>
          </LinearGradient>

          {/* Menü Modal */}
          <Modal visible={menuVisible} transparent={true} animationType="fade">
            <TouchableOpacity style={styles.overlay} onPress={closeMenu} />
            <View style={[styles.sideMenuContainer, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                Menü
              </Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  navigation.navigate('AboutUsScreen');
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={theme.colors.text}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>{i18n.t('about_us')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  navigation.navigate('ContactForm');
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={theme.colors.text}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>{i18n.t('contact')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  navigation.navigate('SettingsScreen');
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.colors.text}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>{i18n.t('settings')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={theme.colors.text}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>{i18n.t('close')}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 65 : StatusBar.currentHeight,
  },
  safeArea: {
    flex: 1,
  },
  containerWrapper: {
    flex: 1,
  },
  headerAndWelcomeContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 70,
  },
  // Logo için container: Belirlediğimiz boyutlarda kalmasını sağlıyoruz
  logoContainer: {
    width: 140,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Logonun içindeki image: container boyutunu dolduracak şekilde ayarlanıyor
  logoImage: {
    width: '100%',
    height: '100%',
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    height: 300,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#fff',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#eeeeee',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 250,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
});
