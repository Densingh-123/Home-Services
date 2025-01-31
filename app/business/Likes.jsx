import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { db } from '../../comfig/FireBaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const CommentsAndLikesPage = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  // Function to format time to "hh:mm AM/PM"
  const formatTime = (isoString) => {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    minutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
    return `${hours}:${minutes} ${ampm}`;
  };

  // Fetch liked products
  const fetchLikedProducts = async () => {
    setLoading(true);
    try {
      const likesCollection = collection(db, 'Likes'); // Collection where liked products are stored
      const likesSnapshot = await getDocs(likesCollection);
      
      const likedData = likesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch product details from BusinessList based on businessId
      const products = await Promise.all(
        likedData.map(async (like) => {
          const businessRef = doc(db, 'BusinessList', like.businessId);
          const businessSnap = await getDoc(businessRef);

          if (businessSnap.exists()) {
            const businessData = businessSnap.data();

            // Calculate average rating
            const ratingsArray = businessData.ratings || [];
            const totalRatings = ratingsArray.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = ratingsArray.length > 0 ? (totalRatings / ratingsArray.length).toFixed(1) : 'No ratings';

            return {
              id: like.id,
              productName: businessData.name || 'Unnamed Product',
              productImage: businessData.image || '',
              rating: averageRating,
              likes: businessData.likes?.length || 0, // Count the number of likes
              likedAt: formatTime(like.likedAt), // Format the liked timestamp
            };
          }
          return null;
        })
      );

      // Remove null values
      setLikedProducts(products.filter(p => p !== null));
    } catch (error) {
      console.error('Error fetching liked products:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load liked products',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Liked Products</Text>
      {likedProducts.length === 0 ? (
        <View style={styles.noLikesContainer}>
          <Ionicons name="heart-dislike" size={50} color="#FF6B6B" />
          <Text style={styles.noLikesText}>No liked products yet.</Text>
        </View>
      ) : (
        <FlatList
          data={likedProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* Product Image */}
              <Image source={{ uri: item.productImage }} style={styles.productImage} />

              {/* Product Details */}
              <View style={styles.detailsContainer}>
                {/* Product Name */}
                <View style={styles.row}>
                  <Ionicons name="storefront" size={20} color="#6C63FF" />
                  <Text style={styles.productName}>{item.productName}</Text>
                </View>

                {/* Rating */}
                <View style={styles.row}>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>

                {/* Number of Likes */}
                <View style={styles.row}>
                  <Ionicons name="heart" size={20} color="#FF6B6B" />
                  <Text style={styles.likesCount}>{item.likes} Likes</Text>
                </View>

                {/* Liked At Time (Bottom Right) */}
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={18} color="#555" />
                  <Text style={styles.likedTime}>{item.likedAt}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6C63FF',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  noLikesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noLikesText: {
    fontSize: 18,
    color: '#777',
    marginTop: 10,
  },
  productCard: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 10,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  rating: {
    fontSize: 16,
    color: '#777',
    marginLeft: 5,
  },
  likesCount: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedTime: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
});

export default CommentsAndLikesPage;
