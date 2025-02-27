// src/screens/SponsorSection.js
import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

// Örnek sponsor resimleri
import Sponsor1 from '../../assets/common/Sponsor1.png';
import Sponsor2 from '../../assets/common/Sponsor2.png';
import Sponsor3 from '../../assets/common/Sponsor3.png';
import Sponsor4 from '../../assets/common/Sponsor4.png';

const sponsors = [
  { id: 1, color: '#67b437', img: Sponsor1, url: 'https://example1.com' },
  { id: 2, color: '#ffffff', img: Sponsor2, url: 'https://example2.com' },
  { id: 3, color: '#009fe3', img: Sponsor3, url: 'https://example3.com' },
  { id: 4, color: '#f5f5f5', img: Sponsor4, url: 'https://example4.com' },
];

const SponsorSection = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.color || '#fff' },
        item.id === 2 && styles.biggerCard,
        item.id === 4 && styles.extraBiggerCard,
      ]}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.8}
    >
      <Image
        source={item.img}
        style={[
          styles.image,
          item.id === 2 && styles.biggerImage,
          item.id === 4 && styles.extraBiggerImage,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={sponsors}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.flatListContent}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

export default SponsorSection;

const styles = StyleSheet.create({
  flatListContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12, // Ekstra boşluk
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 60,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  biggerCard: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  extraBiggerCard: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  image: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  biggerImage: {
    width: '80%',
    height: '80%',
  },
  extraBiggerImage: {
    width: '90%',
    height: '90%',
  },
});
