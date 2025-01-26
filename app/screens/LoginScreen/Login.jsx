import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import useWarmUpBrowser from '../../hooks/WarmUpBrowser';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking'; // Import expo-linking

const { width, height } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('home', { scheme: 'myapp' }), // Redirect to 'home'
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId }); // Set the active session
      }
    } catch (err) {
      console.error('OAuth error:', err); // Log the full error object
      console.error('Error message:', err.message); // Log the error message
      console.error('Error stack:', err.stack); // Log the error stack trace
    }
  }, [startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/welcome.jpg')} style={styles.loginImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}>
          Let's Find <Text style={styles.highlight}>Professional Cleaning And Repair</Text> Service
        </Text>
        <Text style={styles.subtitle}>
          Best app to find services near you which deliver you a professional service
        </Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginImage: {
    width: width,
    height: height * 0.6,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: 310,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    color: '#5D3FD3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5D3FD3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#5D3FD3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});