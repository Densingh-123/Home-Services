import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../../comfig/FireBaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const Likes = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  // Fetch liked products
  const fetchLikedProducts = async () => {
    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      const likesCollection = collection(db, 'Likes');
      const likesSnapshot = await getDocs(likesCollection);
      
      const likedData = likesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter liked products by user email
      const userLikedProducts = likedData.filter(like => like.users?.includes(userEmail));

      // Fetch product details from BusinessList based on businessId
      const products = await Promise.all(
        userLikedProducts.map(async (like) => {
          const businessRef = doc(db, 'BusinessList', like.id);
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
              likes: businessData.likes?.length || 0,
              likedAt: like.likedAt || 'Unknown', // Get stored time
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

  // Function to remove a product from the liked list
  const removeLikedProduct = async (productId) => {
    try {
      const productRef = doc(db, 'Likes', productId);
      await updateDoc(productRef, { users: [] }); // Clear likes

      // Refresh list
      fetchLikedProducts();

      Toast.show({ type: 'success', text1: 'Removed', text2: 'Product removed from liked list' });
    } catch (error) {
      console.error('Error removing product:', error);
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

              {/* Remove Button (Top Right) */}
              <TouchableOpacity style={styles.removeButton} onPress={() => removeLikedProduct(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>

              {/* Product Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.rating}><FontAwesome name="star" size={16} color="#FFD700" /> {item.rating}</Text>
                <Text style={styles.likesCount}><Ionicons name="heart" size={16} color="#FF6B6B" /> {item.likes} Likes</Text>

                {/* Liked At Time (Bottom Right) */}
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={14} color="#555" />
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
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  productCard: { backgroundColor: '#FFF', borderRadius: 10, marginBottom: 15, overflow: 'hidden', padding: 15 },
  productImage: { width: '100%', height: 150, borderRadius: 10 },
  removeButton: { position: 'absolute', top: 10, right: 10 },
  removeText: { color:'white' , fontWeight: 'bold',backgroundColor:'#FF6B6B',fontWeight:'bold',padding:10,borderRadius:8 },
  detailsContainer: { padding: 10 },
  productName: { fontSize: 18, fontWeight: 'bold' },
  rating: { fontSize: 16, color: '#777', marginTop: 5 },
  likesCount: { fontSize: 16, color: '#777', marginTop: 5 },
  timeContainer: { position: 'absolute', bottom: 5, right: 10, flexDirection: 'row', alignItems: 'center' },
  likedTime: { fontSize: 14, color: '#777', marginLeft: 5 },
});

export default Likes;
