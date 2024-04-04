import {
  Dimensions,
  TouchableOpacity,
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
            rowGap: 30,
            width: '100%',
            flexDirection: 'column',
            flex: 1,
            padding: '5%',
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
              Discover
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

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              rowGap: (Dimensions.get('window').width * 0.9) - (155 * 2)
            }}
          >
            {genres.data &&
              genres.data.map((g) => {
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={{ width: 155, height: 87 }}
                    onPress={() => {
                      navigation.push({
                        pathname: '/main/tabs/discover/[genreId]',
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
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
