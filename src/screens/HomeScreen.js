import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';




const HomeScreen = ({ navigation }) => {


    const { t } = useTranslation();





  return (
    <View style={styles.container}>
       <Text>{t('home.welcome')}</Text>
       <Text>{t('home.info')}</Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('GptPage')}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
