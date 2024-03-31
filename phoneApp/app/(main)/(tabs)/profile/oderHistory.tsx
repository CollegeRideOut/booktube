import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { api } from '../../../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function UpdateInfo() {
  const { name, email } = useGlobalSearchParams();
  const libraryInfo = api.library.getLibraryOrderHistory.useQuery();

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
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '5%',
          rowGap: 20,
          width: '100%',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../../assets/Back_Icon.png')}
            style={{
              width: 11.81,
              top: 3,
              position: 'absolute',
              height: 20,
            }}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',

              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                fontFamily: 'Inter-600',
              }}
            >
              Order History
            </Text>
          </View>
        </View>

        {libraryInfo.data && (
          <FlatList
            data={libraryInfo.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.id}
                  style={{
                    width: '100%',
                    height: 153,
                    flexDirection: 'row',
                    columnGap: 20,
                    backgroundColor: '#303030',
                    borderRadius: 5,
                    alignItems: 'center',
                    paddingLeft: '4%',
                  }}
                >
                  {/* image */}
                  <View>
                    <Image
                      source={{ uri: item.book.thumbnailLong }}
                      style={{ width: 81.64, height: 130, borderRadius: 4 }}
                    />
                  </View>
                  {/* content */}
                  <View
                    style={{
                      rowGap: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontFamily: 'Inter-500',
                        fontSize: 18,
                      }}
                    >
                      {item.book.name}
                    </Text>
                    <Text
                      style={{
                        color: '#D9D9D9',
                        fontFamily: 'Inter',
                        fontSize: 14,
                      }}
                    >
                      {item.createdAt}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: 'Inter-Bold',
                      }}
                    >
                      ${item.book.price}
                    </Text>

                    <Text
                      style={{
                        color: '#57FF3B',
                        fontFamily: 'Inter',
                        fontSize: 14,
                      }}
                    >
                      Success
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
