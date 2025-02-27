// src/screens/PartnerSection.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import i18n from '../i18n/i18n';

const { width } = Dimensions.get('window');

const partners = [
  {
    id: 1,
    name: i18n.t("partners.unName"),
    description: i18n.t("partners.unDescription"),
    image: require("../../assets/common/Partner1.png"),
    url: "https://www.un.org",
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
    name: i18n.t("partners.unEnvironmentName"),
    description: i18n.t("partners.unEnvironmentDescription"),
    image: require("../../assets/common/Partner3.png"),
    url: "https://www.unep.org",
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{i18n.t('partners.title')}</Text>
      <FlatList
        data={partners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default PartnerSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24, // Başlık için
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#061c3d',
    marginBottom: 20,
  },
  flatListContent: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f4f5f7',
    padding: 16,
    margin: 8,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  name: {
    textAlign: 'center',
    color: '#061c3d',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    textAlign: 'center',
    color: '#6a778b',
    fontSize: 14,
  },
});
