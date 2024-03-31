import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateInfo() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <View>
        <Text style={{ color: 'white' }}>Current Password</Text>
        <TextInput
          value={password}
          style={{ color: 'white' }}
          onChangeText={(t) => {
            setPassword(t);
          }}
        />

        <Text style={{ color: 'white' }}>New Password</Text>
        <TextInput
          value={newPassword}
          style={{ color: 'white' }}
          onChangeText={(t) => {
            setNewPassword(t);
          }}
        />

        <Text style={{ color: 'white' }}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          style={{ color: 'white' }}
          onChangeText={(t) => {
            setConfirmPassword(t);
          }}
        />
      </View>

      <Pressable>
        <Text style={{ color: 'white' }}>Update Password</Text>
      </Pressable>
    </SafeAreaView>
  );
}
