// src/screens/NewsDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useBlogDetail from '../hooks/useBlogDetail';
import RenderHTML from 'react-native-render-html';
import { MEDIA_URL } from '../hooks/baseURL';

const NewsDetailScreen = () => {
  const route = useRoute();
  // Detail sayfasına geçişte slug gönderildiğini varsayıyoruz.
  const { slug } = route.params;
  const { blogDetail, loading, error } = useBlogDetail(slug);
  const { width } = Dimensions.get('window');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004d00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
    showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{blogDetail.title}</Text>
      {/* Eğer blogDetail.image varsa, onu gösteriyoruz; yoksa blogDetail.gallery[0] kullanabilirsiniz */}
      {blogDetail.image ? (
        <Image
          source={{ uri: MEDIA_URL + blogDetail.image }}
          style={styles.detailImage}
        />
      ) : blogDetail.gallery && blogDetail.gallery.length > 0 ? (
        <Image
          source={{ uri: MEDIA_URL + blogDetail.gallery[0] }}
          style={styles.detailImage}
        />
      ) : null}
      <RenderHTML
        contentWidth={width - 30}
        source={{ html: blogDetail.content }}
      />
    </ScrollView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailImage: {
    width: '100%',
    height: 200, // Resim yüksekliğini ihtiyacınıza göre ayarlayın.
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
