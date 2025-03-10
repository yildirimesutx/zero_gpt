import React, { useState, useCallback, useEffect } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { useTheme } from '../theme/ThemeProvider';
import ChatPage from './ChatPage';
import HomeScreen from './HomeScreen';
import { useDrawerStatus } from '@react-navigation/drawer';

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

      {/* ... diğer menüler ... */}
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  const theme = useTheme();
  const { navigation } = props;
  const [conversations, setConversations] = useState([]);
  const drawerStatus = useDrawerStatus(); // 'open' veya 'closed'

  // Drawer açıldığında/liste yenilendiğinde
  const route = useRoute();
  const newConv = route.params ? route.params.newConversation : false;

  useFocusEffect(
    useCallback(() => {
      if (newConv) {
        setMessages([]);
        createNewConversation();
        navigation.setParams({ newConversation: false });
      }
    }, [newConv])
  );

  useEffect(() => {
    if (drawerStatus === 'open') {
      loadConversations();
    }
  }, [drawerStatus]);

  const loadConversations = async () => {
    try {
      const data = await AsyncStorage.getItem('conversations');
      if (data) {
        let list = JSON.parse(data);
        // Son eklenen konuşma en başa gelsin
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
      contentContainerStyle={{
        // İçeriği aşağıdan başlatmak için:
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20, // Biraz boşluk ekleyebiliriz
      }}
    >
      <View>
        {/* Ana Sayfa */}
        <DrawerItem
          label="Ana Sayfa"
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Home')}
          icon={({ size }) => (
            <Ionicons name="home" size={size} color={theme.colors.primary} />
          )}
        />

        <View style={styles.divider} />

        {/* Yeni Sohbet */}
        <DrawerItem
          label="Yeni Sohbet"
          labelStyle={{ color: theme.colors.text }}
          // onPress={() => {
          //   navigation.navigate('ChatPage', { newConversation: true });
          // }}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'ChatPage', params: { newConversation: true } }],
            });
          }}
          icon={({ size }) => (
            <Ionicons name="add-circle" size={size} color={theme.colors.primary} />
          )}
        />

        {/* Sohbet Geçmişi Başlığı */}
        <Text style={[styles.menuTitle, { color: theme.colors.text, marginTop: 16 }]}>
          Sohbet Geçmişi
        </Text>

        {conversations.length > 0 ? (
          conversations.map((conv) => {
            // snippet => ilk user mesajından 15 karakter
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
                  navigation.navigate('ChatPage', {
                    conversationId: conv.id,
                    readOnly: true,
                  });
                }}
                icon={({ size }) => (
                  <Ionicons name="time" size={size} color={theme.colors.primary} />
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

      {/* Alt kısımda diğer menüler (Ayarlar vb.) koyabilirsiniz */}
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
