import { Slot, Stack, useRouter } from 'expo-router';

import { TRPCProvider } from '../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';

export default function ClientLayout() {
  const navigation = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const checkingToken = async () => {
      const t = await AsyncStorage.getItem('token');
      setToken(t);
      if (t) {
        navigation.push('/client/');
      }
    };
    checkingToken();
  }, []);
    return (
      <TRPCProvider>
        <Slot />
      </TRPCProvider>
    );
}
