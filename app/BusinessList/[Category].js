import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../comfig/FireBaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const BusinessListByCategory = () => {
  const { Category } = useLocalSearchParams();
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBusinessList();
  }, [Category]);

  const getBusinessList = async () => {
    try {
      const q = query(collection(db, 'BusinessList'), where('category', '==', Category));
      const querySnapshot = await getDocs(q);
      const businessData = [];
      querySnapshot.forEach((doc) => {
        businessData.push({ id: doc.id, ...doc.data() });
      });
      setBusinessList(businessData);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getBusinessList();
  };

  const handleBusinessPress = (business) => {
    router.push({ pathname: `/BusinessDetail/${business.id}`, params: { BusinessId: business.id } });
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5D3FD3']} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{Category}</Text>
      </View>

      {businessList.length > 0 ? (
        businessList.map((business) => (
          <TouchableOpacity key={business.id} style={styles.businessItem} onPress={() => handleBusinessPress(business)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: business.image }} style={styles.businessImage} />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.businessName}>{business.name}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.ratingText}>{business.star || '0'}</Text>
              </View>
              <Text style={styles.businessAddress}>{business.address}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${business.contact}`)}>
                  <MaterialIcons name="phone" size={18} color="white" />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(business.website)}>
                  <MaterialIcons name="public" size={18} color="white" />
                  <Text style={styles.buttonText}>Visit</Text>
                </TouchableOpacity>
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
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  header: { marginBottom: 20, alignItems: 'center' },
  headerText: { fontWeight: 'bold', fontSize: 28, color: '#5D3FD3', textTransform: 'capitalize' },
  businessItem: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 20, marginBottom: 20, elevation: 5, height: 160 },
  imageContainer: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  businessImage: { width: 100, height: 100, borderRadius: 10, resizeMode: 'cover' },
  detailsContainer: { flex: 1, padding: 16, justifyContent: 'center' },
  businessName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 16, color: '#FFD700', marginLeft: 4, fontWeight: 'bold' },
  businessAddress: { fontSize: 14, color: '#666', marginBottom: 8 },
  buttonContainer: { flexDirection: 'row', marginTop: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5D3FD3', padding: 8, borderRadius: 10, marginRight: 10 },
  buttonText: { color: 'white', fontSize: 14, marginLeft: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#5D3FD3' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 },
});
