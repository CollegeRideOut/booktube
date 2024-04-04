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
  Button,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../util/trpc';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { Video, Audio, ResizeMode } from 'expo-av';
import { Arrow, ArrowDirection } from './Arrow';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

export default function ListenToBook() {
  const { libraryId } = useGlobalSearchParams();
  const navigation = useRouter();

  const initialInfo = api.library.getCurrentLibraryListen.useQuery(
    libraryId as string,
  );
  const chapterByIdMutation = api.chapter.getChapterById.useMutation();

  const loVs = api.video.getLoVi.useQuery({ cursor: 5 });

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
  const video = useRef(null);
  const [currentSubs, setCurrentSubs] = useState<any>();
  const [currentInfo, setCurrentInfo] = useState<{
    chapter: {
      number: number;
      id: string;
      name: string;
      createdAt: string | null;
      updatedAt: string | null;
      bookId: string;
    };
    audiobooks: {
      id: string;
      author: string;
      path: string;
      language: 'ENGLISH' | 'SPANISH';
      subs: {
        path: string;
        id: string;
        language: 'ENGLISH' | 'SPANISH';
        audiobookId: string;
      }[];
    }[];
  }>();
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout>();

  /* const updatePositionnMutate = async (soundObj: Audio.SoundObject) => { */
  /*   try { */
  /*     const status = await soundObj.sound.getStatusAsync(); */
  /*     const ok = await apiUpdateLastSecond.mutateAsync({ */
  /*       id: currentInfo!.chapterId.id, */
  /*       lastSecondListend: (status as any).positionMillis, */
  /*     }); */
  /**/
  /*     console.log('sent', ok); */
  /**/
  /*     return; */
  /*   } catch (error) { */
  /*     console.log('error in updatePositionMutate', error); */
  /*   } */
  /* }; */

  async function updateCurrentInfo(id: string) {
    try {
      console.log('when did i ran ');

      if (audioStream) {
        await audioStream!.sound.unloadAsync();
      }

      const newInfo = await chapterByIdMutation.mutateAsync({
        id: id,
      });
      console.log('hello???', newInfo);

      setCurrentInfo(newInfo);
    } catch (error) {
      console.log('some errir', error);
    }
  }

  useEffect(() => {
    const getData = async () => {
      if (initialInfo.data) {
        updateCurrentInfo(initialInfo.data.currentInfo.chapterId.chapterId);
      }
    };
    getData();
  }, [initialInfo.data]);

  useEffect(() => {
    let soundObj: Audio.SoundObject;

    console.log('i should run again 1');
    const getData = async () => {
      if (currentInfo) {
        console.log('i should run again 22222');
        /* const audio = initialInfo.data.currentInfo.audiobook; */
        const audio = currentInfo.audiobooks[0];
        const subs = await (
          await fetch(audio.subs[0].path, {
            method: 'GET',
          })
        ).json();

        setCurrentSubs(subs.events);
        setCurrentLine(subs.events[0]);
        soundObj = await Audio.Sound.createAsync(
          { uri: audio.path },
          {
            shouldPlay: true,
            progressUpdateIntervalMillis: 200,
            volume: 1,
            rate: 1,
            /* positionMillis: */
            /*   initialInfo.data.currentInfo.chapterId.lastSecondListend, */
            positionMillis: 0,
          },
        );
        /**/
        /* let inteval = setInterval(() => { */
        /*   updatePositionnMutate(soundObj); */
        /* }, 5000); */
        /* setUpdateInterval(inteval); */
        setAudioStream(soundObj);
      }
    };

    console.log('false');
    if (currentInfo) {
      console.log('true');
      getData();
    }

    console.log('false222', currentInfo);

    return () => {
      if (soundObj) {
        soundObj.sound.unloadAsync();
      }
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [currentInfo]);

  useEffect(() => {
    if (loVs.data) {
      const allVsCopy = [...allLovs];
      allVsCopy.push(...loVs.data);
      setAllVs(allVsCopy);
    }
  }, [loVs.data]);

  useEffect(() => {
    if (currentIdxLoVs === -1 && allLovs.length > 0) {
      setCurrentIdxLoVs(0);
    }
  }, [allLovs]);

  useEffect(() => {
    if (audioStream && video.current) {
      audioStream.sound._onPlaybackStatusUpdate = (status: any) => {
        const t = (status as any).positionMillis;

        if (!(status as any).isPlaying) {
        }

        if (status.didJustFinish) {
          console.log('ended');
          console.log('here');

          const currentNumber = currentInfo!.chapter.number;

          if (currentNumber < initialInfo.data!.chapters.length) {
            const nextChapter = initialInfo.data!.chapters.find(
              (c) => c.number === currentNumber + 1,
            );

            console.log('current', currentNumber);
            console.log('next', nextChapter);
            if (nextChapter) {
              updateCurrentInfo(nextChapter.id);
              return;
            }
          }
          if (updateInterval) {
            clearInterval(updateInterval);
          }
        }

        if (currentLine && currentSubs) {
          if (currentLine.start < t || currentLine.end > t) {
            let val = currentSubs.find((ee: any) => {
              return t >= ee.start && t <= ee.end;
            });

            if (val) {
              setCurrentLine(val);
            }
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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = React.useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        panGestureHandlerProps={{
          activeOffsetY: [-10, 10],
        }}
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
        /* customAnimation={animationStyle} */
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
      />

      {audioStream && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 50,
            bottom: 10,
            width: Dimensions.get('window').width,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handlePresentModalPress();
            }}
          >
            <Text style={{ color: 'white' }}> choose chapter</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Image
                source={require('../../../assets/Back30s.png')}
                style={{ height: 54, width: 54 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              if (isPlaying) {
                await audioStream.sound.pauseAsync();
                setIsPlaying(false);
              } else {
                await audioStream.sound.playAsync();

                setIsPlaying(true);
              }
            }}
          >
            <View>
              <Image
                source={require('../../../assets/playBtn 1.png')}
                style={{ height: 54, width: 54 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View>
              <Image
                source={require('../../../assets/Forward30s.png')}
                style={{ height: 54, width: 54 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: 'center',
          backgroundColor: 'grey',
        }}
      >
        <Button
          onPress={handlePresentModalPress}
          title='Present Modal'
          color='black'
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Text>Chapters</Text>
            {initialInfo.data && (
              <View>
                {initialInfo.data.chapters.map((c) => {
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => {
                        updateCurrentInfo(c.id);
                      }}
                    >
                      <Text>
                        # {c.number}: {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </View>
  );
}
