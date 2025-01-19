import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GptPage from '../screens/GptPage';

const Stack = createStackNavigator();

const UserNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GptPage"
        component={GptPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigation;
