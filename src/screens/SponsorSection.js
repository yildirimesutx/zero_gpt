// src/screens/SponsorSection.js
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Sponsor1 from '../../assets/common/Sponsor1.png';
import Sponsor2 from '../../assets/common/Sponsor2.png';
import Sponsor3 from '../../assets/common/Sponsor3.png';
import Sponsor4 from '../../assets/common/Sponsor4.png';

const sponsors = [
  { id: 1, color: '#67b437', img: Sponsor1, url: 'https://example1.com' },
  { id: 2, color: '#ffffff', img: Sponsor2, url: 'https://example2.com' }, // Bu resim %80
  { id: 3, color: '#009fe3', img: Sponsor3, url: 'https://example3.com' },
  { id: 4, color: '#f5f5f5', img: Sponsor4, url: 'https://example4.com' }, // Bu resim %90
];

const SponsorSection = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.color || '#fff' },
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
      // Satır içindeki iki kartın yatayda eşit boşlukla yerleştirilmesi:
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

export default SponsorSection;

const styles = StyleSheet.create({
  flatListContent: {
    padding: 8,
  },
  // Her satırdaki kartları yatayda eşit boşlukla dağıtmak:
  columnWrapper: {
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 8,
    // Kart merkezde:
    justifyContent: 'center',
    alignItems: 'center',
    // Hafif gölge
    borderWidth: 1,
    borderColor: '#f4f5f7',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 999,
  },
  // id=2 olan resim için ekstra büyütme
  biggerImage: {
    width: '80%',
    height: '80%',
  },
  // id=4 olan resim için daha da büyük
  extraBiggerImage: {
    width: '90%',
    height: '90%',
  },
});
