import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AIAssistantSection = ({ navigation }) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width: width * 0.9 }]}>
      {/* <Ionicons name="chatbubble-ellipses" size={40} color="#fff" style={styles.icon} /> */}
      <Image source={require('../../assets/robot-assistant.png')} style={styles.image}/>

      
      <Text style={styles.heading}>Yapay Zeka ile Görüş</Text>
      <Text style={styles.description}>
        Merak ettiğiniz soruları sorun veya yapay zeka ile iletişime geçin. Anında yardım alın!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GptPage')}
      >
        <Text style={styles.buttonText}>Konuşmaya Başla</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AIAssistantSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f5e9', // Hafif mavi pastel ton
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20, // Üst ve alt boşluk
    alignSelf: 'center', // Ortalamak için
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 15,
    backgroundColor: '#004d00', // Yeşil daire
    borderRadius: 50,
    padding: 10,
  },
  image : {
    width:60,
    height:60,
    marginBottom:5

  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#004d00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
