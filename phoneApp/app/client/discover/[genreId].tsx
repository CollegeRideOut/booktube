import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../util/trpc';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function DiscoverGenreId() {
  const navigation = useRouter();
  const genre = useGlobalSearchParams();
  const books = api.genre.getBooksUnderGenre.useQuery(genre.genreId as string);

  return (
    <SafeAreaView>
      {books.data && (
        <View>
          {books.data.map((b) => {
            return (
              <View key={b.id}>
                <Pressable>
                  <Image
                    source={b.thumbnail!}
                    style={{ height: 100, width: 100 }}
                  />
                  <Text>{b.name}</Text>
                  <Text>{b.author}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}
