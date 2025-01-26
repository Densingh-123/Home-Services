import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router';

const PopularBusinessCard = ({ business }) => {
  const router = useRouter();

  // Navigate to BusinessDetail page with the business ID
  const handlePress = () => {
    router.push(`/BusinessDetail/${business?.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* Business Image (Full Width) */}
      {business?.image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: business.image }} style={styles.cardImage} />
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
      <View style={styles.cardContent}>
        {/* Name and Star Rating */}
        <View style={styles.nameRatingContainer}>
          <Text style={styles.shopName}>{business?.name || 'No Name'}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{business?.star || '0'}</Text>
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address}>{business?.address || 'No Address'}</Text>

        {/* About */}
        <Text style={styles.about} numberOfLines={3}>
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
    overflow: 'hidden', // Ensure the image respects border radius
  },
  imageContainer: {
    position: 'relative', // For positioning the category label
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(93, 63, 211, 0.9)', // Slightly darker shade for better contrast
    borderTopLeftRadius: 10, // Rounded corners for smooth edges
    borderBottomRightRadius: 10, // Consistent with top-left
    paddingHorizontal: 15, // Balanced horizontal padding
    paddingVertical: 8, // Slightly increased vertical padding
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
    width: 120, // Increased width for better text fit
    height: 50, // Adjusted height for balance
  },
  categoryText: {
    fontSize: 16, // Slightly smaller for elegance
    fontWeight: '600', // Medium-bold weight for readability
    color: '#FFFFFF', // Crisp white text
    textAlign: 'center', // Centered text alignment
    textTransform: 'uppercase', // Stylish uppercase text
    letterSpacing: 0.8, // Slight spacing for readability
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
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 4,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  about: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
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