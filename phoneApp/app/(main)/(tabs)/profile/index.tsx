import { Stack, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

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
      <View
        style={{
          backgroundColor: '#202020',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '5%',
          rowGap: 20,
          width: '100%',
        }}
      >
        {/* header */}

        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: 'white',
              fontFamily: 'Inter-600',
            }}
          >
            Profile
          </Text>
        </View>

        {/* order hist link */}
        {/* singout button */}

        {/* user data  */}

        <View
          style={{
            width: '100%',
            rowGap: 20,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter-600',
              fontSize: 18,
              color: 'white',
            }}
          >
            Personal Info
          </Text>

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
                Full name
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 45,
                  borderWidth: 1,
                  borderColor: '#484848',
                  borderRadius: 5,
                  paddingLeft: '5%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  columnGap: 20,
                }}
              >
                <Image
                  source={require('../../../../assets/UserProfile_Icon.png')}
                  style={{ width: 14, height: 16 }}
                />
                <Text
                  style={{
                    color: '#F8F8F8',
                    top: 1,
                    fontFamily: 'Inter',
                    fontSize: 16,
                  }}
                >
                  {userInfoQuery.data?.name}
                </Text>
              </View>
            </View>

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
                Email
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 45,
                  borderWidth: 1,
                  borderColor: '#484848',
                  borderRadius: 5,
                  paddingLeft: '5%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  columnGap: 20,
                }}
              >
                <Image
                  source={require('../../../../assets/Email_Icon.png')}
                  style={{ width: 17, height: 12 }}
                />
                <Text
                  style={{
                    color: '#F8F8F8',
                    fontFamily: 'Inter',
                    fontSize: 16,
                  }}
                >
                  {userInfoQuery.data?.email}
                </Text>
              </View>
            </View>

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
                Password
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 45,
                  borderWidth: 1,
                  borderColor: '#484848',
                  borderRadius: 5,
                  paddingLeft: '5%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  columnGap: 20,
                }}
              >
                <Image
                  source={require('../../../../assets/Password_Icon.png')}
                  style={{ width: 12, height: 16 }}
                />
                <Text
                  style={{
                    color: '#F8F8F8',
                    fontFamily: 'Inter',
                    top: 3,
                    fontSize: 16,
                  }}
                >
                  *****************
                </Text>
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
              navigation.push('/(main)/(tabs)/profile/oderHistory');
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
              Order History
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
                fontFamily: 'Inter-Bold',
                fontSize: 16,
                color: 'white',
              }}
            >
              Sign out
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
