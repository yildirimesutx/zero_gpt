import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const InfoSection = () => {
  const data = [
    { value: '50+', label: 'Proje Tamamlandı', color: '#E3F2FD' }, // Pastel Mavi
    { value: '20K+', label: 'Hayata Dokunuldu', color: '#E8F5E9' }, // Pastel Yeşil
    { value: '30+', label: 'Ortak Kuruluşlar', color: '#FFFDE7' }, // Pastel Sarı
    { value: '100+', label: 'Gönüllüler', color: '#FCE4EC' }, // Pastel Pembe
  ];

  const { width } = Dimensions.get('window'); // Ekran genişliği

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: item.color, width: width * 0.4 }]}>
          <Text style={styles.valueText}>{item.value}</Text>
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default InfoSection;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
