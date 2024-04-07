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




class Track {
  _audioFile: string
  _fadeTimeout: any
  _loopHandlerWorking: any
  status: {
    loaded: boolean,
    pauseTime: number,
    volume: number
  }
  soundObj: Audio.SoundObject
  currentLine: any
  currentSubs: any

  constructor(audioFile: string, soundObj: Audio.SoundObject) {
    this._audioFile = audioFile
    this._fadeTimeout = null
    this._loopHandlerWorking
    this.soundObj = soundObj
    this.status = {
      loaded: true,
      pauseTime: 0,
      volume: 1
    }

  }

  load = (audioFile: string) => new Promise(async (resolve, reject) => {
    const { soundObj, _audioFile, status } = this

    try {

      console.log('hello asdfasdfasdflajdshf YOOOOO')
      await soundObj?.sound.loadAsync({ uri: audioFile })
      await soundObj?.sound.setProgressUpdateIntervalAsync(100)


      console.log('hello asdfasdfasdflajdshf YOOOOO222')


      status.loaded = true
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  unload = () => new Promise(async (resolve, reject) => {
    const { soundObj, status } = this

    try {
      status.loaded = false
      await soundObj?.sound.unloadAsync()
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  setVolume = (volume: number) => new Promise(async (resolve, reject) => {
    const { soundObj, status } = this

    if (!status.loaded) return resolve(true)

    try {
      await soundObj?.sound.setVolumeAsync(volume)
      status.volume = volume
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  setCurrentTime = (time: number) => new Promise(async (resolve, reject) => {
    const { soundObj, status } = this

    if (!status.loaded) return resolve(true)

    try {
      await soundObj?.sound.setStatusAsync({ positionMillis: time })
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  play = ({
    loop = true,
    continueFromPreviousPosition = true,
    volume = 1
  }) => new Promise(async (resolve, reject) => {
    const { soundObj, setCurrentTime, _audioFile, setVolume, fade, setTrackToLooping, load, status } = this

    try {
      if (!status.loaded) {
        await load(_audioFile)
      }

      const shouldFadeIn = continueFromPreviousPosition && status.pauseTime !== 0 ? true : false
      await setCurrentTime(continueFromPreviousPosition ? status.pauseTime : 0)
      await setVolume(shouldFadeIn ? 0 : volume)

      await soundObj?.sound.playAsync()

      if (shouldFadeIn) {
        await fade(volume)
      }

      if (loop) {
        await setTrackToLooping()
      }

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  pause = () => new Promise(async (resolve, reject) => {
    const { soundObj, status, fade, unload } = this

    if (!status.loaded) return resolve(true)

    try {
      const { positionMillis } = await soundObj?.sound.getStatusAsync() as any
      status.pauseTime = positionMillis ? positionMillis : 0
      await fade(0)
      await unload()
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  stop = () => new Promise(async (resolve, reject) => {
    const { fade, unload, status, soundObj } = this

    if (!status.loaded) return resolve(true)

    try {
      const { isPlaying } = await soundObj?.sound.getStatusAsync() as any

      if (isPlaying) {
        await fade(0)
      }

      await unload()
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  fade = (toVolume: number) => new Promise((resolve, reject) => {
    const { status, _fadeTimeout, setVolume } = this

    if (status.volume === toVolume) return

    if (_fadeTimeout) {
      clearTimeout(_fadeTimeout)
    }

    const start = Math.floor(status.volume * 10)
    const end = toVolume * 10
    let currVolume = start

    const loop = async () => {
      if (currVolume !== end) {
        start < end ? currVolume++ : currVolume--
        await setVolume(currVolume / 10)
        this._fadeTimeout = setTimeout(loop, 150)
      } else {
        clearTimeout(_fadeTimeout)
        this._fadeTimeout = null
        resolve(true)
      }
    }

    this._fadeTimeout = setTimeout(loop, 5)
  })

  setTrackToLooping = () => new Promise(async (resolve, reject) => {
    try {
      this._loopHandlerWorking = false
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  _loopHandler = async (status: any) => {
    const { isLoaded, isPlaying, durationMillis, positionMillis, volume } = status

    if (
      !this._loopHandlerWorking &&
      isPlaying &&
      isLoaded &&
      (durationMillis - positionMillis) < 1500
    ) {
      try {
        this._loopHandlerWorking = true
        await this.stop()
        await this.play({ volume, loop: true })
      } catch (error) {
        console.log(error)
      } finally {
        this._loopHandlerWorking = false
      }
    }
  }
}




export default function ListenToBook() {
  const { libraryId } = useGlobalSearchParams();
  const navigation = useRouter();

  const initialInfo = api.library.getCurrentLibraryListen.useQuery(
    libraryId as string,
  );
  const chapterByIdMutation = api.chapter.getChapterById.useMutation();

  const loVs = api.video.getLoVi.useQuery({ cursor: 5 });

  const [isPlaying, setIsPlaying] = useState(true);
  const [audioStream, setAudioStream] = useState<Track>();
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

  useEffect(() => {

    console.log('test1', audioStream)
    if (audioStream) {
      console.log('test2')
      if (audioStream.soundObj) {
        console.log('test3')
        audioStream.soundObj.sound._onPlaybackStatusUpdate = (a) => { statusUpdate(a) }
      }
    }
  }, [audioStream])

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


  const statusUpdate = (status: any) => {
    const t = (status as any).positionMillis;

    if (status.didJustFinish) {
      const currentNumber = currentInfo!.chapter.number;
      if (currentNumber < initialInfo.data!.chapters.length) {
        const nextChapter = initialInfo.data!.chapters.find(
          (c) => c.number === currentNumber + 1,
        );
        if (nextChapter) {
          updateCurrentInfo(nextChapter.id);
          return;
        }
      }
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    }


    if (currentLine.start < t || currentLine.end > t) {
      let val = currentSubs.find((ee: any) => {
        return t >= ee.start && t <= ee.end;
      });

      if (val) {
        setCurrentLine(val);
      }
    }
  }

  async function updateCurrentInfo(id: string) {
    try {
      if (audioStream) { audioStream.unload() }
      const newInfo = await chapterByIdMutation.mutateAsync({
        id: id,
      });

      setCurrentInfo(newInfo);
    } catch (error) {
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
    let track: Track;

    const getData = async () => {
      if (currentInfo) {
        /* const audio = initialInfo.data.currentInfo.audiobook; */
        const audio = currentInfo.audiobooks[0];
        const subs = await (
          await fetch(audio.subs[0].path, {
            method: 'GET',
          })
        ).json();

        setCurrentSubs(subs.events);
        setCurrentLine(subs.events[0]);


        const s = await Audio.Sound.createAsync({ uri: audio.path },
          {
            shouldPlay: true,
            progressUpdateIntervalMillis: 200,
            /* positionMillis: */
            /*   initialInfo.data.currentInfo.chapterId.lastSecondListend, */
            positionMillis: 0,
          },
        )

        track = new Track(audio.path, s)

        await track.play({ continueFromPreviousPosition: true })

        setAudioStream(track)

        /**/
        /* let inteval = setInterval(() => { */
        /*   updatePositionnMutate(soundObj); */
        /* }, 5000); */
        /* setUpdateInterval(inteval); */
      }
    };

    if (currentInfo) {
      getData();
    }
    return () => {
      if (track) {
        track.unload();
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


  const PAGE_WIDTH = Dimensions.get('window').width;
  const PAGE_HEIGHT = Dimensions.get('window').height;
  const directionAnim = useSharedValue<ArrowDirection>(
    ArrowDirection.IS_VERTICAL,
  );
  const [isVertical, setIsVertical] = React.useState(true);


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
                await audioStream.pause();
                setIsPlaying(false);
              } else {
                await audioStream.play(
                  {
                    loop: true,
                    continueFromPreviousPosition: true,
                    volume: 1
                  }
                );

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
