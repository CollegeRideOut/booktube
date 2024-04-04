import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../util/trpc';
import { Image } from 'expo-image';
import { SplashScreen } from "expo-router";

//SplashScreen.preventAutoHideAsync();

export default function AppIndex() {
  const navigation = useRouter();

  useEffect(() => {
    const checkIfHasToken = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        navigation.push('/main/tabs/home');
      } else {
        setAppIsReady(true)
      }
    };
    checkIfHasToken();
  }, []);


  const [appIsReady, setAppIsReady] = useState(false);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) { return null }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#202020',
        opacity: 1,
      }}
      onLayout={onLayoutRootView}
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
              fontFamily: 'Inter-800',
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
              fontFamily: 'Inter',
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
          <TouchableOpacity
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
              navigation.push('//register');
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontFamily: 'Inter-Bold',
                textTransform: 'uppercase',
                fontSize: 16,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
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
              navigation.push('/login');
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontFamily: 'Inter-Bold',
                fontSize: 16,
                color: 'white',
              }}
            >
              Sign in
            </Text>
          </TouchableOpacity>
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
              fontFamily: 'Inter',
              color: '#D9D9D9',
            }}
          >
            By signing up you are agreeing to the
          </Text>
          <Text
            style={{
              fontSize: 12,

              fontFamily: 'Inter-Bold',
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
