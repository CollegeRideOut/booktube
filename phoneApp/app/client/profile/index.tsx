import { Stack, useRouter } from 'expo-router';

import { api } from '../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';

export default function EditType() {
  const userInfoQuery = api.user.userInfo.useQuery();
  const navigation = useRouter();

  return (
    <View>
      <Text>Editying</Text>
      <View>
        <Pressable
          onPress={() => {
            navigation.push({
              pathname: '/client/profile/[editType]',
              params: { editType: 'email' },
            });
          }}
        >
          <Text>Email</Text>
          <Text>{userInfoQuery.data?.email}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigation.push({
              pathname: '/client/profile/[editType]',
              params: { editType: 'name' },
            });
          }}
        >
          <Text>Name</Text>
          <Text>{userInfoQuery.data?.name}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigation.push({
              pathname: '/client/profile/[editType]',
              params: { editType: 'password' },
            });
          }}
        >
          <Text>Password</Text>
          <Text>***********</Text>
        </Pressable>
      </View>
    </View>
  );
}
