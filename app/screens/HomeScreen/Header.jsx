import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const navigateTo = (path) => {
    setDropdownVisible(false);
    router.push(path);
  };

  return (
    <LinearGradient colors={['#5D3FD3', '#7B68EE']} style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={require('../../../assets/images/user.webp')} style={styles.profileImage} />
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome, User</Text>
          <TouchableOpacity onPress={toggleDropdown}>
            <FontAwesome name="bars" size={26} color="white" style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <Animated.View style={[styles.dropdownMenu, { opacity: dropdownAnim }]}>
          <View style={styles.dropdownGrid}>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => navigateTo('/business/AddBusiness')}>
              <Text style={styles.buttonText}>➕ Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => navigateTo('/business/MyBusiness')}>
              <Text style={styles.buttonText}>🏢 My Biz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => navigateTo('/business/Cart')}>
              <Text style={styles.buttonText}>🛒 Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => navigateTo('/business/Comments')}>
              <Text style={styles.buttonText}>💬 Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownButtonSingle} onPress={() => navigateTo('/business/Likes')}>
              <Text style={styles.buttonText}>❤️ Likes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Search services..." style={styles.searchInput} placeholderTextColor="gray" />
      </View>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 50,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  menuIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 25,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Dropdown */
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right:70,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10, 
    zIndex: 9,
  },
  dropdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dropdownButton: {
    width: '45%',
    backgroundColor: '#7B68EE',
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  dropdownButtonSingle: {
    width: '95%',
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
