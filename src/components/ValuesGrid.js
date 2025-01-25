import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';

const data = [
  { title: 'Duyarlılık', description: 'Çevreye ve doğal kaynaklara karşı empati ve duyarlılıkla yaklaşıyoruz.', color: '#E3F2FD' }, // Pastel Mavi
  { title: 'Dürüstlük', description: 'En yüksek dürüstlük ve şeffaflık standartlarını koruyoruz.', color: '#E8F5E9' }, // Pastel Yeşil
  { title: 'İşbirliği', description: 'Sivil toplum kuruluşları ve bireylerle işbirliği içinde çalışıyoruz.', color: '#FFFDE7' }, // Pastel Sarı
  { title: 'Sürdürülebilirlik', description: 'Uzun vadeli bir gelecek inşa etmek için sürdürülebilir çözümler üretiyoruz.', color: '#FCE4EC' }, // Pastel Pembe
];

const ValuesGrid = () => {
  const numColumns = 2; // İki sütunlu grid

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={numColumns} // Grid yapısı için sütun sayısı
      contentContainerStyle={styles.container}
    />
  );
};

export default ValuesGrid;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
