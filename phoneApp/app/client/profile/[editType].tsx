import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { api } from '../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';

export default function UpdateInfo() {
  const userInfoQuery = api.user.userInfo.useQuery();
  const editType = useGlobalSearchParams();

  const [type, setType] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userInfoQuery.data) {
      if (editType.editType === 'name') {
        setType(userInfoQuery.data.name);
      } else if (editType.editType === 'email') {
        setType(userInfoQuery.data.email);
      }
    }
  }, [userInfoQuery.data]);

  return (
    <View>
      <Text>Profile Tab</Text>
      <View>
        {editType.editType !== 'password' ? (
          <View>
            <Text>{editType.editType}</Text>
            <TextInput
              value={type}
              onChangeText={(text) => {
                setType(text);
              }}
            />
          </View>
        ) : (
          <View>
            <View>
              <Text> Old Password</Text>
              <TextInput
                value={oldPassword}
                onChangeText={(text) => {
                  setOldPassword(text);
                }}
              />
            </View>
            <View>
              <Text>New Password</Text>

              <TextInput
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                }}
              />
            </View>
            <View>
              <Text> Confirm Password</Text>

              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
