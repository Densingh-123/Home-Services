import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../comfig/FireBaseConfig';

const Slider = () => {
  const [sliderImages, setSliderImages] = useState([]); // State to store image URLs

  useEffect(() => {
    getSliderList();
  }, []);

  const getSliderList = async () => {
    try {
      const q = query(collection(db, 'Slider')); // Fetch data from Firestore
      const querySnapshot = await getDocs(q);
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() }); // Add each image to the array
      });
      setSliderImages(images); // Update state with fetched images
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={{
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: -10,
    marginLeft: 20,
    fontStyle: 'italic', 
    color: '#5D3FD3', 
    marginTop:20,
    paddingBottom:20
  }}># Special for You</Text>
      <FlatList
        data={sliderImages}
        horizontal // Display items horizontally
        showsHorizontalScrollIndicator={false} // Hide scroll bar
        keyExtractor={(item) => item.id} // Unique key for each item
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  slide: {
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
    height: 200, // Fixed height for the slider
    marginHorizontal: 10, // Space between slides
    borderRadius: 15, // Rounded corners
    overflow: 'hidden', // Ensure the image respects the border radius
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image covers the entire slide
  },
});