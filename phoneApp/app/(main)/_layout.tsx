import { Slot, Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider, TRPCProvider } from '../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function MainLayout() {
  const navigation = useRouter();
  const [token, setToken] = useState<null | string | false>(false);

  useEffect(() => {
    const checkToken = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t !== '') {
        setToken(t);
      }
    };

    // call the func
    checkToken();
  }, []);

  if (token === false) {
    return (
      <View>
        <Text>Loadin MAIN</Text>
      </View>
    );
  } else if (token === null) {
    navigation.push('/(app)/');
  } else if (token !== '')
    return (
      <AuthTRPCProvider token={token}>
        <Slot />
      </AuthTRPCProvider>
    );
}
