import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GptPage from '../screens/GptPage';
import NewsScreen from '../screens/NewsScreen';
import BlogsScreen from '../screens/BlogsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import NewDetail from '../screens/NewsDetailScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import BlogsDetailScreen from '../screens/BlogsDetailScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ContactForm from '../screens/ContactForm';

const Stack = createStackNavigator();

const UserNavigation = () => {
  return (
    <Stack.Navigator>
      
      <Stack.Screen
        name="GptPage"
        component={GptPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BlogsScreen"
        component={BlogsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProjectsScreen"
        component={ProjectsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NewsDetailScreen"
        component={NewsDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BlogsDetailScreen"
        component={BlogsDetailScreen}
        options={{ headerShown: false }}
      /> 

      <Stack.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
        options={{ headerShown: false }}
      /> 

      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{ headerShown: false }}
      /> 

      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      /> 

      <Stack.Screen
        name="ContactForm"
        component={ContactForm}
        options={{ headerShown: false }}
      /> 




         



    </Stack.Navigator>
  );
};

export default UserNavigation;
