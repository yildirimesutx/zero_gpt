// src/screens/ValuesGrid.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import i18n from '../i18n/i18n';

const { width } = Dimensions.get('window');

const data = [
  { title:  i18n.t('valuesGridName.id_1'), description: i18n.t('valuesGridDes.id1Des'), color: '#E3F2FD' }, // Pastel Mavi
  { title: i18n.t('valuesGridName.id_2'), description: i18n.t('valuesGridDes.id2Des'), color: '#E8F5E9' }, // Pastel Yeşil
  { title: i18n.t('valuesGridName.id_3'), description: i18n.t('valuesGridDes.id3Des'), color: '#FFFDE7' }, // Pastel Sarı
  { title: i18n.t('valuesGridName.id_4'), description: i18n.t('valuesGridDes.id4Des'), color: '#FCE4EC' }, // Pastel Pembe
];

const ValuesGrid = () => {
  const theme = useTheme();
  // Light modda, data içinde verilen renkler kullanılacak.
  // Dark mod için ayrı renklendirme yapmak istiyorsanız darkColors dizisini kullanabilirsiniz.
  // Örneğin:
  const isDark = theme.colors.background === '#000000';
  const darkColors = ['#2b6cb0', '#2f855a', '#b7791f', '#9f7aea'];

  const renderItem = ({ item, index }) => {
    const backgroundColor = isDark ? darkColors[index] : item.color;
    const textColor = isDark ? '#fff' : (index === 0 ? '#333' : '#555'); // İstediğiniz şekilde ayarlayabilirsiniz.
    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.description, { color: textColor }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

export default ValuesGrid;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});
