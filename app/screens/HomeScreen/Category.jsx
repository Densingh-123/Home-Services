import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/comfig/FireBaseConfig';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768; // Define breakpoint for large screens

const Category = () => {
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const q = query(collection(db, 'Category')); 
      const querySnapshot = await getDocs(q);
      const categoryList = [];
      querySnapshot.forEach((doc) => {
        categoryList.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCategoryPress = (item) => {
    router.push('/BusinessList/' + item.name);
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
    <View style={isLargeScreen ? styles.largeContainer : styles.container}>
      <Image 
        source={{ uri: 'https://your-banner-image-url.com/banner.jpg' }} 
        style={styles.bannerImage} 
      />

      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        {!isLargeScreen && <Text style={styles.viewAll}>View All</Text>}  
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal={!isLargeScreen} 
        numColumns={isLargeScreen ? 5 : undefined} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <View style={[styles.categoryItem, isLargeScreen && styles.largeCategoryItem]}>
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
    paddingHorizontal: 15, 
  },
  largeContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 100, 
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
  
    resizeMode: 'cover',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#5D3FD3',
  },
  viewAll: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5D3FD3',
  },
  flatListContent: {
    zIndex:-1,
    paddingVertical: 10,
    ...(isLargeScreen && { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }),
  },
  categoryItem: {
    width: 100, 
    marginHorizontal: 10,
    alignItems: 'center',
  },
  largeCategoryItem: {
    width: 120,
    marginHorizontal: 20,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#D4CBF5FF',
    padding: 10,
    borderRadius: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
