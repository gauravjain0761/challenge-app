import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import Video, {ResizeMode, VideoRef} from 'react-native-video';
import ImageModal from 'react-native-image-modal';
import IconComponent from '../IconComponent';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {WWHContent} from '@/types';

const WhatCard = memo(
  ({title, content}: {title: string; content: WWHContent}) => {
    const videoRef = useRef<VideoRef>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [play, setPlay] = useState<boolean>(false);

    const handleLoad = () => {
      setLoading(false);
    };

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content?.details || ''}</Text>
        {content?.files[0]?.fileUrl && (
          <View style={styles.imageContainer}>
            {content?.files[0]?.fileType.includes('mp4') ? (
              <Video
                ref={videoRef}
                style={{...styles.video, opacity: play ? 1 : 0.4}}
                source={{uri: content?.files[0]?.fileUrl}}
                resizeMode={ResizeMode.COVER}
                paused={true}
                controls
                onLoad={handleLoad}
              />
            ) : (
              <View style={styles.imageContainer2}>
                <ImageModal
                  resizeMode="contain"
                  style={styles.image}
                  source={{uri: content?.files[0]?.fileUrl || ''}}
                />
              </View>
            )}
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
              </View>
            )}
            {!loading &&
              !play &&
              content?.files[0]?.fileType.includes('mp4') && (
                <TouchableOpacity
                  onPress={() => {
                    setPlay(true);
                    videoRef.current?.resume();
                  }}
                  style={styles.playButton}>
                  <IconComponent
                    name="play"
                    color={Colors._C05600}
                    type="Ionicons"
                  />
                </TouchableOpacity>
              )}
          </View>
        )}
      </View>
    );
  },
);

export default WhatCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
  },
  cardTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '500',
    marginBottom: getFontSize(0.5),
  },
  cardContent: {
    fontSize: getFontSize(1.6),
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: getFontSize(0.5),
  },
  imageContainer: {
    marginTop: getFontSize(3),
    borderRadius: getFontSize(1),
    overflow: 'hidden',

    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer2: {
    width: SCREEN_WIDTH - getFontSize(10),
    height: getFontSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH - getFontSize(10),
    height: getFontSize(20),
  },
  video: {
    width: '100%',
    height: getFontSize(22),
    borderRadius: getFontSize(1),
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: getFontSize(6),
    height: getFontSize(6),
    width: getFontSize(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteOpacity_20,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
