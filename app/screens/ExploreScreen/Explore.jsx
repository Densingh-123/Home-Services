import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Category from '../HomeScreen/Category';
import PopularBusiness from '../HomeScreen/PopularBusiness'; // Import the PopularBusiness component

const Explore = () => {
  return (
    <ScrollView style={styles.scrollView}> {/* Wrap the content in a ScrollView */}
      <View style={styles.container}>
        <Text style={styles.title}>Explore More</Text>
        <View style={styles.searchSection}>
          <FontAwesome name="search" size={24} color="gray" style={styles.searchIcon} />
          <TextInput 
            placeholder='Search' 
            style={styles.searchInput} 
            placeholderTextColor="gray"
          />
        </View>
      </View>
      <Category />
      <PopularBusiness /> {/* Add the PopularBusiness component here */}
    </ScrollView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Optional: Add a background color
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 15
  },
  searchIcon: {
    marginRight: 15,
    marginLeft: 10
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'black',
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 30,
    padding: 20
  },
  container: {
    backgroundColor: '#5D3FD3',
    height: 200,
   
  }
});