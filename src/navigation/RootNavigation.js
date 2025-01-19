import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import UserNavigation from './UserNavigation';

const RootNavigation = () => {
  const isAuth = true; // Geçici olarak hep true, ileride login logic buraya eklenecek

  return (
    <NavigationContainer>
      {!isAuth ? <AuthStack /> : <UserNavigation />}
    </NavigationContainer>
  );
};

export default RootNavigation;
