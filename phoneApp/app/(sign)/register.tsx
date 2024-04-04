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
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../util/trpc';

export default function Register() {
  const navigation = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassowrd, setConfirmPassword] = useState('');

  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      console.log('succes');
    },
    onError: () => {
      console.log('there was a error');
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
          rowGap: 40,
        }}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 28 }}>
            Create your account
          </Text>
        </View>

        <View style={{ width: '100%', rowGap: 20 }}>
          <View style={{ width: '100%', rowGap: 10 }}>
            <Text
              style={{
                color: '#D9D9D9',
                fontSize: 14,
              }}
            >
              Full Name
            </Text>
            <TextInput
              style={{
                color: 'white',
                backgroundColor: '#303030',
                height: 45,
                borderRadius: 5,
                width: '100%',
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
              Email Adress
            </Text>
            <TextInput
              style={{
                color: 'white',
                backgroundColor: '#303030',
                height: 45,
                borderRadius: 5,
                width: '100%',
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
              Choose Password
            </Text>
            <TextInput
              style={{
                color: 'white',
                backgroundColor: '#303030',
                height: 45,
                borderRadius: 5,
                width: '100%',
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
              Confirm Password
            </Text>
            <TextInput
              style={{
                color: 'white',
                backgroundColor: '#303030',
                height: 45,
                borderRadius: 5,
                width: '100%',
              }}
            />
          </View>
        </View>

        <View style={{ width: '100%', rowGap: 10 }}>
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
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.push('/(app)/login');
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#D9D9D9',
            }}
          >
            Already have an account?{' '}
            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
