import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import Video, {ResizeMode, VideoRef, OnProgressData} from 'react-native-video';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

interface VideoPlayerProps {
  item: GetInProgressActionAssetsData;
  isActive?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({item, isActive = false}) => {
  const videoRef = useRef<VideoRef>(null);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.seek(position, 0);
      //videoRef.current?.pause();
    }
  }, [isActive]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleProgress = (data: OnProgressData) => {
    setPosition(data.currentTime);
  };

  const handleError = (error: any) => {
    console.error('Video playback error:', error);
    setVideoError('Playback failed. Tap to retry.');
    setLoading(false);
  };

  const handleRetry = () => {
    setVideoError(null);
    setLoading(true);
    videoRef.current?.seek(position, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{uri: item.files.fileUrl}}
          style={styles.videoPlayer}
          resizeMode={ResizeMode.COVER}
          paused={!isActive}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onError={handleError}
          repeat={false}
          controls={true}
          ignoreSilentSwitch="ignore"
        />

        {/* Loader Overlay */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        )}

        {/* Error Overlay */}
        {videoError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{videoError}</Text>
            <Text style={styles.errorSubtext} onPress={handleRetry}>
              Tap to retry
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(VideoPlayer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getFontSize(1),
    overflow: 'hidden',
    marginBottom: getFontSize(5),
  },
  videoPlayer: {
    width: '100%',
    height: getFontSize(28),
    alignSelf: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: getFontSize(2),
  },
  errorText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    textAlign: 'center',
    marginBottom: getFontSize(1),
  },
  errorSubtext: {
    color: Colors.orange,
    fontSize: getFontSize(1.8),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
