import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { TRPCProvider } from '../../util/trpc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../util/trpc';

export default function Login() {
  const navigation = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutate = api.auth.login.useMutation({
    onSuccess: async (data) => {
      const t = await AsyncStorage.getItem('token');
      await AsyncStorage.setItem('token', data.token);

      navigation.push('/(tabs)/home/');
    },
    onError: (error) => {
      console.log('there was a error', error);
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#202020',
        opacity: 1,
      }}
    >
      <View
        style={{
          display: 'flex',
          paddingLeft: '10%',
          paddingRight: '10%',
          height: Dimensions.get('window').height,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 80,
        }}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '900',
              fontSize: 28,
              textAlign: 'center',
            }}
          >
            Sign in to {'\n'} your account
          </Text>
        </View>

        <View style={{ width: '100%', rowGap: 40 }}>
          <View style={{ width: '100%', rowGap: 20 }}>
            <View style={{ width: '100%', rowGap: 10 }}>
              <Text
                style={{
                  color: '#D9D9D9',
                  fontSize: 14,
                }}
              >
                Email Address
              </Text>
              <TextInput
                style={{
                  color: 'white',
                  backgroundColor: '#303030',
                  height: 45,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                }}
              />
            </View>

            <View style={{ width: '100%', rowGap: 10 }}>
              <Text
                style={{
                  color: '#D9D9D9',
                  fontSize: 14,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  color: 'white',
                  backgroundColor: '#303030',
                  height: 45,
                  borderRadius: 5,
                  width: '100%',
                }}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                }}
              />
            </View>
          </View>

          <View style={{ width: '100%', rowGap: 10 }}>
            <Pressable
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: 41,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 5,
                justifyContent: 'center',
              }}
              onPress={async () => {
                try {
                  const token = await loginMutate.mutateAsync({
                    email: email,
                    password: password,
                  });

                  await AsyncStorage.setItem('token', token.token);
                  navigation.push('/(main)/(tabs)/home');
                } catch (error) {}
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: 16,
                }}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={{
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.push('/(app)/register');
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#D9D9D9',
            }}
          >
            Dont have an account?{' '}
            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Register
            </Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
