// src/screens/NewsDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { MEDIA_URL } from '../hooks/baseURL';
import useProjectDetail from '../hooks/useProjectDetail';

const ProjectDetailScreen = () => {
  const route = useRoute();
  const { slug } = route.params;
  const { projectDetail, loading, error } = useProjectDetail(slug);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{projectDetail.title}</Text>
  
      {projectDetail.image ? (
        <Image
          source={{ uri: MEDIA_URL + projectDetail.image }}
          style={styles.detailImage}
        />
      ) : projectDetail.gallery && projectDetail.gallery.length > 0 ? (
        <Image
          source={{ uri: MEDIA_URL + projectDetail.gallery[0] }}
          style={styles.detailImage}
        />
      ) : null}
      <RenderHTML
        contentWidth={width - 30}
        source={{ html: projectDetail.description }}
      />
    </ScrollView>
  );
};

export default ProjectDetailScreen;

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
