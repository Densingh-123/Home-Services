import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/comfig/FireBaseConfig';
import { useRouter } from 'expo-router';

const Category = () => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // State to manage loading status
  const router = useRouter();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const q = query(collection(db, 'Category')); // Fetch data from Firestore
      const querySnapshot = await getDocs(q);
      const categoryList = [];
      querySnapshot.forEach((doc) => {
        const categoryData = { id: doc.id, ...doc.data() }; // Add each category to the array
        categoryList.push(categoryData);
        console.log('Fetched Category Data:', categoryData); // Log each category
      });
      console.log('All Categories:', categoryList); // Log the entire category list
      setCategories(categoryList); // Update state with fetched categories
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if there's an error
    }
  };

  const handleCategoryPress = (item) => {
    router.push('/BusinessList/'+item.name); // Navigate to the BusinessList screen with the category name
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <FlatList
        data={categories}
        horizontal // Display items horizontally
        showsHorizontalScrollIndicator={false} // Hide scroll bar
        keyExtractor={(item) => item.id} // Unique key for each item
        contentContainerStyle={styles.flatListContent} // Add padding to the FlatList
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <View style={styles.categoryItem}>
              <View style={styles.imageContainer}>
                {item.icon ? (
                  <Image source={{ uri: item.icon }} style={styles.categoryImage} />
                ) : (
                  <Text style={styles.placeholderText}>No Icon</Text>
                )}
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
    color: '#5D3FD3',
  },
  viewAll: {
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'italic',
    color: '#5D3FD3',
  },
  flatListContent: {
    paddingHorizontal: 10, // Add horizontal padding to the FlatList
  },
  categoryItem: {
    width: 100, // Fixed width for each category
    marginHorizontal: 10, // Space between categories
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#D4CBF5FF',
    padding: 10,
    margin: 4,
    borderRadius: 20, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 50, // Adjust based on your design
    height: 50, // Adjust based on your design
    resizeMode: 'cover', // Ensure the image covers the entire area
  },
  placeholderText: {
    fontSize: 12,
    color: '#5D3FD3',
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5D3FD3',
  },
});