import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import UserNavigation from './UserNavigation';
import LoginScreen from '../screens/LoginScreen';

const RootNavigation = () => {
  const isAuth = true; // Geçici olarak hep true, ileride login logic buraya eklenecek

  return (
    <NavigationContainer>
      {!isAuth ? <LoginScreen /> : <UserNavigation />}
    </NavigationContainer>
  );
};

export default RootNavigation;
