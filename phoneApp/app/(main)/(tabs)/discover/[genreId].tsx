import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function DiscoverGenreId() {
  const navigation = useRouter();

  const { genreId } = useGlobalSearchParams();
  const books = api.genre.getBooksUnderGenre.useQuery(genreId as string);

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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            width: Dimensions.get('window').width,
          }}
        >
          {books.data &&
            books.data.map((b) => {
              return (
                <View
                  key={b.id}
                  style={{
                    width: 136,
                    height: 261,
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                >
                  <Pressable
                    key={b.id}
                    onPress={() => {
                      navigation.push({
                        pathname: '/(tabs)/home/[book]',
                        params: { book: b.id },
                      });
                    }}
                  >
                    <View>
                      <View>
                        <Image
                          source={b.thumbnailLong!}
                          alt='hello why is not working'
                          style={{ width: 136, height: 199 }}
                        />
                      </View>
                      <View
                        style={{
                          width: 136,
                          height: 62,

                          backgroundColor: '#3B3B3B',
                        }}
                      >
                        <View style={{ marginLeft: 10 }}>
                          <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              flexWrap: 'nowrap',
                              fontSize: 14,
                            }}
                          >
                            {b.name}
                          </Text>

                          <StarRatingDisplay
                            rating={b.rating}
                            style={{ margin: 0, padding: 0 }}
                            starStyle={{
                              margin: 0,
                              padding: 0,
                              marginHorizontal: 0,
                            }}
                            maxStars={5}
                            starSize={15}
                            enableHalfStar
                          />

                          <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                              color: '#D9D9D9',
                            }}
                          >
                            {b.author}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
