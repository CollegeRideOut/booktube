import { Stack, useNavigation, useRouter } from 'expo-router';

import { AuthTRPCProvider, api } from '../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SplashScreen } from "expo-router";


enum authorizationState {
  WAITING = 0,
  NO_AUTHORIZED = 1,
  AUTHRORIZED = 2,
}

export default function TabLayout() {
  const navigation = useRouter();
  const authorizedMuattion = api.auth.authorizedClient.useMutation();
  const [authorized, setAuthroized] = useState<authorizationState>(
    authorizationState.WAITING,

  );
  const [anotherloading, setAnotherLoading] = useState(true)

  const [loading, setLoading] = useState(true)
  const utils = api.useUtils()


  useEffect(() => {
    const prefetch = async () => {
      await Promise.all(
        [

          //SplashScreen.preventAutoHideAsync(),
          utils.genre.getGLoLoBo.prefetch(),
          utils.book.getFeaturedBook.prefetch(),
          utils.genre.getGenres.prefetch(),
          utils.library.getLibrary.prefetch(),
          utils.user.userInfo.prefetch(),
          utils.library.getLibraryOrderHistory.prefetch()
        ]
      )
      setLoading(false)
    }
    prefetch()
  }, [])


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

  function somefunc() { console.log('im done') }

  if (authorized === authorizationState.NO_AUTHORIZED && !loading) {
    navigation.push('/sign');
  } else if (authorized === authorizationState.AUTHRORIZED && !loading) {

    SplashScreen.hideAsync()
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#202020',

        }}

        onLayout={() => {
          somefunc()
        }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarStyle: {
              backgroundColor: '#141414',
              borderWidth: 0,
              borderTopColor: '#141414',
              width: Dimensions.get('window').width,
            },
          }}
          initialRouteName='home'
        >
          <Tabs.Screen
            name='home'
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ focused }) => {
                if (focused) {
                  return (
                    <Image
                      source={require('../../../assets/Home_Icon_Filled.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                } else {
                  return (
                    <Image
                      source={require('../../../assets/Home_Icon 1.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                }
              },
            }}
          ></Tabs.Screen>
          <Tabs.Screen
            name='library'
            options={{
              headerShown: false,

              title: 'Library',

              tabBarIcon: ({ focused }) => {
                if (focused) {
                  return (
                    <Image
                      source={require('../../../assets/Library_Icon_Filled.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                } else {
                  return (
                    <Image
                      source={require('../../../assets/Library_Icon 1.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                }
              },
            }}
          />

          <Tabs.Screen
            name='discover'
            options={{
              headerShown: false,
              title: 'Discover',
              tabBarIcon: ({ focused }) => {
                if (focused) {
                  return (
                    <Image
                      source={require('../../../assets/Discover_Icon_Filled.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                } else {
                  return (
                    <Image
                      source={require('../../../assets/Discover_Icon 1.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                }
              },
            }}
          />

          <Tabs.Screen
            name='profile'
            options={{
              headerShown: false,
              title: 'Profile',
              tabBarIcon: ({ focused }) => {
                if (focused) {
                  return (
                    <Image
                      source={require('../../../assets/Profile_Filled_Icon 1.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                } else {
                  return (
                    <Image
                      source={require('../../../assets/Profile_Icon 1.png')}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  );
                }
              },
            }}
          />

        </Tabs>

      </View>
    );
  } else {
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: '#202020',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >

        <Image
          source={require('../../../assets/splash.png')}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
        />
      </View>
    );
  }
}
