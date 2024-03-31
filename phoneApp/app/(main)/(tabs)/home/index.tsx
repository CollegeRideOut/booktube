import {
  Dimensions,
  Pressable,
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function IndexHome() {
  const navigation = useRouter();
  const gLoLoBo = api.genre.getGLoLoBo.useQuery();
  const featuredBook = api.book.getFeaturedBook.useQuery();

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          backgroundColor: '#202020',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          rowGap: 20,
        }}
      >
        <View
          style={{
            display: 'flex',
            rowGap: 20,
            width: '100%',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {/* header */}
          <View style={{ flexDirection: 'row', columnGap: 30 }}>
            <Image
              source={require('../../../../assets/logo.png')}
              style={{
                width: 36,
                height: 36,
              }}
            />

            <Image
              source={require('../../../../assets/search.png')}
              style={{
                width: 19,
                height: 19,
              }}
            />
          </View>

          {/* main body */}
          <View style={{ paddingLeft: '3%', paddingRight: '3%', rowGap: 30 }}>
            {featuredBook.data && (
              <Pressable
                key={featuredBook.data.id}
                onPress={() => {
                  navigation.push({
                    pathname: '/(tabs)/home/[book]',
                    params: { book: featuredBook.data.id },
                  });
                }}
              >
                <View>
                  <Image
                    source={featuredBook.data.thumbnailSquare}
                    style={{
                      width: '100%',
                      height: 295,

                      borderRadius: 5,
                    }}
                  />
                </View>

                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(70, 70, 70, 0.5)',
                    position: 'absolute',
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    bottom: 0,
                    height: 58,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white' }}>
                    By {featuredBook.data.author}
                  </Text>
                </View>
              </Pressable>
            )}

            <View style={{ width: '100%' }}>
              {gLoLoBo.data &&
                gLoLoBo.data.map((g) => {
                  return (
                    <View key={g.id} style={{ rowGap: 5 }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '900',
                          fontSize: 20,
                        }}
                      >
                        {g.name}
                      </Text>
                      <View>
                        <FlatList
                          data={g.books}
                          horizontal
                          keyExtractor={(item) => item.id}
                          renderItem={({ item: b }) => {
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
                                  style={{}}
                                  key={b.id}
                                  onPress={() => {
                                    navigation.push({
                                      pathname: '/(tabs)/home/[book]',
                                      params: { book: b.id },
                                    });
                                  }}
                                >
                                  <View style={{}}>
                                    <View>
                                      <Image
                                        source={b.thumbnailLong!}
                                        alt='hello why is not working'
                                        style={{
                                          borderTopLeftRadius: 8,
                                          borderTopRightRadius: 8,
                                          width: 136,
                                          height: 199,
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        width: 136,
                                        height: 72,
                                        paddingLeft: '5%',
                                        paddingTop: '5%',
                                        borderBottomLeftRadius: 8,
                                        borderBottomRightRadius: 8,
                                        backgroundColor: '#3B3B3B',
                                      }}
                                    >
                                      <View style={{ rowGap: 5 }}>
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
                                          color='#FFCA0E'
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
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
