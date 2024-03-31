import { Stack, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditType() {
  const userInfoQuery = api.user.userInfo.useQuery();
  const navigation = useRouter();

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      {userInfoQuery.data && (
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: Dimensions.get('window').width * 0.3,
                height: Dimensions.get('window').width * 0.3,
                borderRadius: (Dimensions.get('window').width * 0.3) / 2,
                backgroundColor: 'blue',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>
                {userInfoQuery.data?.name[0]} {userInfoQuery.data?.name[1]}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                navigation.push('(tabs)/profile/oderHistory');
              }}
            >
              <Text>Oder History</Text>
            </Pressable>
          </View>

          <View>
            <Text style={{ color: 'white', fontSize: 16 }}>Email</Text>
            <Text style={{ color: 'white', fontSize: 16 }}>
              {userInfoQuery.data?.email}
            </Text>

            <Text style={{ color: 'white', fontSize: 16 }}>Name</Text>
            <Text style={{ color: 'white', fontSize: 16 }}>
              {userInfoQuery.data?.name}
            </Text>

            <Text style={{ color: 'white', fontSize: 16 }}>Password</Text>
            <Text style={{ color: 'white', fontSize: 16 }}>***********</Text>
          </View>

          <View>
            <Pressable
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                navigation.push('/');
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Sing out</Text>
            </Pressable>
          </View>

          <View>
            <Pressable
              onPress={() => {
                navigation.navigate({
                  pathname: '/(tabs)/profile/editProfile',
                  params: {
                    name: userInfoQuery.data.name,
                    email: userInfoQuery.data.email,
                  },
                });
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Edit Profile</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                navigation.navigate({
                  pathname: '/(tabs)/profile/changePassword',
                });
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>
                Update Password
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
