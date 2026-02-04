import React, {useEffect, useState, useRef} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CustomInput from '@/components/CustomInput';
import {questionsData} from '@/validation/schemas';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import {errorToast} from '@/utils/common/commonFunction';
import IconComponent from '@/components/IconComponent';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import {useKeyboard} from '@/utils/common/useKeyboard';

interface Props {
  questionList: questionsData[];
  onAnswerChange?: (answers: {[index: number]: string}) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const Question = ({questionList, onAnswerChange}: Props) => {
  const [answers, setAnswers] = useState<{[index: number]: string}>({});
  const [recordingData, setRecordingData] = useState<{
    [index: number]: {uri: string; duration: number};
  }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const recordingInterval = useRef<NodeJS.Timer | any>(null);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const listRef = useRef<any>(null); // ✅ FlatList ref
  const {keyboardHeight} = useKeyboard();

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const player = useAudioPlayer({
    uri:
      recordingIndex !== null && recordingData[recordingIndex]
        ? recordingData[recordingIndex].uri
        : undefined,
  });
  const status = useAudioPlayerStatus(player);
  const lastUri = useRef<string | null>(null);

  useEffect(() => {
    onAnswerChange?.(answers);
  }, [answers]);

  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener(
      'playbackStatusUpdate',
      (status: any) => {
        if (status?.isLoaded) {
          setPlaybackTime(Math.floor(status.currentTime));
          setDuration(Math.floor(status.duration));
          if (status.currentTime >= status.duration - 0.2) {
            setIsPlaying(null);
            player.seekTo(0);
            player.pause();
          }
        }
      },
    );

    return () => {
      statusListener.remove?.();
    };
  }, [player]);

  const handleInputChange = (text: string, index: number) => {
    setAnswers(prev => ({...prev, [index]: text}));
  };

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({index, animated: true});
  };

  const handleStartRecording = async (index: number) => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        errorToast('Permission to access microphone was denied');
      }

      setIsRecording(true);
      setRecordingIndex(index);
      setIsPlaying(null);
      setRecordingTimer(0);

      await audioRecorder.stop();
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      recordingInterval.current && clearInterval(recordingInterval.current);
      recordingInterval.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const handleStopRecording = async (index: number) => {
    try {
      await audioRecorder.stop();

      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }

      const originalUri = audioRecorder.uri;

      if (originalUri) {
        const newUri = `${
          FileSystem.documentDirectory
        }recording_${index}_${Date.now()}.m4a`;

        await FileSystem.copyAsync({
          from: originalUri,
          to: newUri,
        });

        setRecordingData(prev => ({
          ...prev,
          [index]: {uri: newUri, duration: recordingTimer},
        }));
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setIsRecording(false);
      setRecordingIndex(null);
      setRecordingTimer(0);
    }
  };

  const handlePlayPause = (index: number) => {
    if (isRecording) return;

    if (!status.isLoaded || lastUri.current !== recordingData[index]?.uri) {
      player.replace(recordingData[index]?.uri);
      lastUri.current = recordingData[index]?.uri;
    }
    if (status.playing) {
      setIsPlaying(null);
      player.pause();
    } else {
      setIsPlaying(index);
      player.seekTo(0);
      player.play();
    }
  };

  const handleDelete = (index: number) => {
    setRecordingData(prev => {
      const copy = {...prev};
      delete copy[index];
      return copy;
    });
  };

  const renderItem = ({item, index}: {item: questionsData; index: number}) => {
    const hasRecording = !!recordingData[index]?.uri;

    return (
      <View key={index.toString()} style={styles.itemContainer}>
        <Text style={styles.questionText}>{item.question}</Text>

        <CustomInput
          placeholder="Answer"
          value={answers[index] || ''}
          onChangeText={text => handleInputChange(text, index)}
          multiline
          containerStyle={styles.inputStyle}
          inputStyle={styles.inputStyle}
          mainContainer={styles.inputContainer}
          textAlignVertical="top"
          onFocus={() => {
            setTimeout(() => scrollToIndex(index), 100); // ✅ Scroll into view
          }}
          rightIcon={
            !hasRecording && (
              <IconComponent
                name={
                  isRecording && recordingIndex === index
                    ? 'stop-circle'
                    : 'mic'
                }
                size={getFontSize(4)}
                color={Colors._C05600}
                type="Ionicons"
                style={{
                  alignSelf: 'flex-end',
                  bottom: getFontSize(1.5),
                  left: getFontSize(1),
                }}
                onPress={() =>
                  isRecording && recordingIndex === index
                    ? handleStopRecording(index)
                    : handleStartRecording(index)
                }
              />
            )
          }
        />

        <View
          style={{
            ...styles.iconColumn,
            justifyContent:
              isRecording && recordingIndex === index
                ? 'flex-end'
                : 'space-between',
          }}>
          {isRecording && recordingIndex === index && (
            <Text style={styles.timerText}>
              Recording: {formatTime(recordingTimer)}
            </Text>
          )}

          {hasRecording && (
            <IconComponent
              name={isPlaying === index ? 'pause-circle' : 'play-circle'}
              size={getFontSize(4)}
              color={Colors._C05600}
              type="Ionicons"
              onPress={() => handlePlayPause(index)}
            />
          )}
          {hasRecording && (
            <View style={styles.recordingContainer}>
              <WaveformVisualizer playing={isPlaying == index} />
              <View style={styles.iconColumn}>
                <Text style={styles.timerText}>
                  {formatTime(isPlaying == index ? playbackTime : 0)}
                </Text>
                <Text style={styles.timerText}>
                  {formatTime(recordingData[index]?.duration || 0)}
                </Text>
              </View>
            </View>
          )}

          {hasRecording && (
            <IconComponent
              name="trash"
              size={24}
              color={Colors.red}
              type="Ionicons"
              onPress={() => handleDelete(index)}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      extraScrollHeight={getFontSize(20)}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{paddingBottom: keyboardHeight}} // give space for keyboard
    >
      <View style={{paddingBottom: keyboardHeight}}>
        {questionList.map((item, index) => renderItem({item, index}))}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Question;

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 10,
    gap: 10,
  },
  questionText: {
    fontSize: getFontSize(2.2),
    color: Colors.white,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'capitalize',
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputStyle: {
    height: getFontSize(15),
    marginBottom: 0,
  },
  iconColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  timerText: {
    fontSize: getFontSize(1.5),
    color: Colors.white,
    opacity: 0.7,
  },
  recordingContainer: {
    flex: 1,
    gap: 2,
  },
});
