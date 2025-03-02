// src/screens/InfoSection.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const InfoSection = () => {
  const theme = useTheme();
  // Dark mod kontrolü: DarkTheme'de background genellikle "#000000" veya çok koyu ton olur.
  const isDark = theme.colors.background === '#000000';

  const data = [
    { value: '50+', label: 'Proje Tamamlandı', color: '#E3F2FD' }, // Pastel Mavi
    { value: '20K+', label: 'Hayata Dokunuldu', color: '#E8F5E9' }, // Pastel Yeşil
    { value: '30+', label: 'Ortak Kuruluşlar', color: '#FFFDE7' }, // Pastel Sarı
    { value: '100+', label: 'Gönüllüler', color: '#FCE4EC' }, // Pastel Pembe
  ];

  // Dark mod için alternatif renkler (istediğiniz şekilde özelleştirebilirsiniz)
  const darkColors = ['#5166DB', '#9AB9DB', '#51BDDB', '#6951DB'];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f9f9f9' }]}>
      <View style={styles.gridContainer}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? darkColors[index] : (item.color || '#fff'),
                width: width * 0.4,
              },
            ]}
          >
            <Text style={[styles.valueText, { color: isDark ? '#fff' : '#333' }]}>
              {item.value}
            </Text>
            <Text style={[styles.labelText, { color: isDark ? '#fff' : '#666' }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default InfoSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 20,
    borderRadius: 15,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
