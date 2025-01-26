import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/comfig/FireBaseConfig';
import PopularBusinessCard from './PopularBusnessCard';

const PopularBusiness = () => {
  const [BusinessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    getBusinessList();
  }, []);

  const getBusinessList = async () => {
    try {
      const q = query(collection(db, 'BusinessList'), limit(10));
      const querySnapshot = await getDocs(q);
      const businessData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        businessData.push({ id: doc.id, ...data }); // Add ID and data to the list
        console.log('Fetched Business Data:', data); // Log each business data
      });
      console.log('All Business Data:', businessData); // Log all business data
      setBusinessList(businessData); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false); // Stop loading
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Popular Businesses</Text>
      <FlatList
        data={BusinessList}
        keyExtractor={(item) => item.id} // Ensure unique key
        renderItem={({ item }) => (
          <PopularBusinessCard business={item} />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default PopularBusiness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
    fontStyle: 'italic',
    color: '#5D3FD3',
    textAlign: 'center',
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
  flatListContainer: {
    paddingBottom: 20, // Add padding to avoid cutting off the last item
  },
});