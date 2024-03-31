import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

export default function DiscoverIndex() {
  const navigation = useRouter();
  const genres = api.genre.getGenres.useQuery();

  console.log('in book we got');
  return (
    <ScrollView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <SafeAreaView>
        {genres.data && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              width: Dimensions.get('window').width,
            }}
          >
            {genres.data.map((g) => {
              return (
                <Pressable
                  key={g.id}
                  style={{
                    marginBottom: 10,
                    height: 94,
                    width: 164,
                    borderRadius: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'gray',
                  }}
                  onPress={() => {
                    navigation.push({
                      pathname: '/(tabs)/discover/[genreId]',

                      params: { genreId: g.id },
                    });
                  }}
                >
                  <Text style={{ color: 'white' }}>{g.name}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
