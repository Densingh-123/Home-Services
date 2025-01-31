import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Redirect to the login page after the root layout is mounted
    if (loaded) {
      router.push('/screens/LoginScreen/Login');
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Show nothing while fonts are loading
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Login Screen (Hidden Header) */}
        <Stack.Screen
          name="screens/LoginScreen/Login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/LoginScreen/SignUp"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/LoginScreen/Register"
          options={{ headerShown: false }}
        />

        {/* Tabs Screen (Hidden Header) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* BusinessList Screen */}
        <Stack.Screen
          name="BusinessList/[Category]"
          options={{
            title: 'Business List',
            headerShown: true,
          }}
        />

        {/* BusinessDetail Screen */}
        <Stack.Screen
          name="BusinessDetail/[BusinessId]"
          options={{
            title: 'Business Details',
            headerShown: true,
          }}
        />

        {/* Not Found Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}