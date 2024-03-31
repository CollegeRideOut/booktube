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
import { Image } from 'expo-image';

export default function Login() {
  const navigation = useRouter();

  useEffect(() => {
    const checkIfHasToken = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        navigation.push('/(main)/(tabs)/home');
      }
    };
    checkIfHasToken();
  }, []);

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
          rowGap: 30,
        }}
      >
        <View>
          <Image
            source={require('../../assets/logo.png')}
            style={{ height: 100, width: 96.9 }}
          />
        </View>
        <View
          style={{
            rowGap: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '800',
              fontSize: 40,
            }}
          >
            Get Started
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#D9D9D9',
              fontWeight: '400',
              fontSize: 14,
            }}
          >
            Dive into a World of Stories with Captivating Narratives and
            Stunning Visuals
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            rowGap: 20,
          }}
        >
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
            onPress={() => {
              navigation.push('/(app)/register');
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: 16,
              }}
            >
              Register
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: '#222222',
              width: '100%',
              height: 41,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 5,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#5C5C5C',
            }}
            onPress={() => {
              navigation.push('/(app)/login');
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: 16,
                color: 'white',
              }}
            >
              Sing in
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#D9D9D9',
            }}
          >
            By signing up you are agreeing to the
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#D9D9D9',
            }}
          >
            Terms & Conditions and Privacy policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
