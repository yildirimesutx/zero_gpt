import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';

export const eventsData = [
  {
    id: 1,
    title: 'Sıfır Atık Eğitim Günü',
    category: 'Eğitim',
    date: '2024-04-20',
    time: '10:00 - 14:00',
    description:
      'Öğrenciler ve aileler için sıfır atık bilinci oluşturmayı amaçlayan atölye ve seminerler.',
    imageUrl: 'https://picsum.photos/seed/sifiratik1/300/200',
    location: 'Yerel Kültür Merkezi, Ankara',
    registrationLink: 'https://example.com/register/sifir-atik-egitim',
  },
  {
    id: 2,
    title: 'Çevre Temizliği Etkinliği',
    category: 'Çevre',
    date: '2024-05-12',
    time: '9:00 - 13:00',
    description:
      'Parklarımızı ve sahillerimizi temizlemek için gönüllüleri bekliyoruz. Tüm yaş grupları katılabilir.',
    imageUrl: 'https://picsum.photos/seed/sifiratik2/300/200',
    location: 'Sahil Parkı, İzmir',
    registrationLink: 'https://example.com/register/cevre-temizligi',
  },
  {
    id: 3,
    title: 'Geri Dönüşüm Atölyesi',
    category: 'Atölye',
    date: '2024-06-18',
    time: '11:00 - 16:00',
    description:
      'Plastik, cam ve kağıt gibi materyallerin geri dönüşüm süreçlerini öğrenmek için harika bir fırsat.',
    imageUrl: 'https://picsum.photos/seed/sifiratik3/300/200',
    location: 'Çevre Bilinci Merkezi, İstanbul',
    registrationLink: 'https://example.com/register/geri-donusum-atolyesi',
  },
];

const Events = () => {
  const { width } = Dimensions.get('window');

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: width * 0.8 }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>
          {item.date} • {item.time}
        </Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(item.registrationLink)}
        >
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Etkinliklerimiz</Text>
      <FlatList
        data={eventsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="start"
        snapToInterval={Dimensions.get('window').width * 0.8 + 20}
        decelerationRate="fast"
      />
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#e8f5e9', // Hafif yeşil arka plan
    borderRadius: 15,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1b5e20', // Koyu yeşil başlık
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#004d00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
