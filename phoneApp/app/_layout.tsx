import { Slot, Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider, TRPCProvider } from '../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

export default function MainLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
  });
  return <Slot />;
}
