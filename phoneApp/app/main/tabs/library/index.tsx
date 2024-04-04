import {
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  TextInputProps,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function LibraryIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [libraryTab, setLibraryTab] = useState<'ALL' | 'FAVOURITES'>('ALL');
  const navigation = useRouter();

  const lib = api.library.getLibrary.useQuery();
  const searchLibMutation = api.library.searchLibrary.useMutation();

  const [libLength, setLibLength] = useState(0)
  const [libFavLength, setLibFavLength] = useState(0)
  const [searchedLength, setSearchedLength] = useState(0)
  const [searchedFavLength, setSearchedFavLength] = useState(0)

  const [searchedLibrary, setSearchedLibrary] = useState<
    {
      book: {
        id: string;
        name: string;
        favourite: boolean;
        rating: number;
        author: string;
        thumbnailLong: string;
      };
      id: string;
    }[]
  >([])


  useEffect(() => {
    if (lib.data) {
      const countFav = lib.data.reduce((acc, l) => {
        if (l.book.favourite) {
          return acc + 1
        } else {
          return acc
        }
      }, 0)

      setLibFavLength(countFav)

      setLibLength(lib.data.length)

    }

  }, [lib.data])


  const searchLibAction = async () => {
    try {
      const searched = await searchLibMutation.mutateAsync(searchTerm)
      setSearchedLibrary(searched)

      const countFavSearch = searchedLibrary.reduce((acc, l) => {
        if (l.book.favourite) {
          return acc + 1
        } else {
          return acc
        }
      }, 0)

      setSearchedFavLength(countFavSearch)

      setSearchedLength(searched.length)



    } catch (error) {
      console.log('error in library/index.ts searching', error)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchLibAction()
      // Send Axios request here
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])
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
          width: '100%',
          flex: 1,
        }}
      >
        <View
          style={{
            width: '100%',
            padding: '5%',
            flex: 1,
            rowGap: 30,
          }}
        >
          {/* header */}
          <View style={{ flexDirection: 'row', height: 24, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 24,
                lineHeight: 24,
                color: 'white',
                fontFamily: 'Inter-600',
              }}
            >
              Library
            </Text>

            <TouchableOpacity onPress={() => {
              navigation.push('/main/tabs/discover/search/')
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

          {/* mainContent */}

          <View style={{ width: '100%', rowGap: 20, flex: 1 }}>
            <View
              style={{ width: '100%', flexDirection: 'row', columnGap: 15 }}
            >
              <TouchableOpacity
                style={{
                  height: 31,
                  width: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: libraryTab === 'ALL' ? 'white' : '#222222',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                }}
                onPress={() => {
                  setLibraryTab('ALL');
                }}
              >
                <Text
                  style={{
                    color: libraryTab === 'ALL' ? 'black' : 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 31,
                  width: 120,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    libraryTab === 'FAVOURITES' ? 'white' : '#222222',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                }}
                onPress={() => {
                  setLibraryTab('FAVOURITES');
                }}
              >
                <Text
                  style={{
                    color: libraryTab === 'FAVOURITES' ? 'black' : 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  Favourites
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                {searchTerm === '' ? (libraryTab === 'ALL' ? libLength : libFavLength) : (libraryTab === 'ALL' ? searchedLength : searchedFavLength)} Titles
              </Text>
            </View>

            {(lib.data && searchTerm === '') && (

              <View style={{ width: '100%', flex: 1 }}>
                <FlatList data={lib.data} keyExtractor={(l) => l.id} renderItem={({ item: l }) => {

                  if (libraryTab === 'FAVOURITES') {
                    if (!l.book.favourite) {
                      return null
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={l.id}
                      style={{
                        width: '100%',
                        height: 153,
                        flexDirection: 'row',
                        columnGap: 20,
                        backgroundColor: '#303030',
                        borderRadius: 5,
                        alignItems: 'center',
                        paddingLeft: '4%',
                      }}
                      onPress={() => {
                        navigation.push({
                          pathname: '/(main)/listen/[libraryId]',
                          params: { libraryId: l.id },
                        });
                      }}
                    >
                      {/* image */}
                      <View>
                        <Image
                          source={{ uri: l.book.thumbnailLong }}
                          style={{ width: 81.64, height: 130, borderRadius: 4 }}
                        />
                      </View>
                      {/* content */}
                      <View
                        style={{
                          rowGap: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '500',
                            fontSize: 18,
                          }}
                        >
                          {l.book.name}
                        </Text>
                        <Text
                          style={{
                            color: '#D9D9D9',
                            fontSize: 14,
                          }}
                        >
                          {l.book.author}
                        </Text>
                        <StarRatingDisplay
                          rating={l.book.rating}
                          style={{ margin: 0, padding: 0 }}
                          emptyColor='#D9D9D9'
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
                          style={{
                            color: '#D9D9D9',
                            fontSize: 14,
                          }}
                        >
                          genre
                        </Text>

                        <View style={{ flexDirection: 'row', columnGap: 20 }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.push({
                                pathname: '/main/tabs/library/[book]',
                                params: { book: l.book.id, routeName: 'library' },
                              });
                            }}
                          >
                            <Text>Info</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Text>heart</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );

                }} />

              </View>
            )}


            {(searchedLibrary && searchTerm !== '') && (

              <View style={{ width: '100%', flex: 1 }}>
                <FlatList data={searchedLibrary} keyExtractor={(l) => l.id} renderItem={({ item: l }) => {

                  if (libraryTab === 'FAVOURITES') {
                    if (!l.book.favourite) {
                      return null
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={l.id}
                      style={{
                        width: '100%',
                        height: 153,
                        flexDirection: 'row',
                        columnGap: 20,
                        backgroundColor: '#303030',
                        borderRadius: 5,
                        alignItems: 'center',
                        paddingLeft: '4%',
                      }}
                      onPress={() => {
                        navigation.push({
                          pathname: '/(main)/listen/[libraryId]',
                          params: { libraryId: l.id },
                        });
                      }}
                    >
                      {/* image */}
                      <View>
                        <Image
                          source={{ uri: l.book.thumbnailLong }}
                          style={{ width: 81.64, height: 130, borderRadius: 4 }}
                        />
                      </View>
                      {/* content */}
                      <View
                        style={{
                          rowGap: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '500',
                            fontSize: 18,
                          }}
                        >
                          {l.book.name}
                        </Text>
                        <Text
                          style={{
                            color: '#D9D9D9',
                            fontSize: 14,
                          }}
                        >
                          {l.book.author}
                        </Text>
                        <StarRatingDisplay
                          rating={l.book.rating}
                          style={{ margin: 0, padding: 0 }}
                          emptyColor='#D9D9D9'
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
                          style={{
                            color: '#D9D9D9',
                            fontSize: 14,
                          }}
                        >
                          genre
                        </Text>

                        <View style={{ flexDirection: 'row', columnGap: 20 }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.push({
                                pathname: '/main/tabs/library/[book]',
                                params: { book: l.book.id },
                              });
                            }}
                          >
                            <Text>Info</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Text>heart</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );

                }} />

              </View>
            )}


          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
