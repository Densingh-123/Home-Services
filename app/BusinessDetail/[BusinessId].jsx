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
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection, getDocs, query, where, deleteDoc, addDoc } from 'firebase/firestore';
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
  const [totalLikes, setTotalLikes] = useState(0); // State to store total likes count

  useEffect(() => {
    getBusinessDetailById();
    getLikesData();
    getCommentsData(); // Fetch comments
  }, []);

  const getBusinessDetailById = async () => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId); // Reference to the document
      const docSnap = await getDoc(docRef); // Fetch the document

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data()); // Log the data for debugging
        setBusiness(docSnap.data()); // Update state with the fetched data
        setLiked(docSnap.data().likes?.includes('user-id')); // Check if the product is liked by the user
      } else {
        console.log('No such document!'); // Log if the document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching business details:', error); // Log any errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch all likes for this business
  const getLikesData = async () => {
    try {
      const q = query(collection(db, 'Likes'), where('businessId', '==', BusinessId)); // Query for likes related to this business
      const querySnapshot = await getDocs(q); // Get all like documents

      setTotalLikes(querySnapshot.size); // Set the total number of likes
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  // Fetch all comments for this business
  const getCommentsData = async () => {
    try {
      const q = query(collection(db, 'Comments'), where('businessId', '==', BusinessId)); // Query for comments related to this business
      const querySnapshot = await getDocs(q); // Get all comment documents

      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push(doc.data()); // Push each comment to the commentsData array
      });

      setComments(commentsData); // Set comments to state
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle like/unlike functionality and store in Likes collection
  const handleLike = async () => {
    try {
      const likesRef = doc(collection(db, 'Likes'), `${BusinessId}_user-id`); // Reference to the Likes collection
      if (liked) {
        await deleteDoc(likesRef); // Remove like from Likes collection
        setTotalLikes(totalLikes - 1); // Decrease total likes count
        Toast.show({
          type: 'success',
          text1: 'Unliked',
          text2: 'You unliked this business.',
        });
      } else {
        await setDoc(likesRef, { businessId: BusinessId, userId: 'user-id' }); // Add like to Likes collection
        setTotalLikes(totalLikes + 1); // Increase total likes count
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
      // Add the comment to the "Comments" collection
      await addDoc(collection(db, 'Comments'), {
        businessId: BusinessId,
        userId: 'user-id',
        comment: comment,
        rating: rating,
        timestamp: new Date(),
      });

      setComment(''); // Clear the input field
      getCommentsData(); // Refresh the comments list
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
        <Text style={styles.ratingText}>{totalLikes || '0'} Likes</Text>
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
                size={24}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Comments Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentText}>{comment.comment}</Text>
            <Text style={styles.commentRating}>Rating: {comment.rating} stars</Text>
          </View>
        ))}

        {/* Comment Input */}
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          style={styles.commentInput}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCommentSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Add to Cart */}
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#5D3FD3',
  },
  backButton: {
    padding: 10,
  },
  businessImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  likeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  sectionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
  },
  ratingSectionContainer: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  commentRating: {
    fontSize: 14,
    color: '#777',
  },
  commentInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: '#5D3FD3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: '#5D3FD3',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessDetail;
