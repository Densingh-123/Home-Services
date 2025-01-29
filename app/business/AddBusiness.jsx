import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker'; // For image upload
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../../comfig/FireBaseConfig'; // Firebase configuration
import { useRouter } from 'expo-router'; // For navigation
import { Picker } from '@react-native-picker/picker'; // For dropdown selection

const AddBusiness = () => {
  const [image, setImage] = useState(null); // State for image
  const [name, setName] = useState(''); // State for name
  const [likes, setLikes] = useState(0); // State for likes
  const [website, setWebsite] = useState(''); // State for website
  const [contact, setContact] = useState(''); // State for contact
  const [about, setAbout] = useState(''); // State for about
  const [address, setAddress] = useState(''); // State for address
  const [category, setCategory] = useState('delivery'); // Default category
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
      <View style={styles.formContainer}>
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
          placeholder="Business Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Likes"
          placeholderTextColor="#666"
          value={likes.toString()}
          onChangeText={(text) => setLikes(Number(text))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Website"
          placeholderTextColor="#666"
          value={website}
          onChangeText={setWebsite}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact"
          placeholderTextColor="#666"
          value={contact}
          onChangeText={setContact}
        />
        <TextInput
          style={styles.input}
          placeholder="About"
          placeholderTextColor="#666"
          value={about}
          onChangeText={setAbout}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#666"
          value={address}
          onChangeText={setAddress}
        />

        {/* Category Dropdown */}
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Delivery" value="delivery" />
          <Picker.Item label="Wash" value="wash" />
          <Picker.Item label="Gym" value="gym" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Car" value="car" />
        </Picker>

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
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderImage: {
    width: 60,
    height: 60,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
