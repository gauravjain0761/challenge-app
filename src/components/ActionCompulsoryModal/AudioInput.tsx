import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CustomInput from '@/components/CustomInput';
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
import GradientText from '../GradientText';

interface Props {
  question: string;
  onAnswerChange?: (answer: {text: string; audio: string | null}) => void;
  isGradientQ?: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const AudioInput = ({question, onAnswerChange, isGradientQ}: Props) => {
  const [answer, setAnswer] = useState('');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const recordingInterval = useRef<NodeJS.Timer | null | any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer({uri: recordingUri ?? undefined});
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange({
        text: answer,
        audio: recordingUri,
      });
    }
  }, [answer, recordingUri]);

  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener(
      'playbackStatusUpdate',
      (s: any) => {
        if (s?.isLoaded) {
          setPlaybackTime(Math.floor(s.currentTime));
          setDuration(Math.floor(s.duration));
          if (s.currentTime >= s.duration - 0.2) {
            setIsPlaying(false);
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

  const handleStartRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        errorToast('Permission to access microphone was denied');
        return;
      }

      setIsRecording(true);
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

  const handleStopRecording = async () => {
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
        }recording_${Date.now()}.m4a`;
        await FileSystem.copyAsync({from: originalUri, to: newUri});

        setRecordingUri(newUri);
        setRecordingDuration(recordingTimer);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setIsRecording(false);
      setRecordingTimer(0);
    }
  };

  const handlePlayPause = () => {
    if (isRecording || !recordingUri) return;

    if (status.playing) {
      setIsPlaying(false);
      player.pause();
    } else {
      setIsPlaying(true);
      player.seekTo(0);
      player.play();
    }
  };

  const handleDelete = () => {
    setRecordingUri(null);
    setRecordingDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      {!isGradientQ ? (
        <GradientText
          text={question}
          colors={['#C05600', '#9C9A9A']}
          style={styles.headingText}
          height={question?.length > 20 ? getFontSize(4) : getFontSize(7)}
        />
      ) : (
        <Text style={styles.questionText}>{question}</Text>
      )}

      <CustomInput
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
        multiline
        containerStyle={styles.inputStyle}
        inputStyle={styles.inputStyle}
        mainContainer={styles.inputContainer}
        textAlignVertical="top"
        rightIcon={
          !recordingUri && (
            <IconComponent
              name={isRecording ? 'stop-circle' : 'mic'}
              size={getFontSize(4)}
              color={Colors._C05600}
              type="Ionicons"
              style={{alignSelf: 'flex-end', paddingBottom: 15}}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            />
          )
        }
      />

      <View style={styles.iconRow}>
        {isRecording && (
          <Text style={styles.timerText}>
            Recording: {formatTime(recordingTimer)}
          </Text>
        )}

        {recordingUri && (
          <>
            <IconComponent
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={getFontSize(4)}
              color={Colors._C05600}
              type="Ionicons"
              onPress={handlePlayPause}
            />

            <View style={styles.recordingContainer}>
              <WaveformVisualizer playing={isPlaying} />
              <View style={styles.timerRow}>
                <Text style={styles.timerText}>
                  {formatTime(isPlaying ? playbackTime : 0)}
                </Text>
                <Text style={styles.timerText}>
                  {formatTime(recordingDuration)}
                </Text>
              </View>
            </View>

            <IconComponent
              name="trash"
              size={24}
              color={Colors.red}
              type="Ionicons"
              onPress={handleDelete}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default AudioInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    gap: 10,
  },
  headingText: {
    fontSize: getFontSize(2.2),
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    height: getFontSize(20),
    marginBottom: 0,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
