import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../comfig/FireBaseConfig'; // Firebase configuration
import { useRouter } from 'expo-router'; // For navigation

const MyBusiness = () => {
  const [businesses, setBusinesses] = useState([]); // State to store businesses
  const router = useRouter(); // Initialize the router

  // Fetch businesses from Firestore
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

  // Delete a business from Firestore
  const handleDeleteBusiness = async (id) => {
    try {
      await deleteDoc(doc(db, 'BusinessList', id));
      Alert.alert('Success', 'Business deleted successfully!');
      fetchBusinesses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting business:', error);
      Alert.alert('Error', 'Failed to delete business. Please try again.');
    }
  };

  // Navigate to BusinessDetail page
  const handleBusinessDetail = (id) => {
    router.push(`/BusinessDetail/${id}`);
  };

  useEffect(() => {
    fetchBusinesses(); // Fetch businesses on component mount
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleBusinessDetail(item.id)}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.about}</Text>
              <Text style={styles.cardText}>{item.address}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBusiness(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});