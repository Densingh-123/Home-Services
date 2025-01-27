import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const UserIntro = () => {
  const router = useRouter(); // Initialize the router

  // Function to handle navigation to AddBusiness page
  const handleAddBusiness = () => {
    router.push('/business/AddBusiness'); // Navigate to AddBusiness page
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../../assets/images/user.webp')} style={styles.profileImage} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Densingh</Text>
        <Text style={styles.email}>ddeningh19@gmail.com</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddBusiness}>
          <Text style={styles.buttonText}>Add Business</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>My Business</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Share App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserIntro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});