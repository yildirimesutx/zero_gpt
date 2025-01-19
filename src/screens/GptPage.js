// src/screens/GptPage.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PastTopics from './PastTopics';
import ChatPage from './ChatPage';
import News from './News';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator();

const GptPage = () => {
  // 1) Tema verisini çekiyoruz
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Aktif/Pasif ikon renkleri
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground, // Temaya göre değişir
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
      })}
    >
      <Tab.Screen name="PastTopics" component={PastTopics} />
      <Tab.Screen
        name="ZeroGPT"
        component={ChatPage}
        options={{
          tabBarLabel: 'ZeroGpt',
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="News" component={News} />
    </Tab.Navigator>
  );
};

export default GptPage;
