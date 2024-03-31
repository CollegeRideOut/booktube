import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../util/trpc';
import { useEffect, useState, useRef } from 'react';
import { Image, ImageBackground } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

export default function DiscoverIndex() {
  const navigation = useRouter();
  const genres = api.genre.getGenres.useQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const searchBarRef = useRef<any>();


  console.log('in book we got');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#202020',
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

            padding: '5%',
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
                  fontFamily: 'Inter-Bold',
                }}
                placeholderTextColor='white'
                placeholder='DISCOVER'
                value={searchTerm}
                onChangeText={(t) => {
                  setSearchTerm(t);
                }}
              />
            </View>
          </View>

          <View
            style={{
              rowGap: 20,
              flexDirection: 'row',
              flexWrap: 'wrap',
              columnGap: 20,
            }}
          >
            {genres.data &&
              genres.data.map((g) => {
                return (
                  <Pressable
                    key={g.id}
                    style={{ width: 155, height: 87 }}
                    onPress={() => {
                      navigation.push({
                        pathname: '/(main)/(tabs)/discover/[genreId]',
                        params: { genreId: g.id, genreName: g.name },
                      });
                    }}
                  >
                    <ImageBackground
                      source={require('../../../../assets/genreLogo.png')}
                      style={{
                        width: 155,
                        padding: '5%',
                        height: 87,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Inter-Bold',
                          color: 'white',

                          textAlign: 'center',
                        }}
                      >
                        {g.name}
                      </Text>
                    </ImageBackground>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
