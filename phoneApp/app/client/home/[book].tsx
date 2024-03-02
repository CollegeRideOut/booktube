import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

export default function BookInfo() {
  const bookId = useGlobalSearchParams();
  const navigation = useRouter();
  const bookInfo = api.book.getBookInfo.useQuery(bookId.book as string);

  console.log('in book we got');
  return (
    <SafeAreaView>
      {bookInfo.data && (
        <View>
          <Image
            source={bookInfo.data.thumbnail!}
            style={{ height: 100, width: 100 }}
          />
          <Text>{bookInfo.data.name}</Text>
          <Text>{bookInfo.data.author}</Text>

          {bookInfo.data.owned ? (
            <View>
              <Pressable
                onPress={() => {
                  console.log('i got pressed');
                  navigation.push({
                    pathname: '/listen/[bookId]',
                    params: { bookId: bookId.book },
                  });
                }}
              >
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
          ) : (
            <View></View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
