import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const projectsData = [
  {
    id: 1,
    title: 'Sıfır Atık Eğitimi',
    status: 'Devam Ediyor',
    imageUrl: 'https://picsum.photos/seed/egitim/300/200',
  },
  {
    id: 2,
    title: 'Geri Dönüşüm Sağlık Projesi',
    status: 'Tamamlandı',
    imageUrl: 'https://picsum.photos/seed/saglik/300/200',
  },
  {
    id: 3,
    title: 'Teknoloji ve Sıfır Atık',
    status: 'Devam Ediyor',
    imageUrl: 'https://picsum.photos/seed/teknoloji/300/200',
  },
  {
    id: 4,
    title: 'Topluluk Kompost Projesi',
    status: 'Devam Ediyor',
    imageUrl: 'https://picsum.photos/seed/kompost/300/200',
  },
];

const ModernProjects = () => {
  const { width } = Dimensions.get('window'); // Ekran genişliği

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: width * 0.7 }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={[styles.status, item.status === 'Tamamlandı' ? styles.completed : styles.ongoing]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projelerimiz</Text>
      <FlatList
        data={projectsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="start"
        snapToInterval={Dimensions.get('window').width * 0.7 + 20}
        decelerationRate="fast"
      />
    </View>
  );
};

export default ModernProjects;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#fffde7', // Hafif sarı arka plan
    borderRadius: 15,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f57f17', // Koyu sarı başlık
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
    textAlign: 'center',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  completed: {
    color: '#1b5e20', // Tamamlandı durumunda yeşil renk
    fontWeight: 'bold',
  },
  ongoing: {
    color: '#f57f17', // Devam ediyor durumunda sarı renk
    fontWeight: 'bold',
  },
});
