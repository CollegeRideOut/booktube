import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function UpdateInfo() {
  const { type, value } = useGlobalSearchParams();

  const [valueT, setValueT] = useState(value as string);
  const navigation = useRouter();
  const utils = api.useUtils()

  const updateFullNameMutation = api.user.updateFullName.useMutation()
  const updateEmailMutation = api.user.updateEmail.useMutation()


  const saveChanges = async () => {

    try {

      if (type === 'email') {
        const ok = await updateEmailMutation.mutateAsync({ email: valueT })
      } else {
        const ok = await updateFullNameMutation.mutateAsync({ name: valueT })
      }
      await utils.user.userInfo.prefetch()
      navigation.back()

    } catch (error) {

    }
  }


  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: '#202020',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '5%',
          rowGap: 30,
          width: '100%',
        }}
      >
        {/* header */}

        <TouchableOpacity
          style={{ height: 24, width: '100%', flexDirection: 'row', alignItems: 'center' }}
          onPress={() => { navigation.back() }}
        >
          <Image
            source={require('../../../../assets/Back_Icon.png')}
            style={{
              width: 12,
              height: 24,
            }}
          />

          <Text
            style={{
              fontSize: 24,
              marginLeft: 20,
              lineHeight: 24,
              color: 'white',
              fontFamily: 'Inter-600',
            }}
          >
            Edit profile
          </Text>

        </TouchableOpacity>

        {/* order hist link */}
        {/* singout button */}

        {/* user data  */}

        <View
          style={{
            width: '100%',
            rowGap: 30,
          }}
        >
          <View
            style={{
              width: '100%',

              rowGap: 20,
            }}
          >


            <View
              style={{
                width: '100%',
                rowGap: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: '#A9A9A9',
                }}
              >
                {type === 'email' ? 'Email' : 'Full name'}
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 45,
                  borderWidth: 1,
                  borderColor: '#303030',
                  borderRadius: 5,
                  flexDirection: 'row',
                  columnGap: 20,
                }}
              >
                <TextInput
                  style={{
                    color: 'white',
                    width: '100%',
                    paddingLeft: '5%',
                    backgroundColor: '#303030',
                    borderRadius: 5,
                    fontWeight: 'bold',
                    height: 45,
                    fontFamily: 'Inter-Bold',
                  }}
                  value={valueT}
                  onChangeText={(t) => { setValueT(t) }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* user button */}

        <View
          style={{
            width: '100%',
            rowGap: 15,
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


              saveChanges()

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
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>

  );
}



