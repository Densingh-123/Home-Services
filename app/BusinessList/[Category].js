import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { useLocalSearchParams, useRouter } from 'expo-router';
  import { db } from '../../comfig/FireBaseConfig';
  import { collection, getDocs, query, where } from 'firebase/firestore';
  import { MaterialIcons } from '@expo/vector-icons';
  
  const BusinessListByCategory = () => {
    const { Category } = useLocalSearchParams(); // Get the category from the URL params
    const [businessList, setBusinessList] = useState([]); // State to store business data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const router = useRouter(); // Router for navigation
  
    useEffect(() => {
      // Fetch business data based on the category
      getBusinessList();
    }, [Category]);
  
    const getBusinessList = async () => {
      try {
        const q = query(
          collection(db, 'BusinessList'),
          where('category', '==', Category) // Filter by category
        );
        const querySnapshot = await getDocs(q);
        const businessData = [];
        querySnapshot.forEach((doc) => {
          // Add the document ID and data to the array
          const business = { id: doc.id, ...doc.data() };
          businessData.push(business);
          console.log('Business ID:', doc.id); // Log the ID for debugging
          console.log('Business Data:', business); // Log the entire business object
        });
        setBusinessList(businessData); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
        setRefreshing(false); // Stop refreshing
      }
    };
  
    // Handle pull-to-refresh
    const onRefresh = () => {
      setRefreshing(true); // Start refreshing
      getBusinessList(); // Fetch data again
    };
  
    // Handle business item press
    const handleBusinessPress = (business) => {
      console.log('Navigating to BusinessDetail with ID:', business.id); // Debugging log
      router.push({
        pathname: `/BusinessDetail/${business.id}`, // Dynamic route
        params: { BusinessId: business.id }, // Pass the ID explicitly
      });
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
  
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5D3FD3']} />
        }
      >
        {/* Header with Category Name */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{Category}</Text>
        </View>
  
        {/* Business List */}
        {businessList.length > 0 ? (
          businessList.map((business) => (
            <TouchableOpacity
              key={business.id}
              style={styles.businessItem}
              onPress={() => handleBusinessPress(business)} // Handle press
            >
              {/* Business Image */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: business.image }} style={styles.businessImage} />
              </View>
  
              {/* Business Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.businessName}>{business.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}>{business.star || '0'}</Text>
                </View>
                <Text style={styles.businessAddress}>{business.address}</Text>
  
                {/* Contact and Website */}
                <View style={styles.contactContainer}>
                  <MaterialIcons name="phone" size={24} color="#5D3FD3" />
                  <Text style={styles.contactText}>{business.contact}</Text>
                </View>
                <View style={styles.contactContainer}>
                  <MaterialIcons name="public" size={24} color="#5D3FD3" />
                  <Text style={styles.contactText}>{business.website}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No businesses found in this category.</Text>
        )}
      </ScrollView>
    );
  };
  
  export default BusinessListByCategory;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5F5F5',
    },
    header: {
      marginBottom: 20,
      alignItems: 'center', // Center the header text
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 28, // Larger font size
      color: '#5D3FD3',
      textTransform: 'capitalize', // Capitalize the category name
      fontFamily: 'sans-serif', // Use a modern font
    },
    businessItem: {
      flexDirection: 'row', // Place image and content in the same row
      backgroundColor: 'white',
      borderRadius: 20, // Rounded corners
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5, // Add elevation for a card-like effect
      height: 160, // Fixed height for the container
      overflow: 'hidden', // Ensure the image respects the border radius
    },
    imageContainer: {
      width: 150, // Fixed width for the image
      height: 150, // Fixed height for the image
      padding: 20, // Padding around the image
      justifyContent: 'center', // Center the image vertically
      alignItems: 'center', // Center the image horizontally
    },
    businessImage: {
      width: 120, // Fixed width for the image
      height: 120, // Fixed height for the image
      borderRadius: 14, // Rounded corners for the image
      resizeMode: 'cover', // Ensures the image covers the space without distortion
    },
    detailsContainer: {
      flex: 1, // Content takes the remaining space
      padding: 16,
      justifyContent: 'center', // Center content vertically
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
    },
    businessName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: -20,
      fontFamily: 'sans-serif', // Use a modern font
      paddingTop: 10,
    },
    ratingContainer: {
      left: 160,
      top: -10,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingText: {
      fontSize: 16,
      color: '#FFD700',
      marginLeft: 4,
      fontWeight: 'bold', // Make the rating text bold
    },
    businessAddress: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
      fontFamily: 'sans-serif', // Use a modern font
    },
    contactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      width: 200,
      overflow: 'hidden',
    },
    contactText: {
      fontSize: 14,
      color: '#5D3FD3',
      marginLeft: 8,
      fontFamily: 'sans-serif', // Use a modern font
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
      fontFamily: 'sans-serif', // Use a modern font
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#888',
      marginTop: 20,
      fontFamily: 'sans-serif', // Use a modern font
    },
  });