import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection } from 'firebase/firestore';
import { db } from '../../comfig/FireBaseConfig';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background

// Local images for icons
const callIcon = require('../../assets/images/call.png');
const locationIcon = require('../../assets/images/map.png');
const webIcon = require('../../assets/images/web.png');
const shareIcon = require('../../assets/images/next.png');

const BusinessDetail = () => {
  const { BusinessId } = useLocalSearchParams(); // Access the dynamic parameter
  const router = useRouter(); // Router for navigation
  const [business, setBusiness] = useState(null); // State to store business details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [liked, setLiked] = useState(false); // State to manage like status
  const [rating, setRating] = useState(0); // State to manage user rating
  const [comment, setComment] = useState(''); // State to manage user comment
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission loading
  const [comments, setComments] = useState([]); // State to store comments from the database

  useEffect(() => {
    getBusinessDetailById();
  }, []);

  const getBusinessDetailById = async () => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId); // Reference to the document
      const docSnap = await getDoc(docRef); // Fetch the document

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data()); // Log the data for debugging
        setBusiness(docSnap.data()); // Update state with the fetched data
        setLiked(docSnap.data().likes?.includes('user-id')); // Check if the product is liked by the user
        setComments(docSnap.data().comments || []); // Fetch and set comments
      } else {
        console.log('No such document!'); // Log if the document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching business details:', error); // Log any errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle like/unlike functionality
  const handleLike = async () => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      if (liked) {
        await updateDoc(docRef, {
          likes: arrayRemove('user-id'), // Remove user ID from likes array
        });
        Toast.show({
          type: 'success',
          text1: 'Unliked',
          text2: 'You unliked this business.',
        });
      } else {
        await updateDoc(docRef, {
          likes: arrayUnion('user-id'), // Add user ID to likes array
        });
        Toast.show({
          type: 'success',
          text1: 'Liked',
          text2: 'You liked this business.',
        });
      }
      setLiked(!liked); // Toggle like status
    } catch (error) {
      console.error('Error updating like status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update like status.',
      });
    }
  };

  // Handle rating functionality
  const handleRating = async (newRating) => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      await updateDoc(docRef, {
        ratings: arrayUnion({ userId: 'user-id', rating: newRating }), // Add user rating to ratings array
      });
      setRating(newRating); // Update local rating state
      Toast.show({
        type: 'success',
        text1: 'Rating Added',
        text2: `You rated this business ${newRating} stars.`,
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update rating.',
      });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please write a comment.',
      });
      return;
    }

    setIsSubmitting(true); // Start loading
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      await updateDoc(docRef, {
        comments: arrayUnion({ userId: 'user-id', comment: comment, rating: rating }), // Add user comment and rating to comments array
      });
      setComment(''); // Clear comment input
      setComments((prevComments) => [...prevComments, { userId: 'user-id', comment: comment, rating: rating }]); // Update local state
      Toast.show({
        type: 'success',
        text1: 'Comment Added',
        text2: 'Your comment has been submitted.',
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit comment.',
      });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Handle add to cart functionality
  const handleAddToCart = async () => {
    try {
      const cartRef = doc(collection(db, 'Cart'), BusinessId);
      await setDoc(cartRef, {
        ...business,
        id: BusinessId
      });

      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: 'Service has been added successfully!',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add service to cart.',
      });
    }
  };

  // Handle call functionality
  const handleCall = () => {
    Linking.openURL(`tel:${business.contact}`);
  };

  // Handle location functionality
  const handleLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
    Linking.openURL(url);
  };

  // Handle website functionality
  const handleWebsite = () => {
    Linking.openURL(business.website);
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this business: ${business.name}\n${business.website}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Render loading effect
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3FD3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Render business details
  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#5D3FD3" />
      </TouchableOpacity>

      {/* Business Image */}
      <Image source={{ uri: business.image }} style={styles.businessImage} />

      {/* Like Button */}
      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color="#FF0000" />
      </TouchableOpacity>

      {/* Business Name */}
      <Text style={styles.businessName}>{business.name}</Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{business.likes || '0'}</Text>
        <MaterialIcons name="star" size={20} color="#FFD700" />
      </View>

      {/* Icon Row (Call, Location, Website, Share) */}
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleCall}>
          <Image source={callIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLocation}>
          <Image source={locationIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleWebsite}>
          <Image source={webIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Image source={shareIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>{business.about}</Text>
      </View>

      {/* Review Section */}
      <LinearGradient
        colors={['#FFFFFF', '#F5F5F5']}
        style={styles.ratingSectionContainer}
      >
        <Text style={styles.sectionTitle}>Rate this Business</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <MaterialIcons
                name={star <= rating ? 'star' : 'star-border'}
                size={40}
                color={star <= rating ? '#FFD700' : '#C8C7C8'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>{rating}/5</Text>
      </LinearGradient>

      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>

      

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.commentSubmitButton}
          onPress={handleCommentSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.commentSubmitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
{/* Comments Section */}
<View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentText}>
              {comment.userId}: {comment.comment}
            </Text>
          </View>
        ))}
      </View>
      {/* Toast Notifications */}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#5D3FD3',
  },
  businessImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  likeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  businessName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 18,
    marginRight: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  ratingSectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 15,
    marginVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    width:300,
    margin:70
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginVertical: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5D3FD3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
  },
  commentSubmitButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  commentSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessDetail;
