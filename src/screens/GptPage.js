import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import ChatPage from './ChatPage'; // Chat bileşeni
import HomeScreen from './HomeScreen'; // Ana sayfa bileşeni
import Ionicons from '@expo/vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const GptPage = () => {
  const [topics] = useState([
    { id: 'topic1', title: 'Doğal Kaynakların Korunması' },
    { id: 'topic2', title: 'Atık Yönetimi Stratejileri' },
    { id: 'topic3', title: 'Geri Dönüşüm Bilinci' },
  ]);

  return (
    <Drawer.Navigator
      initialRouteName="ChatPage" // Varsayılan olarak ChatPage başlatılacak
      drawerContent={(props) => <CustomDrawerContent {...props} topics={topics} />}
      screenOptions={{
        drawerActiveTintColor: '#004d00',
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}
    >
      {/* Chat Sayfası */}
      <Drawer.Screen
        name="ChatPage"
        component={ChatPage}
        options={{
          title: 'ZeroGPT',
          headerStyle: {
            elevation: 0, // Android için gölgeyi kaldırır
            shadowOpacity: 0, // iOS için gölgeyi kaldırır
          },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Özel Drawer İçeriği
const CustomDrawerContent = (props) => {
  const { topics, navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      {/* Ana Sayfa Yönlendirmesi */}
      <DrawerItem
        label="Ana Sayfa"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} // Ana Sayfa'ya yönlendirme
        icon={({ color, size }) => <Ionicons name="home" size={size} color={color} />}
      />

      {/* Çizgi */}
      <View style={styles.divider} />

      {/* Sohbetler Başlığı */}
      <Text style={styles.sectionTitle}>Sohbetler</Text>

      {/* Geçmiş Topics Listesi */}
      {topics.map((topic, index) => (
        <DrawerItem
          key={index}
          label={topic.title}
          onPress={() => navigation.navigate('ChatPage', { topicId: topic.id })}
          icon={({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />}
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
    color: '#333',
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 5,
  },
});
