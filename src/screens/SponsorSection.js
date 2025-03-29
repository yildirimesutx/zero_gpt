import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Sponsor1 from '../../assets/common/Sponsor1.png';
import Sponsor2 from '../../assets/common/Sponsor2.png';
import Sponsor3 from '../../assets/common/Sponsor3.png';
import Sponsor4 from '../../assets/common/Sponsor4.png';

const sponsors = [
  { id: 1, color: '#67b437', img: Sponsor1, url: 'https://unhabitat.org/' },
  { id: 2, color: '#ffffff', img: Sponsor2, url: 'https://sifiratikvakfi.org/' },
  { id: 3, color: '#009fe3', img: Sponsor3, url: 'https://www.unep.org/' },
  { id: 4, color: '#f5f5f5', img: Sponsor4, url: 'https://www.turktelekom.com.tr/' },
];

const SponsorSection = () => {
  const { colors } = useTheme();
  // Eğer ThemeProvider dark mod bilgisini açıkça sağlamıyorsa, colors.background ile karşılaştırabilirsiniz:
  const isDark = colors.background === '#000000';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: item.color || '#fff',
          borderColor: isDark ? 'transparent' : '#f4f5f7',
        },
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
  columnWrapper: {
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor ayarı inline uygulanıyor
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
  biggerImage: {
    width: '80%',
    height: '80%',
  },
  extraBiggerImage: {
    width: '90%',
    height: '90%',
  },
});
