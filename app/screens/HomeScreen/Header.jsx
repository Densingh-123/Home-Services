import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const handleAddBusiness = () => {
    setDropdownVisible(false);
    router.push('/business/AddBusiness');
  };

  const handleMyBusiness = () => {
    setDropdownVisible(false);
    router.push('/business/MyBusiness');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={require('../../../assets/images/user.webp')} style={styles.profileImage} />
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome, User</Text>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <FontAwesome name="bookmark" size={26} color="white" style={styles.book} />
          </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleAddBusiness}>
            <Text style={styles.dropdownText}>Add Business</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleMyBusiness}>
            <Text style={styles.dropdownText}>My Business</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchSection}>
        <FontAwesome name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Search" style={styles.searchInput} placeholderTextColor="gray" />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 40,
    backgroundColor: '#5D3FD3',
    flexDirection: 'column',
    alignItems: 'flex-start',
 
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  book: {
    marginLeft: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 10,
  },
  searchIcon: {
    marginRight: 15,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'black',
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
  },
  dropdownMenu: {
    zIndex:1,
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
