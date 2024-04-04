import {
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { api } from '../../../../util/trpc';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import { useFocusNotifyOnChangeProps } from '../../../../util/stopRerender';
import { useEffect } from 'react';

export default function BookInfo() {
  const { book, routeName } = useGlobalSearchParams();
  const navigation = useRouter();
  const notiffy = useFocusNotifyOnChangeProps() as any

  const bookInfo = api.book.getBookInfo.useQuery(book as string, { enabled: false });
  const similarBooks = api.book.getSimilarBooks.useQuery(book as string, { enabled: false });


  useEffect(() => {
    bookInfo.refetch()
    similarBooks.refetch()
    console.log('i ran ')
  }, [])




  const generatePaymentIntent = api.book.generatePaymentIntent.useMutation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  async function checkout() {
    try {
      const clientSecret = await generatePaymentIntent.mutateAsync({
        bookId: book as string,
      });
      if (clientSecret.clientSecret === null) {
        Alert.alert('something went wrong');
        return;
      }

      const initResposne = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret.clientSecret,
        merchantDisplayName: 'Narrativo',
        //appearance
      });

      if (initResposne.error) {
        console.log(initResposne.error);
        Alert.alert('something went wrong');
        return;
      }

      const a = await presentPaymentSheet();
      bookInfo.refetch();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      {bookInfo.data && (
        <View>
          <View
            style={{
              width: '100%',
              height: 379,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: 274,
                width: Dimensions.get('window').width,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <Image
                source={bookInfo.data.thumbnailSquare!}
                style={{
                  height: 274,
                  width: Dimensions.get('window').width,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                blurRadius={5}
              />
            </View>

            <View>
              <Image
                source={require('../../../../assets/Back_Icon.png')}
                style={{
                  height: 20,
                  width: 20,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </View>
            <Image
              source={bookInfo.data.thumbnailSquare}
              style={{
                height: 274,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 15,
                width: 274,
                position: 'relative',
                bottom: 0,
              }}
            />
          </View>

          <Image
            source={require('../../../../assets/Back_Icon.png')}
            style={{
              height: 26,
              width: 12,
              position: 'absolute',
              zIndex: 50,
              top: 30,
              left: 0,
            }}
          />

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              {bookInfo.data.name}
            </Text>
            <Text style={{ color: '#DBDBDB', fontSize: 16 }}>
              {bookInfo.data.author}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {bookInfo.data.owned ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      console.log('i got pressed');
                      navigation.push({
                        pathname: '/listen/[libraryId]',
                        params: { libraryId: bookInfo.data.librayId },
                      });
                    }}
                    style={{
                      width: 110,
                      height: 31,
                      borderRadius: 5,
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'black', fontSize: 16 }}>Play</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { }}
                    style={{
                      width: 110,
                      height: 31,
                      borderRadius: 5,
                      backgroundColor: '#202020',
                      borderWidth: 1,
                      borderColor: 'white',
                      marginLeft: 20,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#DBDBDB', fontSize: 16 }}>
                      In library
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      console.log('i got pressed');
                      navigation.push({
                        pathname: '/listen/[libraryId]',
                        params: { libraryId: bookInfo.data.librayId },
                      });
                    }}
                    style={{
                      width: 110,
                      height: 31,
                      borderRadius: 5,
                      backgroundColor: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'black', fontSize: 16 }}>Sample</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      checkout();
                    }}
                    style={{
                      width: 110,
                      height: 31,
                      borderRadius: 5,
                      backgroundColor: '#202020',
                      borderWidth: 1,
                      borderColor: 'white',
                      marginLeft: 20,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#DBDBDB', fontSize: 16 }}>Buy</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Duration
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                  }}
                >
                  {bookInfo.data.bookDurationInSeconds}
                </Text>
              </View>
              <View
                style={{ width: 2, height: 30, backgroundColor: 'white' }}
              ></View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Ratings
                </Text>

                <StarRatingDisplay
                  rating={bookInfo.data.rating}
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
              </View>

              <View
                style={{ width: 2, height: 30, backgroundColor: 'white' }}
              ></View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Genre
                </Text>

                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                  }}
                >
                  {bookInfo.data.genre.name}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Summary
              </Text>
              <Text style={{ color: 'white', fontSize: 12 }}>
                {bookInfo.data.summary}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ marginLeft: 10 }}>
        {similarBooks.data && (
          <FlatList
            data={similarBooks.data}
            keyExtractor={(item) => item.id}
            horizontal
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
                    key={b.id}
                    onPress={() => {
                      navigation.push({
                        pathname: '/main/tabs/home/[book]',
                        params: { book: [b.id] },
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
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
      </View>
      {bookInfo.data && (
        <View>
          <View>
            <Text style={{ color: 'white', fontSize: 14 }}>
              What our customers say
            </Text>
            <View>
              <Text style={{ color: 'white', fontSize: 14 }}>
                {bookInfo.data.rating}
              </Text>
              <StarRatingDisplay
                rating={bookInfo.data.rating}
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
            </View>
          </View>

          {bookInfo.data.owned && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.push({
                    pathname: `/main/tabs/${routeName as string}/review/[libraryId]/`,
                    params: {
                      librayId: bookInfo.data.librayId,
                      name: bookInfo.data.name,
                      author: bookInfo.data.author,
                      thumbnailSquare: bookInfo.data.thumbnailSquare,
                      bookId: bookInfo.data.id,
                    },
                  });
                }}
              >
                <Text style={{ color: 'white', fontSize: 14 }}>
                  Leave A review
                </Text>

                <StarRatingDisplay
                  rating={0}
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
              </TouchableOpacity>

              {bookInfo.data.reviews.map((r) => {
                return (
                  <View key={r.id}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                      }}
                    >
                      {r.ratingTitle}
                    </Text>
                    <StarRatingDisplay
                      rating={r.rating ? r.rating : 5}
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
                      style={{
                        color: 'white',
                        fontSize: 14,
                      }}
                    >
                      {r.ratingDescription}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}



