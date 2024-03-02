import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

export default function DiscoverIndex() {
  const navigation = useRouter();
  const genres = api.genre.getGenres.useQuery();

  console.log('in book we got');
  return (
    <SafeAreaView>
      {genres.data && (
        <View>
          {genres.data.map((g) => {
            return (
              <Pressable
                key={g.id}
                onPress={() => {
                  navigation.push({
                    pathname: '/client/discover/[genreId]',
                    params: { genreId: g.id },
                  });
                }}
              >
                <View>
                  <Text>{g.name}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}
