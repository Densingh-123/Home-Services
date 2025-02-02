import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    ScrollView,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
  import { db, auth } from '../../comfig/FireBaseConfig';
  import { useRouter } from 'expo-router';
  import Toast from 'react-native-toast-message';
  import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
  
  const { width, height } = Dimensions.get('window');
  
  const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      fetchCartItems();
    }, []);
  
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'You must be logged in to view your cart.',
          });
          return;
        }
  
        const q = query(collection(db, 'Cart'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        const cartData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(cartData);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleRemoveFromCart = async (id) => {
      try {
        await deleteDoc(doc(db, 'Cart', id));
        setCartItems(cartItems.filter((item) => item.id !== id));
        Toast.show({
          type: 'success',
          text1: 'Removed',
          text2: 'Service removed from cart.',
        });
      } catch (error) {
        console.error('Error removing item:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to remove service from cart.',
        });
      }
    };
  
    const renderRatingStars = (rating) => {
      return [1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons
          key={star}
          name={star <= rating ? 'star' : 'star-border'}
          size={16}
          color={star <= rating ? '#FFD700' : '#C8C7C8'}
        />
      ));
    };
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
        </View>
      );
    }
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Your Cart</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>No services added to cart.</Text>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartImage} />
                <View style={styles.cartInfo}>
                <Text style={styles.cartCategory}>{item.category}</Text>
                  <Text style={styles.cartTitle}>{item.name}</Text>
                  
                  <Text style={styles.cartAddress}>{item.address}</Text>
                  <View style={styles.ratingContainer}>
                    {renderRatingStars(
                      item.ratings?.reduce((acc, curr) => acc + curr.rating, 0) / item.ratings?.length || 0
                    )}
                    <Text style={styles.ratingText}>
                      ({item.ratings?.length || 0} reviews)
                    </Text>
                  </View>
                  {/* <Text style={styles.cartDescription}>{item.about}</Text> */}
                  <View style={styles.commentsContainer}>
                    <Text style={styles.commentsTitle}>Comments:</Text>
                    {item.comments?.slice(0, 2).map((comment, index) => (
                      <View key={index} style={styles.commentItem}>
                        <FontAwesome name="user-circle" size={16} color="#5D3FD3" />
                        <Text style={styles.commentText}>{comment.comment}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFromCart(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    );
  };
  
  export default Cart;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
      color: '#5D3FD3',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    cartImage: {
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: 12,
      marginRight: 15,
    },
    cartInfo: {
      flex: 1,
    },
    cartTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    cartCategory: {
        backgroundColor: '#5D3FD3',
        color:'#FFF',
        fontWeight:'bold',
        padding:8,
      fontSize: 16,
      width:80,
      textAlign:'center',
   borderRadius:10,
      marginBottom: 5,
      position:'relative',
      left:-115,
      top:52,
      marginTop:-5,
      
    },
    cartAddress: {
      fontSize: 14,
      color: '#777',
      marginBottom: 10,
    },
    cartDescription: {
      fontSize: 14,
      color: '#555',
      marginBottom: 10,
      lineHeight: 20,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    ratingText: {
      fontSize: 14,
      color: '#777',
      marginLeft: 5,
    },
    commentsContainer: {
      marginBottom: 10,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    commentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    commentText: {
      fontSize: 14,
      color: '#555',
      marginLeft: 5,
    },
    removeButton: {
        position:'relative',
        left:90,
      backgroundColor: '#FF3B30',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    removeButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 18,
      color: '#888',
      marginTop: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });