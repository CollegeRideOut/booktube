import { Slot, Stack, useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from "expo-router";
import { TRPCProvider } from '../../util/trpc';

//SplashScreen.preventAutoHideAsync();

enum StateOfAuth {
  AUTHORIZED = 0,
  NOT_AUTHORIZED = 1,
  NO_TOKEN = 3,
  WAITING = 4,
}

export default function AppLayout() {
  return (
    <TRPCProvider>
      <Slot />
    </TRPCProvider>
  );
}
