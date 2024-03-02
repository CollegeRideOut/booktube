import { StatusBar } from 'expo-status-bar';
import {
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

export default function Register() {
  const navigation = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const a = api.auth.login.useMutation({
    onSuccess: () => {
      console.log('succes');
    },
    onError: () => {
      console.log('there was a error');
    },
  });

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <View>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <Text>name</Text>
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />

        <Text>Password:</Text>
        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>

      <Pressable
        onPress={async () => {
          try {
            navigation.push('/register');
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Text>Register</Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          navigation.push('/');
        }}
      >
        <Text>Log In</Text>
      </Pressable>
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
