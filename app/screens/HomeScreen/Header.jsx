import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        
        <Image 
          source={require('../../../assets/images/user.webp')} 
          style={styles.profileImage} 
        />
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome, User</Text>
          <FontAwesome name="bookmark" size={26} color="white"style={styles.book} />
        </View>
      </View>
      <View style={styles.searchSection}>
        <FontAwesome name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput 
          placeholder='Search' 
          style={styles.searchInput} 
          placeholderTextColor="gray"
        />
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
    borderRadius:20
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
  book:{
position:'relative',
left:100
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight:'bold',
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
    marginLeft:10
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'black',
    padding: 8,
    fontSize: 18,
    fontWeight:'bold',
    marginRight:20
  },
});
