// src/screens/GptPage.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PastTopics from './PastTopics';
import ChatPage from './ChatPage';
import News from './News';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../theme/ThemeProvider';
// i18n import
import i18n from '../i18n/i18n';

const Tab = createBottomTabNavigator();

const GptPage = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
          height: 100,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'PastTopics') {
            iconName = 'time';
          } else if (route.name === 'ZeroGPT') {
            iconName = 'chatbubble';
          } else if (route.name === 'News') {
            iconName = 'newspaper';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen
        name="PastTopics"
        component={PastTopics}
        options={{
          // i18n'den gelen çeviri
          tabBarLabel: i18n.t('pastTopics'), 
          headerTitleAlign: 'center',
        }}
      />

      <Tab.Screen
        name="ZeroGPT"
        component={ChatPage}
        options={{
          // Burada sabit "ZeroGpt"
          tabBarLabel: 'ZeroGpt',
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}
      />

      <Tab.Screen
        name="News"
        component={News}
        options={{
          // i18n'den gelen çeviri
          tabBarLabel: i18n.t('news'), 
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

export default GptPage;
