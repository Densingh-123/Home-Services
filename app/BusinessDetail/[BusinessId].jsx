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
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../comfig/FireBaseConfig';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

// Local images for icons
const callIcon = require('../../assets/images/call.png');
const locationIcon = require('../../assets/images/map.png');
const webIcon = require('../../assets/images/web.png');
const shareIcon = require('../../assets/images/next.png');

const { width, height } = Dimensions.get('window');

const BusinessDetail = () => {
  const { BusinessId } = useLocalSearchParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getBusinessDetailById();
  }, []);

  const getBusinessDetailById = async () => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        setBusiness(docSnap.data());
<<<<<<< HEAD
        setLiked(docSnap.data().likes?.includes(auth.currentUser?.email));
=======
        setLiked(docSnap.data().likes?.includes('user-id'));
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
        setComments(docSnap.data().comments || []);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
<<<<<<< HEAD
      const likesRef = doc(db, 'Likes', BusinessId);
      const userEmail = auth.currentUser?.email;

      if (liked) {
        await updateDoc(docRef, {
          likes: arrayRemove(userEmail),
        });
        await updateDoc(likesRef, {
          users: arrayRemove(userEmail),
=======
      if (liked) {
        await updateDoc(docRef, {
          likes: arrayRemove('user-id'),
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
        });
        Toast.show({
          type: 'success',
          text1: 'Unliked',
          text2: 'You unliked this business.',
        });
      } else {
        await updateDoc(docRef, {
<<<<<<< HEAD
          likes: arrayUnion(userEmail),
        });
        await setDoc(likesRef, {
          users: arrayUnion(userEmail),
        }, { merge: true });
=======
          likes: arrayUnion('user-id'),
        });
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
        Toast.show({
          type: 'success',
          text1: 'Liked',
          text2: 'You liked this business.',
        });
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating like status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update like status.',
      });
    }
  };

  const handleRating = async (newRating) => {
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      await updateDoc(docRef, {
<<<<<<< HEAD
        ratings: arrayUnion({ userId: auth.currentUser?.email, rating: newRating }),
=======
        ratings: arrayUnion({ userId: 'user-id', rating: newRating }),
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
      });
      setRating(newRating);
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

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please write a comment.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'BusinessList', BusinessId);
      await updateDoc(docRef, {
<<<<<<< HEAD
        comments: arrayUnion({ userId: auth.currentUser?.email, comment: comment, rating: rating }),
      });
      setComment('');
      setComments((prevComments) => [...prevComments, { userId: auth.currentUser?.email, comment: comment, rating: rating }]);
=======
        comments: arrayUnion({ userId: 'user-id', comment: comment, rating: rating }),
      });
      setComment('');
      setComments((prevComments) => [...prevComments, { userId: 'user-id', comment: comment, rating: rating }]);
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
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
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You must be logged in to add items to the cart.',
        });
        return;
      }

      const cartRef = doc(collection(db, 'Cart'), BusinessId);
      await setDoc(cartRef, {
        ...business,
        id: BusinessId,
        userEmail: user.email,
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

  const handleCall = () => {
    Linking.openURL(`tel:${business.contact}`);
  };

  const handleLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
    Linking.openURL(url);
  };

  const handleWebsite = () => {
    Linking.openURL(business.website);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this business: ${business.name}\n${business.website}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#5D3FD3" />
      </TouchableOpacity>

      <Image source={{ uri: business.image }} style={styles.businessImage} />

      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color="#FF0000" />
      </TouchableOpacity>

      <Text style={styles.businessName}>{business.name}</Text>

      <View style={styles.ratingContainer}>
<<<<<<< HEAD
        <Text style={styles.ratingText}>{business.likes?.length || '0'}</Text>
=======
        <Text style={styles.ratingText}>{business.likes || '0'}</Text>
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
        <MaterialIcons name="star" size={20} color="#FFD700" />
      </View>

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>{business.about}</Text>
      </View>

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
<<<<<<< HEAD
            <View style={styles.commentHeader}>
              <FontAwesome name="user-circle" size={24} color="#5D3FD3" />
              <Text style={styles.commentUser}>{comment.userId.split('@')[0]}</Text>
            </View>
            <View style={styles.commentRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                  key={star}
                  name={star <= comment.rating ? 'star' : 'star-border'}
                  size={16}
                  color={star <= comment.rating ? '#FFD700' : '#C8C7C8'}
                />
              ))}
            </View>
            <Text style={styles.commentText}>{comment.comment}</Text>
=======
            <Text style={styles.commentText}>
              {comment.userId}: {comment.comment}
            </Text>
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
          </View>
        ))}
      </View>

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
<<<<<<< HEAD
    width: width,
    height: height * 0.3,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
=======
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
  },
  likeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  businessName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
<<<<<<< HEAD
    color: '#333',
=======
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
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
<<<<<<< HEAD
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
=======
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
    marginVertical: 15,
  },
  icon: {
    width: 40,
    height: 40,
<<<<<<< HEAD
=======
    marginHorizontal: 10,
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
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
<<<<<<< HEAD
    marginBottom: 10,
=======
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
<<<<<<< HEAD
    lineHeight: 24,
  },
  ratingSectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
=======
    marginTop: 10,
  },
  ratingSectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
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
<<<<<<< HEAD
    width: width * 0.8,
    alignSelf: 'center',
=======
    width: 300,
    margin: 70,
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
<<<<<<< HEAD
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  commentRating: {
    flexDirection: 'row',
    marginBottom: 5,
=======
    marginVertical: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
>>>>>>> cc133ce49b03874d1e27995edaf3e53d38aea10b
  },
  commentText: {
    fontSize: 16,
    color: '#555',
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