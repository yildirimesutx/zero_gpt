// src/screens/ModernProjects.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import useProjects from '../hooks/useProjects';
import { MEDIA_URL } from '../hooks/baseURL';

const ModernProjects = () => {
  const { projects, loading, error } = useProjects();
  const { width } = Dimensions.get('window');

  console.log("projects", projects)

  const renderItem = ({ item }) => {
    // Oluşturulma tarihini locale formatında gösterelim.
    const publishedDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={[styles.card, { width: width * 0.7 }]}>
        {/* Üst %60: Gallery'nin ilk resmi */}
        <Image 
          source={{ uri: MEDIA_URL + item.gallery[0] }}
          style={styles.image}
        />
        {/* Alt %40: Proje bilgileri */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category.name}</Text>
          {item.isActive && <Text style={styles.active}>Devam Ediyor</Text>}
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color="#004d00" />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projelerimiz</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="start"
        snapToInterval={width * 0.7 + 20}
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
    backgroundColor: '#fffde7', // Örnek arka plan, ihtiyaca göre ayarlanabilir
    borderRadius: 15,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#004d00',
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 300,
  },
  image: {
    width: '100%',
    height: '60%', // Kartın üst %60'ı resim için
  },
  contentContainer: {
    padding: 10,
    height: '40%', // Kartın alt %40'ı içerik için
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  active: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004d00',
    marginTop: 5,
    textAlign: 'center',
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
