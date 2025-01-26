import { StyleSheet, Text, View, ScrollView } from 'react-native'; // Import ScrollView
import React from 'react';
import Header from './Header';
import Slider from './Slider';
import Category from './Category';
import PopularBusiness from './PopularBusiness';

const Home = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      {/* Category */}
      <Category />

      {/* Popular Businesses */}
      <PopularBusiness />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Optional: Add a background color
  },
});