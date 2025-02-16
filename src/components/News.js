// src/screens/News.js
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
import useNews from '../hooks/useNews';
import { MEDIA_URL } from '../hooks/baseURL';

const News = () => {
  const { news, loading, error } = useNews();
  const { width } = Dimensions.get('window');


  console.log("news", news)

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: width * 0.8 }]}>
      {/* Üst kısmın %70'i: Haber resmi */}
      <Image 
        source={{ uri: MEDIA_URL + item.image }}
        style={styles.image}
      />
      {/* Alt kısım: Sadece başlık */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color="#004d00" />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Haberler</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="start"
        snapToInterval={width * 0.8 + 20}
        decelerationRate="fast"
      />
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#f0f0f0', // İhtiyaca göre ayarlanabilir arka plan
    borderRadius: 15,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
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
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    height: 250,
  },
  image: {
    width: '100%',
    height: '70%', // Üst %70 resim için
  },
  contentContainer: {
    padding: 10,
    height: '30%', // Alt %30 içerik için
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
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
