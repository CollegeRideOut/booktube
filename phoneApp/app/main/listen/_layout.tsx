import { Slot, Stack, useRouter } from 'expo-router';
import { AuthTRPCProvider, api } from '../../../util/trpc';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

import { SplashScreen } from "expo-router";

enum authorizationState {
  WAITING = 0,
  NO_AUTHORIZED = 1,
  AUTHRORIZED = 2,
}

export default function ListenLayout() {
  const navigation = useRouter();

  const authorizedMuattion = api.auth.authorizedClient.useMutation();
  const [authorized, setAuthroized] = useState<authorizationState>(
    authorizationState.WAITING,
  );

  useEffect(() => {
    if (authorized !== authorizationState.WAITING) {

    }
  }, [authorized])
  useEffect(() => {
    const checkingIfAuthorized = async () => {
      const isAuth = await authorizedMuattion.mutateAsync();

      if (isAuth) {
        setAuthroized(authorizationState.AUTHRORIZED);
      } else {
        await AsyncStorage.removeItem('token');
        setAuthroized(authorizationState.NO_AUTHORIZED);
      }
    };
    checkingIfAuthorized();
  }, []);

  if (authorized === authorizationState.NO_AUTHORIZED) {
    navigation.push('/(app)/');
  } else if (authorized === authorizationState.WAITING) {
    return (
      <View style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#202020',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      </View>
    );
  } else if (authorized === authorizationState.AUTHRORIZED) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  }
}
