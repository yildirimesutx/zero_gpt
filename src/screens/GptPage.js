import React, { useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import ChatPage from './ChatPage'; // Chat bileşeni
import HomeScreen from './HomeScreen'; // Ana sayfa bileşeni
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider'; // Tema context'inizi import edin

const Drawer = createDrawerNavigator();

const GptPage = () => {
  const theme = useTheme();

  const [topics] = useState([
    { id: 'topic1', title: 'Doğal Kaynakların Korunması' },
    { id: 'topic2', title: 'Atık Yönetimi Stratejileri' },
    { id: 'topic3', title: 'Geri Dönüşüm Bilinci' },
  ]);

  return (
    <Drawer.Navigator
      initialRouteName="ChatPage"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} topics={topics} />
      )}
      screenOptions={{
        // Drawer renk ayarları
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        // Header ayarları: temadan gelen değerler kullanılıyor
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
          elevation: 0,     // Android: gölgeyi kaldırır
          shadowOpacity: 0, // iOS: gölgeyi kaldırır
        },
        headerTintColor: theme.colors.headerText,
        headerTitleAlign: 'center',
      }}
    >
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
    </Drawer.Navigator>
  );
};

// Özel Drawer İçeriği
const CustomDrawerContent = (props) => {
  const theme = useTheme();
  const { topics, navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      {/* Ana Sayfa Yönlendirmesi */}
      <DrawerItem
        label="Ana Sayfa"
        labelStyle={{ color: theme.colors.text }}
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
        icon={({ size }) => (
          <Ionicons name="home" size={size} color={theme.colors.text} />
        )}
      />

      <View style={styles.divider} />

      {/* Sohbetler Başlığı */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Sohbetler
      </Text>

      {/* Konu (topic) listesi */}
      {topics.map((topic, index) => (
        <DrawerItem
          key={index}
          label={topic.title}
          labelStyle={{ color: theme.colors.text }}
          onPress={() =>
            navigation.navigate('ChatPage', { topicId: topic.id })
          }
          icon={({ size }) => (
            <Ionicons
              name="chatbubbles"
              size={size}
              color={theme.colors.text}
            />
          )}
        />
      ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 5,
  },
});
