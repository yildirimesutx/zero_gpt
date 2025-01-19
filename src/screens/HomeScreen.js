import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';




const HomeScreen = ({ navigation }) => {


    const { t } = useTranslation();
    const theme = useTheme();





  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <Text style={{ color: theme.colors.text }}>
        Ana Sayfa -Web den gelen component
      Anlık tema: {theme.colors.background === '#000000' ? 'Dark' : 'Light'}
    </Text>

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
