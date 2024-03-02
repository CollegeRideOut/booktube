import { Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider } from '../../util/trpc';
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
    };
    checkingToken();
  }, []);

  if (!token) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  } else {
    return (
      <AuthTRPCProvider token={token!}>
        <Stack screenOptions={{ headerShown: false }} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Pressable
            onPress={() => {
              navigation.push('/client/');
            }}
          >
            <View
              style={{
                height: 20,
              }}
            >
              <Text>Home</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.push('/client/library');
            }}
          >
            <View
              style={{
                height: 20,
              }}
            >
              <Text>library</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.push('/client/discover');
            }}
          >
            <View
              style={{
                height: 20,
              }}
            >
              <Text>Discover</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.push('/client/profile');
            }}
          >
            <View
              style={{
                height: 20,
              }}
            >
              <Text>Profile</Text>
            </View>
          </Pressable>
        </View>
      </AuthTRPCProvider>
    );
  }
}
