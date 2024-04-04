import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { SplashScreen } from 'expo-router';


//SplashScreen.preventAutoHideAsync()

export default function IndexHome() {
  const navigation = useRouter();
  const gLoLoBo = api.genre.getGLoLoBo.useQuery();
  const featuredBook = api.book.getFeaturedBook.useQuery();

  const [appIsReady, setAppIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {

    if (appIsReady) {

      await SplashScreen.hideAsync();

    }
  }, [appIsReady]);

  useEffect(() => {
    async function prepare() {
      try {

        if (!featuredBook.isLoading && !gLoLoBo.isLoading) {
          setAppIsReady(true)
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [gLoLoBo.isLoading, featuredBook.isLoading]);
  if (!appIsReady) { return null }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
      onLayout={onLayoutRootView}
    >
      <ScrollView
        style={{
          width: Dimensions.get('window').width,
          backgroundColor: '#202020',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <View
          style={{
            display: 'flex',
            rowGap: 30,
            width: '100%',
            flexDirection: 'column',
            padding: '5%',
            flex: 1,
          }}
        >
          {/* header */}
          <View style={{
            flexDirection: 'row',
            height: 24,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Image
              source={require('../../../../assets/logo.png')}
              style={{
                width: 24,
                height: 24,

              }}
            />

            <TouchableOpacity onPress={() => {
              navigation.push('/main/tabs/home/search/')
            }}>
              <Image
                source={require('../../../../assets/search.png')}
                style={{
                  width: 23,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* main body */}
          <View style={{ rowGap: 30 }}>
            {featuredBook.data && (
              <TouchableOpacity
                key={featuredBook.data.id}
                onPress={() => {
                  navigation.push({
                    pathname: '/main/tabs/home/[book]',
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
              </TouchableOpacity>
            )}

            <View style={{ width: '100%', }}>
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
                                <TouchableOpacity
                                  style={{}}
                                  key={b.id}
                                  onPress={() => {
                                    navigation.push({
                                      pathname: '/main/tabs/home/[book]',
                                      params: { book: b.id, routeName: 'home' },
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
                                        padding: '5%',
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
                                </TouchableOpacity>
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
