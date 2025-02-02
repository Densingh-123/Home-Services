import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

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
    if (loaded) {
      router.push('/screens/LoginScreen/Login');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="BusinessList/[Category]"
          options={{
            title: 'Business List',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="BusinessDetail/[BusinessId]"
          options={{
            title: 'Business Details',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="business/Likes"
          options={{
            title: 'Liked Products',
            headerShown: true,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}