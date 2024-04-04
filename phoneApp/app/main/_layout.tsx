import { Slot, Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider, TRPCProvider } from '../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { StripeProvider } from '@stripe/stripe-react-native';

import { SplashScreen } from "expo-router";
//SplashScreen.preventAutoHideAsync()

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
      <View style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#202020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 36,
            height: 36,
          }}
        />
      </View>
    );
  } else if (token === null) {
    navigation.push('/(app)/');
  } else if (token !== '')
    return (
      <AuthTRPCProvider token={token}>

        <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY!}>
          <Slot />
        </StripeProvider>
      </AuthTRPCProvider>
    );
}
