import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithGoogle } from '../../../comfig/FireBaseConfig';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push('/'); // Navigate to home page
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

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
        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/LoginScreen/SignUp')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity> */}
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
    height:600,
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5D3FD3',
  },
  googleButtonText: {
    color: '#5D3FD3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});