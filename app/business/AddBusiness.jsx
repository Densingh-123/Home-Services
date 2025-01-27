import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker'; // For image upload
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../../comfig/FireBaseConfig'; // Firebase configuration
import { useRouter } from 'expo-router'; // For navigation

const AddBusiness = () => {
  const [image, setImage] = useState(null); // State for image
  const [name, setName] = useState(''); // State for name
  const [likes, setLikes] = useState(0); // State for likes
  const [website, setWebsite] = useState(''); // State for website
  const [contact, setContact] = useState(''); // State for contact
  const [about, setAbout] = useState(''); // State for about
  const [address, setAddress] = useState(''); // State for address
  const [category, setCategory] = useState(''); // State for category
  const router = useRouter(); // Initialize the router

  // Function to handle image upload
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the selected image
    }
  };

  // Function to add business to Firestore
  const handleAddBusiness = async () => {
    try {
      await addDoc(collection(db, 'BusinessList'), {
        image,
        name,
        likes,
        website,
        contact,
        about,
        address,
        category,
      });
      Alert.alert('Success', 'Business added successfully!');
      router.back(); // Go back to the previous screen
    } catch (error) {
      console.error('Error adding business:', error);
      Alert.alert('Error', 'Failed to add business. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/back.jpg')} style={styles.backgroundImage} />
      <View style={styles.overlay}>
       

        {/* Image Upload */}
        <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../../assets/images/camera.png')} style={styles.placeholderImage} />
          )}
        </TouchableOpacity>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Likes"
          value={likes.toString()}
          onChangeText={(text) => setLikes(Number(text))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Website "
          value={website}
          onChangeText={setWebsite}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Contact"
          value={contact}
          onChangeText={setContact}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="About"
          value={about}
          onChangeText={setAbout}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleAddBusiness}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddBusiness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color:'white'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black glassmorphism effect
    padding: 20,
    justifyContent: 'center',
 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginRight:250,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: 80,
    height: 80,
   
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
    fontWeight: 'bold',
    placeholderTextColor: '#fff', // Set placeholder color to white
  },
  
  button: {
    backgroundColor: '#5D3FD3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
