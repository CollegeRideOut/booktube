import {
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  TextInput,
} from 'react-native';
import { api } from '../../../../../util/trpc';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';

import StartRating from 'react-native-star-rating-widget';

export default function CreateReview() {
  const { librayId, bookId, name, author, thumbnailSquare } =
    useGlobalSearchParams();
  const navigation = useRouter();
  const submitReview = api.library.writeReview.useMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);

  return (
    <ScrollView
      style={{
        backgroundColor: '#202020',
        width: Dimensions.get('window').width,
        flex: 1,
      }}
    >
      <View>
        <View
          style={{
            width: '100%',
            height: 332,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: 236,
              width: Dimensions.get('window').width,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Image
              source={thumbnailSquare!}
              style={{
                height: 236,
                width: Dimensions.get('window').width,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              blurRadius={5}
            />
          </View>
          <Image
            source={thumbnailSquare}
            style={{
              height: 244,
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 15,
              width: 274,
              position: 'relative',
              bottom: 0,
            }}
          />
        </View>

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
            {name}
          </Text>
          <Text style={{ color: '#DBDBDB', fontSize: 16 }}>{author}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          ></View>
        </View>
      </View>
      <View
        style={{
          height: 391,
          width: '100%',
          borderRadius: 10,
          backgroundColor: '#303030',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 15,
          }}
        >
          Leave Review
        </Text>

        <View style={{ margin: 20 }}>
          <View>
            <StartRating rating={rating} onChange={(e) => setRating(e)} />
          </View>

          <Text
            style={{
              color: 'white',
              fontSize: 15,
            }}
          >
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={(t) => {
              setTitle(t);
            }}
            style={{
              width: 210,
              height: 33,
              color: 'white',
              backgroundColor: '#3D3D3D',
              borderRadius: 7,
            }}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 15,
            }}
          >
            Review
          </Text>

          <TextInput
            multiline
            value={description}
            onChangeText={(t) => {
              setDescription(t);
            }}
            style={{
              width: 210,
              height: 105,
              color: 'white',
              backgroundColor: '#3D3D3D',
              borderRadius: 7,
            }}
          />
          <TouchableOpacity
            onPress={async () => {
              try {
                const val = await submitReview.mutateAsync({
                  title: title,
                  description: description,
                  rating: rating,
                  libraryId: librayId as string,
                  bookId: bookId as string,
                });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 15,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
