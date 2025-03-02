// src/screens/PartnerSection.js
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  Text,
} from 'react-native';
import i18n from '../i18n/i18n';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const partners = [

  {
    id: 1,
    name: i18n.t("partners.unEnvironmentName"),
    description: i18n.t("partners.unEnvironmentDescription"),
    image: require("../../assets/common/Partner3.png"),
    url: "https://www.unep.org",
  },
 
  {
    id: 2,
    name: i18n.t("partners.unHabitatName"),
    description: i18n.t("partners.unHabitatDescription"),
    image: require("../../assets/common/Partner2.png"),
    url: "https://unhabitat.org",
  },
  
  {
    id: 3,
    name: i18n.t("partners.unName"),
    description: i18n.t("partners.unDescription"),
    image: require("../../assets/common/Partner1.png"),
    url: "https://www.un.org",
  },
  {
    id: 4,
    name: i18n.t("partners.turkishCouncilName"),
    description: i18n.t("partners.turkishCouncilDescription"),
    image: require("../../assets/common/Partner4.png"),
    url: "https://www.turkicstates.org/tr",
  },
];

const PartnerSection = () => {
  const theme = useTheme();
  const isDark = theme.colors.background === '#000000';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1C1C' : '#fff',
          borderColor: isDark ? '#333' : '#f4f5f7',
        },
      ]}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={[styles.name, { color: isDark ? '#fff' : '#061c3d' }]}>
        {item.name}
      </Text>
      <Text style={[styles.description, { color: isDark ? '#fff' : '#6a778b' }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={partners}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

export default PartnerSection;

const styles = StyleSheet.create({
  flatListContent: {
    padding: 8,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    height: 200, // Sabit yükseklik
    margin: 8,
    borderRadius: 15,
    borderWidth: 1,
    padding: 16, // İç padding artırıldı
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 80, // Sabit boyutlu, tam yuvarlak olması için
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  name: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
  },
});
