import {
  TextInput,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
  TextInputProps,
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

  const searchBarRef = useRef<any>();

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
          width: '100%',
          flex: 1,
        }}
      >
        <View
          style={{
            width: '100%',
            padding: '5%',

            rowGap: 20,
          }}
        >
          {/* header */}
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
                }}
                placeholderTextColor='white'
                placeholder='LIBRARY'
                value={searchTerm}
                onChangeText={(t) => {
                  setSearchTerm(t);
                }}
              />

              {/*  TODO MAKE IMAGE LOOK CORRECTLY
              <Pressable */}
              {/*   onPress={() => { */}
              {/*     searchBarRef.current.focus(); */}
              {/*   }} */}
              {/* > */}
              {/*   <Image */}
              {/*     source={require('../../../../assets/search.png')} */}
              {/*     style={{ */}
              {/*       width: 22, */}
              {/*       position: 'absolute', */}
              {/*       right: 20, */}
              {/*       height: 22.88, */}
              {/*     }} */}
              {/*   /> */}
              {/* </Pressable> */}
            </View>
          </View>

          {/* mainContent */}

          <View style={{ width: '100%', rowGap: 20 }}>
            <View
              style={{ width: '100%', flexDirection: 'row', columnGap: 15 }}
            >
              <Pressable
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
              </Pressable>

              <Pressable
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
              </Pressable>
            </View>

            <View>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                {lib.data?.length} Titles
              </Text>
            </View>

            {lib.data && (
              <View style={{ width: '100%' }}>
                {lib.data.map((l) => {
                  if (libraryTab === 'FAVOURITES') {
                    if (!l.book.favourite) {
                      return null;
                    }
                  }

                  return (
                    <Pressable
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
                          <Pressable>
                            <Text>Info</Text>
                          </Pressable>
                          <Pressable>
                            <Text>heart</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
