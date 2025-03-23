import React, { useState, useCallback, useEffect } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { useTheme } from '../theme/ThemeProvider';
import ChatPage from './ChatPage';
import HomeScreen from './HomeScreen';
import { useDrawerStatus } from '@react-navigation/drawer';
import i18n from '../i18n/i18n';

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

const CustomDrawerContent = (props) => {
  const theme = useTheme();
  const { navigation } = props;
  const [conversations, setConversations] = useState([]);
  const drawerStatus = useDrawerStatus();
  const route = useRoute();
  const newConv = route.params ? route.params.newConversation : false;

  useFocusEffect(
    useCallback(() => {
      if (newConv) {
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
        list.reverse();
        setConversations(list);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.log('AsyncStorage okuma hatası:', error);
    }
  };

  const handleDeleteConversation = (conversationId) => {
    Alert.alert(
      i18n.t('delete_conversation.title'),
      i18n.t('delete_conversation.message'),
      [
        { text: i18n.t('delete_conversation.cancel'), style: 'cancel' },
        { text: i18n.t('delete_conversation.confirm'), onPress: () => deleteConversation(conversationId) },
      ]
    );
  };

  const deleteConversation = async (conversationId) => {
    try {
      const updatedConversations = conversations.filter(
        (conv) => conv.id !== conversationId
      );
      setConversations(updatedConversations);
      await AsyncStorage.setItem('conversations', JSON.stringify(updatedConversations));
    } catch (error) {
      console.log('Sohbet silinirken hata oluştu:', error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 20,
      }}
    >
      <View>
        {/* Sabit Üst Menü */}
        <DrawerItem
          label= {i18n.t('home_page.home_page')}
          labelStyle={{ color: theme.colors.text }}
          onPress={() => navigation.navigate('Home')}
          icon={({ size }) => (
            <Ionicons name="home" size={size} color={theme.colors.primary} />
          )}
        />

        <View style={styles.divider} />

        <DrawerItem
          label={i18n.t('new_chat')}
          labelStyle={{ color: theme.colors.text }}
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

        <Text style={[styles.menuTitle, { color: theme.colors.text, marginTop: 16 }]}>
        {i18n.t('chat_history')}
        </Text>

        {/* Sohbet Geçmişi Listesi */}
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const firstUserMsg = conv.messages?.find(m => m.sender === 'user');
            let snippet = 'Yeni Konuşma';
            if (firstUserMsg && firstUserMsg.text) {
              snippet = firstUserMsg.text.substring(0, 15);
              if (firstUserMsg.text.length > 15) snippet += '...';
            }

            return (
              <View key={conv.id} style={styles.conversationRow}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChatPage', {
                    conversationId: conv.id,
                    readOnly: true,
                  });
                }}
                style={styles.conversationContent}
              >
                <Ionicons
                  name="time"
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontSize: 14 }}>
                    {`${snippet} - ${conv.time}`}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteConversation(conv.id)}
                style={styles.deleteIcon}
              >
                <Ionicons name="trash" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            );
          })
        ) : (
          <Text style={{ marginLeft: 16, color: theme.colors.text }}>
            Kayıtlı sohbet yok
          </Text>
        )}
      </View>
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
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  conversationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    padding: 8,
  },
});
