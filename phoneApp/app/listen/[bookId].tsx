import * as React from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel, { TAnimationStyle } from 'react-native-reanimated-carousel';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../util/trpc';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Video, Audio, ResizeMode } from 'expo-av';

import { Arrow, ArrowDirection } from './Arrow';

export default function ListenToBook() {
  const bookId = useGlobalSearchParams();
  const navigation = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioStream, setAudioStream] = useState<Audio.SoundObject>();
  const [currentLine, setCurrentLine] = useState<any>({});
  const [currentIdxLoVs, setCurrentIdxLoVs] = useState(-1);
  const [allLovs, setAllVs] = useState<
    {
      id: string;
      createdAt: string | null;
      updatedAt: string | null;
      path: string;
    }[]
  >([]);

  const loABo = api.audiobook.getLoABoWithSubs.useQuery(
    bookId.bookId as string,
  );
  const video = useRef(null);
  const loVs = api.video.getLoVi.useQuery({ cursor: 5 });
  const book = api.book.getBook.useQuery(bookId.bookId as string);

  const [currentSubs, setCurrentSubs] = useState<any>();

  const [currentAbo, setCurretnABo] = useState<{
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    author: string;
    bookId: string;
    language: 'ENGLISH' | 'SPANISH';
    audio: string;
    subs: {
      id: string;
      language: 'ENGLISH' | 'SPANISH';
      audiobookId: string;
      path: string;
    }[];
  }>();

  const [currentVs, setCurrentVs] = useState<{
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    path: string;
  }>();

  useEffect(() => {
    let soundObj: Audio.SoundObject;
    const getData = async () => {
      if (loABo.data) {
        const audio = loABo.data[0];
        setCurretnABo(audio);

        const subs = await (
          await fetch(audio.subs[0].path, { method: 'GET' })
        ).json();
        setCurrentSubs(subs);

        setCurrentLine(subs.events[0]);
        soundObj = await Audio.Sound.createAsync(
          { uri: audio.audio },
          { shouldPlay: false, progressUpdateIntervalMillis: 200 },
        );

        setAudioStream(soundObj);
      }
    };
    getData();

    return () => {
      if (soundObj) {
        soundObj.sound.unloadAsync();
      }
    };
  }, [loABo.data]);

  useEffect(() => {
    if (loVs.data) {
      const allVsCopy = [...allLovs];
      allVsCopy.push(...loVs.data);
      setAllVs(allVsCopy);
    }
  }, [loVs.data]);

  useEffect(() => {
    if (currentIdxLoVs === -1 && allLovs.length > 0) {
      console.log('setting current idx to 0');
      setCurrentIdxLoVs(0);
    }
  }, [allLovs]);

  useEffect(() => {
    if (audioStream && video.current) {
      audioStream.sound._onPlaybackStatusUpdate = (status) => {
        /* const value = (audioStream.currentTime / audioStream.duration) * 100; */
        /* progressBar.value = "" + value; */

        if (!(status as any).isPlaying && video.current) {
          (video.current! as Video).pauseAsync();
        }

        if (currentLine && currentSubs) {
          const t = (status as any).positionMillis * 1000;
          if (currentLine.start < t || currentLine.end > t) {
            let val =
              currentSubs.events.find((ee: any) => {
                return t >= ee.start && t <= ee.end;
              }) || currentLine;
            setCurrentLine(val);
          }
        }
      };
    }
  }, [audioStream, video.current]);

  const headerHeight = 100;
  const PAGE_WIDTH = Dimensions.get('window').width;
  const PAGE_HEIGHT = Dimensions.get('window').height;
  const directionAnim = useSharedValue<ArrowDirection>(
    ArrowDirection.IS_VERTICAL,
  );
  const [isVertical, setIsVertical] = React.useState(true);

  const animationStyle: TAnimationStyle = React.useCallback(
    (value: number) => {
      'worklet';
      const translateY = interpolate(value, [-1, 0, 1], [-PAGE_HEIGHT, 0, 0]);

      const translateX = interpolate(value, [-1, 0, 1], [-PAGE_WIDTH, 0, 0]);

      const zIndex = interpolate(value, [-1, 0, 1], [300, 0, -300]);

      const scale = interpolate(value, [-1, 0, 1], [1, 1, 0.85]);

      return {
        transform: [isVertical ? { translateY } : { translateX }, { scale }],
        zIndex,
      };
    },
    [PAGE_HEIGHT, PAGE_WIDTH, isVertical],
  );

  useAnimatedReaction(
    () => directionAnim.value,
    (direction) => {
      switch (direction) {
        case ArrowDirection.IS_VERTICAL:
          runOnJS(setIsVertical)(true);
          break;
        case ArrowDirection.IS_HORIZONTAL:
          runOnJS(setIsVertical)(false);
          break;
      }
    },
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          zIndex: 5,
        }}
        vertical={isVertical}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={allLovs}
        renderItem={({ item, animationValue, index }) => {
          return (
            <View
              style={{
                flex: 1,
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                alignSelf: 'stretch',
                zIndex: 5,
              }}
            >
              <Video
                shouldPlay={isPlaying}
                resizeMode={ResizeMode.STRETCH}
                ref={video}
                isLooping
                source={{ uri: item.path }}
                volume={0}
                style={{
                  flex: 1,
                  height: Dimensions.get('window').height,
                  width: Dimensions.get('window').width,
                  alignSelf: 'stretch',
                  zIndex: 5,
                }}
              />

              {currentSubs && (
                <View
                  style={{
                    zIndex: 20,
                    flexDirection: 'row',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    alignItems: 'center',
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      height: 100,
                      width: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {currentLine && currentLine.text}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        customAnimation={animationStyle}
      />

      {audioStream && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            height: 40,
            zIndex: 50,
            bottom: 10,
            width: Dimensions.get('window').width,
            backgroundColor: 'red',
          }}
        >
          <Pressable
            onPress={() => {
              if (isPlaying) {
                audioStream.sound.pauseAsync();

                setIsPlaying(false);
              } else {
                audioStream.sound.playAsync();

                setIsPlaying(true);
              }
            }}
          >
            <View>
              <Text>PlayButton this button not working</Text>
            </View>
          </Pressable>

          <Pressable>
            <View>
              <Text>Prev 10</Text>
            </View>
          </Pressable>

          <Pressable>
            <View>
              <Text>Next 10</Text>
            </View>
          </Pressable>

          <Pressable>
            <View>
              <Text>Volume</Text>
            </View>
          </Pressable>

          <Pressable>
            <View>
              <Text>audio/subs</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const Item: React.FC<{
  index: number;
  animationValue: Animated.SharedValue<number>;
  directionAnim: Animated.SharedValue<ArrowDirection>;
  item: {
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    path: string;
  };
}> = ({ animationValue, directionAnim, item }) => {
  const maskStyle = useAnimatedStyle(() => {
    const zIndex = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [300, 0, -300],
    );

    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['transparent', 'transparent', 'rgba(0,0,0,0.3)'],
    );

    return {
      backgroundColor,
      zIndex,
    };
  }, [animationValue]);

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          maskStyle,
          { position: 'absolute', width: '100%', height: '100%' },
        ]}
      />

      <Text>hello</Text>
    </View>
  );
};
