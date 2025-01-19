import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PastTopics from './PastTopics';
import ChatPage from './ChatPage';
import News from './News';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const GptPage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = size;

          // İkon ismini belirleme
          if (route.name === 'PastTopics') {
            iconName = 'time';
          } else if (route.name === 'ChatPage') {
            iconName = 'chatbubble';
            // iconSize = focused ? size * 1.5 : size * 1.4; // Ortadaki ikonu büyütme
          } else if (route.name === 'News') {
            iconName = 'newspaper';
          }

          // İkon döndürme
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: '#65A30D', // Aktif ikon rengi
        tabBarInactiveTintColor: '#3F6212', // Pasif ikon rengi
        tabBarStyle: {
          backgroundColor: '#F8F9FA', // Tab bar arka plan rengi
          height: 100, // Tab bar yüksekliği
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="PastTopics" component={PastTopics} />
      <Tab.Screen
        name="ChatPage"
        component={ChatPage}
        options={{
          tabBarLabel: 'ZeroGpt',
        }}
      />
      <Tab.Screen name="News" component={News} />
    </Tab.Navigator>
  );
};

export default GptPage;
