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
import { useTheme } from '../theme/ThemeProvider'; // Tema context'inizi import edin
import { useNavigation } from '@react-navigation/native';

const MainMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme(); // Tema değerlerini alıyoruz
  const navigation = useNavigation();

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      {/* Status Bar ve Arka Plan Uyumu */}
      <LinearGradient
        colors={['#004d00', '#004d00']}
        style={styles.statusBarBackground}
      >
        <StatusBar
          translucent
          backgroundColor="#004d00"
          barStyle="light-content"
        />
      </LinearGradient>

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.containerWrapper}>
          {/* Header ve Karşılama Mesajı */}
          <LinearGradient
            colors={['#004d00', '#33cc66']}
            style={styles.headerAndWelcomeContainer}
          >
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
              />
              <TouchableOpacity onPress={handleMenuPress}>
                <MaterialIcons name="menu" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Toplulukları Güçlendirerek, Hayatları Dönüştürüyoruz.!
              </Text>
              <Text style={styles.subText}>
                Sıfır Atık'a katılarak fark yaratın. Kurumumuz, çeşitli
                topluluk projeleri ve girişimleri aracılığıyla hayatları iyileştirmeye
                kendini adamıştır.
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
                onPress={() => navigation.navigate('AboutUsScreen')}
              >
                <Text style={{ color: theme.colors.text }}>Hakkımızda</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('NewsScreen')}
              >
                <Text style={{ color: theme.colors.text }}>Haberler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('BlogsScreen')}
              >
                <Text style={{ color: theme.colors.text }}>Blog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ProjectsScreen')}
              >
                <Text style={{ color: theme.colors.text }}>Projeler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                <Text style={{ color: theme.colors.text }}>Kapat</Text>
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
    height: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
  },
  safeArea: {
    flex: 1,
    // Arka plan temadan alınacak, default burada '#fff' idi.
  },
  containerWrapper: {
    flex: 1,
  },
  headerAndWelcomeContainer: {
    borderBottomLeftRadius: 30, // Alt köşelere radius
    borderBottomRightRadius: 30, // Alt köşelere radius
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
  logo: {
    width: 90,
    height: 45,
    resizeMode: 'contain',
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
    width: 200,
    // backgroundColor burada sabit '#fff' idi, artık temadan alınıyor.
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#16A349',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
});
