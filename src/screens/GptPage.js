import React, { useState, useCallback } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../theme/ThemeProvider';
import ChatPage from './ChatPage';
import HomeScreen from './HomeScreen';

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
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleAlign: 'center',
      }}
    >
      {/* ChatPage */}
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

      {/* Diğer menüler (Haberler, Blog, Etkinlikler, Ayarlar) ... */}
      <Drawer.Screen
        name="Haberler"
        component={HomeScreen}
        options={{
          title: 'Haberler',
          drawerIcon: ({ size }) => (
            <Ionicons name="newspaper" size={size} color={theme.colors.text} />
          ),
        }}
      />
      {/* ... vs ... */}
    </Drawer.Navigator>
  );
};

// Custom Drawer İçeriği
const CustomDrawerContent = (props) => {
  const theme = useTheme();
  const { navigation } = props;
  const [conversations, setConversations] = useState([]);

  // Drawer açıldığında/liste yenilendiğinde
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      const data = await AsyncStorage.getItem('conversations');
      if (data) {
        let list = JSON.parse(data);
        
        // Diziyi ters çevir: son eklenen konuşma en başta görünsün
        list.reverse();
        
        setConversations(list);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.log('AsyncStorage read error:', error);
    }
  };
  

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        {/* Ana Sayfa */}
        <DrawerItem
          label="Ana Sayfa"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Home')}
          icon={({ size }) => (
            <Ionicons name="home" size={size} color={theme.colors.text} />
          )}
        />

        <View style={styles.divider} />

        {/* YENİ SOHBET */}
        <DrawerItem
          label="Yeni Sohbet"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => {
            // ChatPage'e parametre: newConversation: true
            navigation.navigate('ChatPage', { newConversation: true });
          }}
          icon={({ size }) => (
            <Ionicons name="add-circle" size={size} color={theme.colors.text} />
          )}
        />

        {/* Sohbet Geçmişi Başlığı */}
        <Text style={[styles.menuTitle, { color: theme.colors.text, marginTop: 16 }]}>
          Sohbet Geçmişi
        </Text>

        {/* Konuşma Geçmişi Listesi */}
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            // snippet => ilk user mesajının 15 karakteri
            const firstUserMsg = conv.messages?.find(m => m.sender === 'user');
            let snippet = 'Yeni Konuşma';
            if (firstUserMsg && firstUserMsg.text) {
              snippet = firstUserMsg.text.substring(0, 15);
              if (firstUserMsg.text.length > 15) snippet += '...';
            }

            return (
              <DrawerItem
                key={conv.id}
                label={`${snippet} - ${conv.time}`}
                labelStyle={{ color: theme.colors.text, fontSize: 14 }}
                onPress={() => {
                  // Eski konuşma => readOnly
                  navigation.navigate('ChatPage', {
                    conversationId: conv.id,
                    readOnly: true,
                  });
                }}
                icon={({ size }) => (
                  <Ionicons name="time" size={size} color={theme.colors.text} />
                )}
              />
            );
          })
        ) : (
          <Text style={{ marginLeft: 16, color: theme.colors.text }}>
            Kayıtlı sohbet yok
          </Text>
        )}
      </View>

      {/* En Alt Kısımda Ayarlar Menüsü vs */}
      {/* ... */}
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
