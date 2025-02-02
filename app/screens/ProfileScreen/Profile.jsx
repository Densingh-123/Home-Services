import { StyleSheet, Text, View, Image, TouchableOpacity, Share, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const UserIntro = () => {
  const router = useRouter();

  const handleAddBusiness = () => {
    router.push('/business/AddBusiness');
  };

  const handleMyBusiness = () => {
    router.push('/business/MyBusiness');
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing app! [App link here]',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ' + result.activityType);
        } else {
          console.log('App shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share action was dismissed');
      }
    } catch (error) {
      console.error('Error sharing the app:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../../assets/images/Banner.png')} style={styles.profileImage} />
        <Text style={styles.name}>Welcome to Our Service Platform</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          We provide a variety of services to make your life easier and more convenient. Explore our offerings:
        </Text>
        <Text style={styles.serviceTitle}>Our Services:</Text>
        <Text style={styles.serviceText}>✅ Food Delivery - Get delicious meals delivered to your doorstep.</Text>
        <Text style={styles.serviceText}>✅ Car Services - Professional vehicle maintenance and repair.</Text>
        <Text style={styles.serviceText}>✅ Dish Washing - Hassle-free dish cleaning at your convenience.</Text>
        <Text style={styles.serviceText}>✅ Kitchen Cleaning - Spotless kitchens with our expert cleaning services.</Text>
        <Text style={styles.serviceText}>✅ Laundry - Fresh and clean clothes, delivered to your home.</Text>
        <Text style={styles.serviceText}>✅ Home Delivery - Quick and reliable deliveries for any goods.</Text>
        <Text style={styles.serviceText}>✅ Gym & Fitness - Find nearby fitness centers and trainers.</Text>
      </View>

     

      <View style={styles.additionalInfo}>
        <Text style={styles.infoText}>📍 Use the map to locate services near you.</Text>
        <Text style={styles.infoText}>📞 Call and connect with service providers easily.</Text>
        <Text style={styles.infoText}>⭐ Rate and review services to help others make informed decisions.</Text>
        <Text style={styles.infoText}>💬 Message and chat with businesses for quick assistance.</Text>
      </View>
    </ScrollView>
  );
};

export default UserIntro;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 380,
    height: 250,
  
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalInfo: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
});