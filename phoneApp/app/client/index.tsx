import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function IndexHome() {
  const navigation = useRouter();
  const gLoLoBo = api.genre.getGLoLoBo.useQuery();

  return (
    <SafeAreaView>
      <View>
        <Text>Hello im logged in</Text>
        {gLoLoBo.data &&
          gLoLoBo.data.map((g) => {
            return (
              <View key={g.id}>
                <Text>{g.name}</Text>
                <View>
                  {g.books.map((b) => {
                    return (
                      <Pressable
                        key={b.id}
                        onPress={() => {
                          navigation.push({
                            pathname: '/client/home/[book]',
                            params: { book: [b.id] },
                          });
                        }}
                      >
                        <View>
                          <View>
                            <Image
                              source={b.thumbnail!}
                              alt='hello why is not working'
                              style={{ height: 40, width: 40 }}
                            />
                          </View>
                          <View>
                            <Text>Name: {b.name}</Text>

                            <Text>Author: {b.author}</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
      </View>
    </SafeAreaView>
  );
}
