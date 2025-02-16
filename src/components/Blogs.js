// src/screens/BlogPosts.js
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
import useBlogs from '../hooks/useBlogs';
import { MEDIA_URL } from '../hooks/baseURL';
import { useNavigation } from '@react-navigation/native';

const BlogPosts = () => {
  const { blogs, loading, error } = useBlogs();
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    // Tarihi formatlamak için örneğin toLocaleDateString kullanabilirsiniz.
    const publishedDate = new Date(item.createdAt).toLocaleDateString();

    return (
       <TouchableOpacity 
            onPress={() => navigation.navigate('BlogsDetailScreen', { slug: item.slug })}
            activeOpacity={0.8}
          >
      <View style={[styles.card, { width: width * 0.8 }]}>
        {/* Üst Yarı: Blog resmi */}
        <Image source={{ uri: MEDIA_URL + item.image }} style={styles.blogImage} />
        {/* Alt Yarı: İçerik */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{publishedDate}</Text>
          <Text style={styles.category}>{item.category.name}</Text>
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

      <View style={styles.header}>
        <Text style={styles.heading}>Blog Yazılarımız</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BlogsScreen')}>
          <Text style={styles.link}>Tüm Yazılar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={blogs}
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

export default BlogPosts;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#e3f2fd', // Örnek arka plan; ihtiyacınıza göre düzenleyebilirsiniz.
    borderRadius: 15,
    marginHorizontal: 10,
  },
  // heading: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   color: '#0d47a1', // Koyu mavi başlık rengi
  //   marginBottom: 20,
  // },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  link: {
    fontSize: 14,
    color: '#004d00',
    textDecorationLine: 'underline',
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
    height: 300,
  },
  blogImage: {
    width: '100%',
    height: '65%', // Kartın üst yarısı resim için
  },
  contentContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '35%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
