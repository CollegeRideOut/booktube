import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateInfo() {
  const { name, email } = useGlobalSearchParams();

  const [nameT, setName] = useState('');
  const [emailT, setEmail] = useState('');

  useEffect(() => {
    setName(name as string);
    setEmail(email as string);
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <Text style={{ color: 'white' }}>Personal Info</Text>
      <View>
        <Text style={{ color: 'white' }}>Full name</Text>
        <TextInput
          value={nameT}
          style={{ color: 'white' }}
          onChangeText={(t) => {
            setName(t);
          }}
        />

        <Text style={{ color: 'white' }}>Email</Text>
        <TextInput
          value={emailT}
          style={{ color: 'white' }}
          onChangeText={(t) => {
            setEmail(t);
          }}
        />
      </View>

      <Pressable>
        <Text style={{ color: 'white' }}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  );
}
