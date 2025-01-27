import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import Login from '../screens/LoginScreen/Login';


// Define tokenCache outside the component
const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key); // Use getItemAsync
    } catch (e) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return await SecureStore.setItemAsync(key, value); // Fix typo (Value -> value)
    } catch (error) {
      return;
    }
  },
};

export default function HomeScreen() {
  return (
    <ClerkProvider
      tokenCache={tokenCache} // Pass tokenCache
      publishableKey="pk_test_Y2FyaW5nLWZvYWwtNy5jbGVyay5hY2NvdW50cy5kZXYk"
    >
      <NavigationContainer>
        <View style={styles.container}>
          <SignedIn>
          
          </SignedIn>
          <SignedOut>
            <Login />
          </SignedOut>
        </View>
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});