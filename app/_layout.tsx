import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import spaceMono from '../assets/fonts/SpaceMono-Regular.ttf';
import nunito from '../assets/fonts/Nunito-Regular.ttf';
import nunitoBold from '../assets/fonts/Nunito-Bold.ttf';
import montHeavy from '../assets/fonts/Mont-Heavy.otf';
import montExtraLight from '../assets/fonts/Mont-ExtraLight.otf';
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // todo can be hook from this
  const [loaded] = useFonts({
    SpaceMono: spaceMono,
    Nunito: nunito,
    NunitoBold: nunitoBold,
    MontHeavy: montHeavy,
    MontExtraLight: montExtraLight,
    MontserratRegular: montserratRegular,
    MontserratBold: montserratBold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="archive" options={{ headerShown: false }} />
        <Stack.Screen
          name="note"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
