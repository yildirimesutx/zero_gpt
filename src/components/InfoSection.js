import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const InfoSection = () => {
  const data = [
    { value: '50+', label: 'Proje Tamamlandı', color: '#E3F2FD' }, // Pastel Mavi
    { value: '20K+', label: 'Hayata Dokunuldu', color: '#E8F5E9' }, // Pastel Yeşil
    { value: '30+', label: 'Ortak Kuruluşlar', color: '#FFFDE7' }, // Pastel Sarı
    { value: '100+', label: 'Gönüllüler', color: '#FCE4EC' }, // Pastel Pembe
  ];

  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Hedeflerimiz</Text> */}
      <View style={styles.gridContainer}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: item.color, width: width * 0.4 }, // Kart genişliği
            ]}
          >
            <Text style={styles.valueText}>{item.value}</Text>
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InfoSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#f9f9f9', // Hafif gri arka plan
    borderRadius: 15,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0d47a1', // Koyu mavi başlık
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Grid düzeni için sarma
    justifyContent: 'space-between', // Kartlar arasına eşit boşluk
    paddingHorizontal: 10,
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
