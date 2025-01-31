import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { db } from '../../comfig/FireBaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';

const CommentsAndLikesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Fetch all businesses from Firestore
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const businessCollection = collection(db, 'BusinessList');
      const businessSnapshot = await getDocs(businessCollection);
      const businessData = businessSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinesses(businessData);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load businesses',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch business details, comments, and likes when a business is selected
  const fetchBusinessDetails = async (businessId) => {
    setLoading(true);
    try {
      const businessDocRef = doc(db, 'BusinessList', businessId);
      const businessDocSnap = await getDoc(businessDocRef);

      if (businessDocSnap.exists()) {
        setSelectedBusiness({ id: businessId, ...businessDocSnap.data() });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Business not found',
        });
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load business details',
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
      {/* Business List */}
      <Text style={styles.sectionTitle}>Select a Business</Text>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.businessCard} onPress={() => fetchBusinessDetails(item.id)}>
            <Image source={{ uri: item.image }} style={styles.businessImage} />
            <Text style={styles.businessName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Business Details */}
      {selectedBusiness && (
        <View style={styles.businessDetails}>
          <Image source={{ uri: selectedBusiness.image }} style={styles.detailImage} />
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{selectedBusiness.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{selectedBusiness.rating || '4.5'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Likes Section */}
      {/* {selectedBusiness?.likes && (
        <View style={styles.likesSection}>
          <Text style={styles.sectionTitle}>Likes</Text>
          <View style={styles.likesContainer}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <Text style={styles.likesCount}>{selectedBusiness.likes.length} Likes</Text>
          </View>
        </View>
      )} */}

      {/* Comments Section */}
      {selectedBusiness?.comments && (
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments</Text>
          {selectedBusiness.comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet.</Text>
          ) : (
            selectedBusiness.comments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                  <Ionicons name="person-circle" size={30} color="#6C63FF" />
                  <View style={styles.commentUserInfo}>
                    <Text style={styles.commentUser}>User: {comment.userId}</Text>
                    <Text style={styles.commentTime}>2 hours ago</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>"{comment.comment}"</Text>
                <View style={styles.commentRating}>
                  <MaterialIcons name="star-rate" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}>{comment.rating} stars</Text>
                </View>
              </View>
            ))
          )}
        </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  businessCard: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  businessImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  businessDetails: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  businessInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  likesSection: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
  },
  commentsSection: {
    marginTop: 20,
  },
  noComments: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  commentContainer: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserInfo: {
    marginLeft: 10,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 14,
    color: '#777',
  },
  commentText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  commentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommentsAndLikesPage;