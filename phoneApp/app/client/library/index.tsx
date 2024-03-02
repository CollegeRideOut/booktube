import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

export default function LibraryIndex() {
  const navigation = useRouter();
  const lib = api.library.getLibrary.useQuery();

  console.log('in book we got');
  return (
    <SafeAreaView>
      {lib.data && (
        <View>
          {lib.data.map((lib) => {
            return (
              <View key={lib.book.id}>
                <Pressable>
                  <Image
                    source={lib.book.thumbnail!}
                    style={{ height: 100, width: 100 }}
                  />
                  <Text>{lib.book.name}</Text>
                  <Text>{lib.book.author}</Text>
                </Pressable>

                <View>
                  <Pressable>
                    <Text>Play</Text>
                  </Pressable>

                  <Pressable>
                    <Text>In your library</Text>
                  </Pressable>

                  <Pressable>
                    <Text>Like</Text>
                  </Pressable>

                  <Pressable>
                    <Text>Super Like</Text>
                  </Pressable>

                  <Pressable>
                    <Text>Dislike</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}
