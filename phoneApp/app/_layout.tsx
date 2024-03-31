import { Slot, Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider, TRPCProvider } from '../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-100': Inter_100Thin,
    'Inter-200': Inter_200ExtraLight,
    'Inter-300': Inter_300Light,
    'Inter': Inter_400Regular,
    'Inter-500': Inter_500Medium,
    'Inter-600': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-800': Inter_800ExtraBold,
    'Inter-900': Inter_900Black,
  });
  if (fontsLoaded) {
    return <Slot />;
  }
}
