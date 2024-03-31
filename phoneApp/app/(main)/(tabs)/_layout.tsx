import { Stack, useNavigation, useRouter } from 'expo-router';

import { AuthTRPCProvider, api } from '../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <View>
        <Text>TAB LAYOUT LOADING</Text>
      </View>
    );
  } else if (authorized === authorizationState.AUTHRORIZED) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: '#141414',
            borderWidth: 0,
            borderTopColor: '#141414', 
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,

            width: Dimensions.get('window').width,
            position: 'absolute',
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

        <Tabs.Screen
          name='review/[libraryId]'
          options={{
            headerShown: false,
            title: 'review create',
            href: null,
          }}
        />
      </Tabs>
    );
  }
}
