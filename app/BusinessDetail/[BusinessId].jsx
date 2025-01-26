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
  import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
          <Text style={styles.ratingText}>{business.star || '0'}</Text>
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
  
        {/* Comment Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Write a Comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment here..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCommentSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
  
          {/* Display Customer Comments */}
          {comments.map((item, index) => (
            <View key={index} style={styles.commentContainer}>
              <View style={styles.commentHeader}>
                <MaterialIcons name="person" size={20} color="#5D3FD3" />
                <Text style={styles.commentUser}>User {item.userId}</Text>
                <View style={styles.commentRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialIcons
                      key={star}
                      name={star <= item.rating ? 'star' : 'star-border'}
                      size={16}
                      color={star <= item.rating ? '#FFD700' : '#C8C7C8'}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          ))}
        </View>
  
        {/* Toast Component */}
        <Toast />
      </ScrollView>
    );
  };
  
  export default BusinessDetail;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 16,
      zIndex: 1,
    },
    businessImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    likeButton: {
      position: 'absolute',
      top: 40,
      right: 16,
      zIndex: 1,
    },
    businessName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 16,
      marginHorizontal: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 8,
    },
    ratingText: {
      fontSize: 18,
      color: '#FFD700',
      marginLeft: 8,
      fontWeight: 'bold',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    icon: {
      width: 40,
      height: 40,
    },
    sectionContainer: {
      marginTop: 20,
      marginHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphism effect
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
     
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#5D3FD3',
      marginBottom: 8,
    },
    sectionText: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24, // Improved line height for better readability
    },
    ratingSectionContainer: {
      marginTop: 20,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,

      alignItems: 'center', // Center align the rating section
    },
    starContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: '#5D3FD3',
      borderRadius: 8,
      padding: 10,
      marginTop: 8,
      fontSize: 16,
      color: '#333',
      height: 100, // Increased height for comment box
      textAlignVertical: 'top', // Align text to the top
    },
    submitButton: {
      backgroundColor: '#5D3FD3',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    submitButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    commentContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#FFF',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
 elevation:3
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    commentUser: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5D3FD3',
      marginLeft: 8,
    },
    commentRating: {
      flexDirection: 'row',
      marginLeft: 8,
    },
    commentText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
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