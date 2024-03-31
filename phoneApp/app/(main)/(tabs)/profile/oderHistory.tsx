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
          margin: 20,
          flex: 1,
        }}
      >
        {libraryInfo.data && (
          <FlatList
            data={libraryInfo.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    height: 153,
                    width: '100%',
                    backgroundColor: '#3B3B3B',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View>
                      <Image
                        source={item.book.thumbnailLong!}
                        style={{ height: 130, width: 81.6 }}
                      />
                    </View>
                    <View>
                      <Text style={{ color: 'white' }}>{item.book.name}</Text>
                      <Text style={{ color: 'white' }}>{item.createdAt}</Text>
                      <Text style={{ color: 'white' }}>{item.book.price}</Text>
                    </View>
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
