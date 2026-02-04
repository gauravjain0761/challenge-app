import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {VideoModalProps} from '@/types';
import Modal from 'react-native-modal';
import {Colors} from '@/constants/Colors';
import IconComponent from '../IconComponent';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import Loader from '../Loader';
import Video, {ResizeMode} from 'react-native-video';
import {GeneralStyle} from '@/constants/GeneralStyle';

const VideoModal = ({visible, onClose, videoUrl}: VideoModalProps) => {
  const videoRef = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      videoRef.current?.seek(0, 0);
    };
  }, []);

  const onCloseModal = () => {
    setLoading(true);
    onClose();
  };

  const handleError = (error: any) => {
    console.error('Video playback error:', error);
    setVideoError('Playback failed. Tap to retry.');
    setLoading(false);
  };

  const handleRetry = () => {
    setVideoError(null);
    setLoading(true);
    videoRef.current?.seek(0, 0);
  };

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <SafeAreaView style={styles.modalContainer}>
        <IconComponent
          name="close"
          color={Colors.white}
          onPress={onCloseModal}
          style={styles.closeButton}
        />

        <Video
          ref={videoRef}
          resizeMode={ResizeMode.CONTAIN}
          source={{uri: videoUrl}}
          style={styles.video}
          onLoad={() => setLoading(false)}
          onError={handleError}
          controls={true}
          repeat={false}
          ignoreSilentSwitch="ignore"
        />
        {loading && <Loader />}

        {videoError && (
          <View style={GeneralStyle.errorContainer}>
            <Text style={GeneralStyle.errorText}>{videoError}</Text>
            <Text style={GeneralStyle.errorSubtext} onPress={handleRetry}>
              Tap to retry
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default VideoModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: isIphoneX() ? getFontSize(10) : getFontSize(5),
    left: 10,
  },
});
