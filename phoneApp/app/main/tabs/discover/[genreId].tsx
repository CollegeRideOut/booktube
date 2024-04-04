import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function DiscoverGenreId() {
  const navigation = useRouter();

  const { genreId, genreName } = useGlobalSearchParams();
  const books = api.genre.getBooksUnderGenre.useQuery(genreId as string);

  const [searchTerm, setSearchTerm] = useState('');
  const searchBarRef = useRef<any>();

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <View
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
            padding: '5%',
          }}
        >
          {/* header part 1  */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../../assets/Back_Icon.png')}
              style={{
                width: 11.81,

                position: 'absolute',
                top: 3,
                height: 20,
              }}
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: 'white',
                  fontFamily: 'Inter-600',
                }}
              >
                {genreName}
              </Text>
            </View>
          </View>

          {/* header part 2 */}
          <View
            style={{
              width: '100%',
            }}
          >
            <View
              style={{
                width: '100%',
                backgroundColor: '#303030',
                height: 45,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',

                alignItems: 'center',
              }}
            >
              <TextInput
                ref={searchBarRef}
                style={{
                  color: 'white',
                  width: '100%',
                  paddingLeft: '5%',
                  backgroundColor: '#303030',
                  borderRadius: 5,
                  fontWeight: 'bold',
                  height: 45,
                  fontFamily: 'Inter-Bold',
                }}
                placeholderTextColor='white'
                placeholder='SEARCH TITLES'
                value={searchTerm}
                onChangeText={(t) => {
                  setSearchTerm(t);
                }}
              />
            </View>
          </View>

          {/* main content */}
          <View
            style={{
              flex: 1
            }}
          >
            {books.data &&
              <FlatList data={books.data} style={{

                rowGap: 30,
                flexDirection: 'column',
                height: '100%',
                flexWrap: 'wrap',
                columnGap: 30,
              }} keyExtractor={(b) => b.id}
                renderItem={({ item: b }) => {
                  return (

                    <View
                      key={b.id}
                      style={{
                        width: 150,
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
                                width: 150,
                                height: 218,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              width: 150,
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
                  )
                }}
              />}
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}
