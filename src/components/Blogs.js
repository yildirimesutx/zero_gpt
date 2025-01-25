import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const posts = [
  {
    id: 1,
    title: 'Sıfır Atık ile Sağlıklı Gelecek',
    category: { name: 'Makale', color: '#C3DAFE' }, // bg-indigo-100
    description:
      'Sıfır Atık Vakfı’nın, çevre dostu projelerle sağlıklı bir gelecek inşa etme çalışmalarını keşfedin.',
    date: '1 Temmuz 2024',
    author: {
      name: 'Dr. Ayşe Yılmaz',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readingTime: '5 dakika',
  },
  {
    id: 2,
    title: 'Eğitim ile Değişim: Sıfır Atık Anlayışı',
    category: { name: 'Video', color: '#FBCFE8' }, // bg-pink-100
    description:
      'Eğitim programlarımızla çevre bilincini artırmak için neler yaptığımızı anlatan videomuzu izleyin.',
    date: '20 Haziran 2024',
    author: {
      name: 'Ali Kaya',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readingTime: '3 dakika',
  },
  {
    id: 3,
    title: 'Çevre Temizlik Projeleri: Daha Yeşil Bir Dünya',
    category: { name: 'Vaka Çalışması', color: '#DCFCE7' }, // bg-green-100
    description:
      'Başarılı çevre temizliği projelerimizi ve gelecek etkinliklerimize nasıl katılabileceğinizi öğrenin.',
    date: '15 Mayıs 2024',
    author: {
      name: 'Zeynep Doğan',
      imageUrl:
        'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readingTime: '8 dakika',
  },
];

const BlogPosts = () => {
  const { width } = Dimensions.get('window');

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: width * 0.6 }]}>
      {/* Kategori */}
      <View style={[styles.category, { backgroundColor: item.category.color }]}>
        <Text style={styles.categoryText}>{item.category.name}</Text>
      </View>

      {/* Başlık ve Açıklama */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Yazar ve Tarih */}
      <View style={styles.footer}>
        <Image source={{ uri: item.author.imageUrl }} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author.name}</Text>
          <Text style={styles.date}>{item.date} • {item.readingTime}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Blog Yazılarımız</Text>
      <FlatList
        data={posts}
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

export default BlogPosts;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: '#e3f2fd', // Hafif mavi arka plan
    borderRadius: 15,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0d47a1', // Koyu mavi başlık
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
    alignItems: 'flex-start',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  category: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d00',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorInfo: {
    flexDirection: 'column',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});
