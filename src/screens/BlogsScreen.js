// src/screens/NewsScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import useNews from '../hooks/useNews';
import { MEDIA_URL } from '../hooks/baseURL';
import useBlogs from '../hooks/useBlogs';
import { useNavigation } from '@react-navigation/native';

const BlogsScreen = () => {
  const { blogs, loading, error } = useBlogs();
  const { width } = Dimensions.get('window');
    const navigation = useNavigation();

  const renderItem = ({ item }) => {
    // Eğer veri formatınızda gallery varsa; değilse item.image kullanılabilir.
    const imageUri = item.gallery && item.gallery.length > 0 
      ? MEDIA_URL + item.gallery[0] 
      : MEDIA_URL + item.image;

    // Tarihi formatlayalım.
    const publishedDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('BlogsDetailScreen', { slug: item.slug })}
        activeOpacity={0.8}
        >
      <View style={styles.card}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{publishedDate}</Text>
          {item.category && (
            <Text style={styles.category}>{item.category.name}</Text>
          )}
        </View>
      </View>
      </TouchableOpacity>
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
      <Text style={styles.heading}>Blog Yazılarımız</Text>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default BlogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d00',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,

  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
