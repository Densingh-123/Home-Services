import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons'; // Importing icons from Expo
import { useRouter } from 'expo-router'; // For navigation
import * as Sharing from 'expo-sharing'; // For sharing functionality
import { useAuth } from '@clerk/clerk-expo'; // For logout functionality

const UserIntro = () => {
  const router = useRouter(); // Initialize the router
  const { signOut } = useAuth(); // Initialize Clerk's signOut function

  // Function to handle navigation to MyBusiness page
  const handleMyBusiness = () => {
    router.push('/business/MyBusiness'); // Navigate to MyBusiness page
  };

  // Function to handle sharing the app
  const handleShareApp = async () => {
    try {
      await Sharing.shareAsync('Check out this amazing app!');
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // Sign out using Clerk
      router.replace('/'); // Navigate to the login screen
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/user.webp')} style={styles.profileImage} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Densingh</Text>
        <Text style={styles.email}>ddeningh19@gmail.com</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="plus-circle" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Add Business</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleMyBusiness}>
            <MaterialIcons name="business" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>My Business</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleShareApp}>
            <AntDesign name="sharealt" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Share App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#3b3b3b',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#ccc',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Slightly less than half to account for spacing
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
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
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});