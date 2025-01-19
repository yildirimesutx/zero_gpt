import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PastTopics = () => {
  return (
    <View style={styles.container}>
      <Text>Past Topics</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PastTopics;
