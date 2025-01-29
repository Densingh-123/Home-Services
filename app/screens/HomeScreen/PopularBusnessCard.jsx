import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router';

// Get screen width
const { width } = Dimensions.get('window');
const isLargeScreen = width > 600; // Define breakpoint for larger screens

const PopularBusinessCard = ({ business }) => {
  const router = useRouter();

  // Navigate to BusinessDetail page with the business ID
  const handlePress = () => {
    router.push(`/BusinessDetail/${business?.id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isLargeScreen && styles.cardLarge]} 
      onPress={handlePress}
    >
      {/* Business Image */}
      {business?.image ? (
        <View style={[styles.imageContainer, isLargeScreen && styles.imageContainerLarge]}>
          <Image source={{ uri: business.image }} style={[styles.cardImage, isLargeScreen && styles.cardImageLarge]} />
          {/* Category Label */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{business?.category || 'Uncategorized'}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {/* Business Details */}
      <View style={[styles.cardContent, isLargeScreen && styles.cardContentLarge]}>
        {/* Name and Star Rating */}
        <View style={styles.nameRatingContainer}>
          <Text style={[styles.shopName, isLargeScreen && styles.shopNameLarge]}>{business?.name || 'No Name'}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{business?.likes || '0'}</Text>
          </View>
        </View>

        {/* Address */}
        <Text style={[styles.address, isLargeScreen && styles.addressLarge]}>{business?.address || 'No Address'}</Text>

        {/* About */}
        <Text style={[styles.about, isLargeScreen && styles.aboutLarge]} numberOfLines={3}>
          {business?.about || 'No Description'}
        </Text>

        {/* Contact and Website Icons */}
        <View style={styles.contactContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Linking.openURL(`tel:${business?.contact}`)}
          >
            <MaterialIcons name="phone" size={24} color="#5D3FD3" />
            <Text style={styles.iconText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Linking.openURL(business?.website)}
          >
            <MaterialIcons name="public" size={24} color="#5D3FD3" />
            <Text style={styles.iconText}>Website</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PopularBusinessCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    margin: 5,
    overflow: 'hidden',
  },
  cardLarge: {
    flexDirection: 'row', // Side-by-side layout for larger screens
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  imageContainerLarge: {
    flex: 1, // Allows image to take half of the width
    marginRight: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardImageLarge: {
    height: 250,
    borderRadius: 20,
  },
  categoryContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(93, 63, 211, 0.9)',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: 100,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  placeholderImage: {
    backgroundColor: '#D4CBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#5D3FD3',
  },
  cardContent: {
    padding: 16,
  },
  cardContentLarge: {
    flex: 2, // Allows text content to take more space
    paddingLeft: 16,
  },
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  shopNameLarge: {
    fontSize: 26,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressLarge: {
    fontSize: 18,
  },
  about: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutLarge: {
    fontSize: 16,
    lineHeight: 24,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    color: '#5D3FD3',
    marginTop: 4,
  },
});
