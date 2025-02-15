import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import ChatPage from './ChatPage'; // Örnek: Chat bileşeni (ZeroGPT ekranı)
import HomeScreen from './HomeScreen'; // Örnek: Ana sayfa bileşeni
// import SettingsScreen from './SettingsScreen'; // Ayarlar ekranı (kendi oluşturduğunuz bileşen)
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider'; // Tema context'inizi import edin

const Drawer = createDrawerNavigator();

const GptPage = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="ChatPage"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
          elevation: 0,     // Android gölgesini kaldırır
          shadowOpacity: 0, // iOS gölgesini kaldırır
        },
        headerTintColor: theme.colors.headerText,
        headerTitleAlign: 'center',
      }}
    >
      {/* Örnek ekranlar */}
      <Drawer.Screen
        name="ChatPage"
        component={ChatPage}
        options={{
          title: 'ZeroGPT',
          drawerIcon: ({ size }) => (
            <Ionicons name="chatbubble" size={size} color={theme.colors.text} />
          ),
        }}
      />
      <Drawer.Screen
        name="Haberler"
        component={HomeScreen} // Haberler ekranı bileşeni (örnek olarak HomeScreen kullanıldı)
        options={{
          title: 'Haberler',
          drawerIcon: ({ size }) => (
            <Ionicons name="newspaper" size={size} color={theme.colors.text} />
          ),
        }}
      />
      <Drawer.Screen
        name="Blog"
        component={HomeScreen} // Blog ekranı bileşeni (örnek olarak HomeScreen kullanıldı)
        options={{
          title: 'Blog',
          drawerIcon: ({ size }) => (
            <Ionicons name="book" size={size} color={theme.colors.text} />
          ),
        }}
      />
      <Drawer.Screen
        name="Etkinlikler"
        component={HomeScreen} // Etkinlikler ekranı bileşeni (örnek olarak HomeScreen kullanıldı)
        options={{
          title: 'Etkinlikler',
          drawerIcon: ({ size }) => (
            <Ionicons name="calendar" size={size} color={theme.colors.text} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={HomeScreen} // Ayarlar ekranı bileşeni
        options={{
          title: 'Ayarlar',
          drawerIcon: ({ size }) => (
            <Ionicons name="settings" size={size} color={theme.colors.text} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Custom Drawer İçeriği
const CustomDrawerContent = (props) => {
  const theme = useTheme();
  const { navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        {/* Ana Sayfa Yönlendirmesi.. */}
        <DrawerItem
          label="Ana Sayfa"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Home')}
          icon={({ size }) => (
            <Ionicons name="home" size={size} color={theme.colors.text} />
          )}
        />

        <View style={styles.divider} />

        {/* Menü Başlığı */}
        <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
          Menü
        </Text>

        {/* Sabit Menü Öğeleri */}
        <DrawerItem
          label="Haberler"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Haberler')}
          icon={({ size }) => (
            <Ionicons name="newspaper" size={size} color={theme.colors.text} />
          )}
        />
        <DrawerItem
          label="Blog"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Blog')}
          icon={({ size }) => (
            <Ionicons name="book" size={size} color={theme.colors.text} />
          )}
        />
        <DrawerItem
          label="Etkinlikler"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Etkinlikler')}
          icon={({ size }) => (
            <Ionicons name="calendar" size={size} color={theme.colors.text} />
          )}
        />
      </View>

      {/* En Alt Kısımda Ayarlar Menüsü */}
      <DrawerItem
        label="Ayarlar"
        labelStyle={{ color: theme.colors.text }}
        onPress={() => navigation.navigate('Setting')}
        icon={({ size }) => (
          <Ionicons name="settings" size={size} color={theme.colors.text} />
        )}
      />
    </DrawerContentScrollView>
  );
};

export default GptPage;

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginVertical: 10,
  },
});
