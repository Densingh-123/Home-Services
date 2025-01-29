import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Dimensions, 
  Share 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../comfig/FireBaseConfig';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons'; // Icons for buttons

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768; // Define large screen breakpoint

const MyBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();

  const fetchBusinesses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'BusinessList'));
      const businessList = [];
      querySnapshot.forEach((doc) => {
        businessList.push({ id: doc.id, ...doc.data() });
      });
      setBusinesses(businessList);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleDeleteBusiness = async (id) => {
    try {
      await deleteDoc(doc(db, 'BusinessList', id));
      Alert.alert('Success', 'Business deleted successfully!');
      fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
      Alert.alert('Error', 'Failed to delete business. Please try again.');
    }
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `Check out this business: ${item.name} 📍 ${item.address} \n\n${item.about}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBusinessDetail = (id) => {
    router.push(`/BusinessDetail/${id}`);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <View style={isLargeScreen ? styles.largeContainer : styles.container}>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        numColumns={isLargeScreen ? 3 : 1} // 3 columns on large screens, 1 on small
        columnWrapperStyle={isLargeScreen ? styles.row : null} // Row styling for large screens
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleBusinessDetail(item.id)}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.about}</Text>
              <Text style={styles.cardText}>{item.address}</Text>

              {/* Button Row - Delete on Left, Share on Right */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteBusiness(item.id)}
                >
                  <AntDesign name="delete" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.shareButton} 
                  onPress={() => handleShare(item)}
                >
                  <Feather name="share-2" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyBusiness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  largeContainer: {
    flex: 1,
    paddingHorizontal: 200, // Large screens have 200px left & right margin
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    marginTop:30,
    width: 335, // Fixed card width
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: 8, // Add spacing between cards
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
