import {ImageBackground, Share, StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import GradientContainer from '../GradientContainer';
import IconComponent from '../IconComponent';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useGetProgressQuery} from '@/api/progressChallengesApi';
import Loader from '../Loader';
import {
  GetChallengeProgressResponse,
  MaxOutChallengeSchema,
} from '@/validation/schemas';
import {Images} from '@/assets/images';
import Button from '../Button';
import {captureRef} from 'react-native-view-shot';
import GradientText from '../GradientText';
import FastImage from 'react-native-fast-image';
import {BlurView} from 'expo-blur';

interface MaxOutShareModalProps {
  visible: boolean;
  onClose: () => void;
  selectedItem?: MaxOutChallengeSchema | null;
  image?: string;
}
const MaxOutShareModal = ({
  onClose,
  visible,
  selectedItem,
  image,
}: MaxOutShareModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const captureRefs = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  const appUrl = 'https://invite.mentoolschallenges.co/';
  const fixedHeight = SCREEN_WIDTH * (16 / 9);

  console.log('selectedItem', selectedItem);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleClose = (isGo?: boolean) => {
    setIsVisible(false);
    onClose();
  };

  const onPressShare = useCallback(async () => {
    try {
      setLoader(true);
      setIsCapturing(true);

      // Small delay to ensure view is properly rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!captureRefs.current) {
        setLoader(false);
        return;
      }

      const localUri = await captureRef(captureRefs.current, {
        width: SCREEN_WIDTH,
        height: fixedHeight,
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      console.log('Share URI:', localUri);

      await Share.share({
        message: `Check out my MaxOut! Think you can beat it? #MenTools #Challenge ${appUrl}`,
        url: localUri,
      });
    } catch (error) {
      console.error('Error capturing view:', error);
    } finally {
      setIsCapturing(false);
      setLoader(false);
    }
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={handleClose}
      style={styles.container}>
      <GradientContainer>
        {loader && <Loader />}
        <View style={styles.mainContainer}>
          <IconComponent
            name="close"
            size={getFontSize(4)}
            color={Colors.white}
            onPress={handleClose}
            style={styles.closeButton}
            type="Ionicons"
          />
          <View
            ref={captureRefs}
            style={[
              styles.captureContainer,

              isCapturing && {
                height: fixedHeight,
                justifyContent: 'center',
                borderRadius: getFontSize(0),
              },
            ]}
            collapsable={false}>
            <View style={styles.innerContainer}>
              <ImageBackground
                source={image ? {uri: image} : Images.levelBg}
                resizeMode="cover"
                style={styles.bgImage}>
                <BlurView intensity={10} tint="light" style={styles.blurView} />
                <View style={styles.darkOverlay} />
                <View style={styles.logoContainer}>
                <FastImage
                  source={Images.Men_Tools_Logo}
                  style={styles.logo}
                  resizeMode="contain"
                />
                </View>
                <GradientText
                  text={'MAXOUT'}
                  style={styles.maxOutText}
                  height={getFontSize(6)}
                />
                <GradientText
                  text={selectedItem?.actionName}
                  style={styles.headingText}
                  height={
                    selectedItem?.actionName &&
                    selectedItem?.actionName?.length > 25
                      ? getFontSize(7.5)
                      : getFontSize(4)
                  }
                />
                <View style={styles.unitView}>
                  <GradientText
                    colors={['#999999', Colors.white]}
                    text={selectedItem?.bestCount + ' ' + selectedItem?.unit}
                    style={styles.itemCount}
                    height={getFontSize(4)}
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={styles.shareSection}>
            <Button
              title="Share"
              type="fill"
              style={styles.buttonStyle}
              onPress={onPressShare}
            />
            <Text style={styles.shareText}>If you dare</Text>
          </View>
        </View>
      </GradientContainer>
    </Modal>
  );
};

export default memo(MaxOutShareModal);

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: getFontSize(2),
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  captureContainer: {
    paddingHorizontal: getFontSize(4),
    paddingVertical: getFontSize(4),
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: 'hidden',
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: Colors.orange,
    overflow: 'hidden',
    borderRadius: getFontSize(0.5),
    //marginBottom: getFontSize(2.2),
  },
  bgImage: {
    height: getFontSize(70),
    justifyContent: 'center',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  maxOutText: {
    textAlign: 'center',
    fontSize: getFontSize(5),
    fontWeight: '600',
    textTransform: 'uppercase',
    //marginBottom: getFontSize(0.5),
  },
  headingText: {
    textAlign: 'center',
    fontSize: getFontSize(2.8),
    fontWeight: '600',
    textTransform: 'uppercase',
    //marginBottom: getFontSize(0.5),
  },

  shareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(2),
    paddingTop: getFontSize(2),
    paddingBottom: getFontSize(1),
  },
  buttonStyle: {
    width: getFontSize(11),
    height: getFontSize(4),
  },
  shareText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '500',
  },
  itemCount: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '500',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  unitView: {
    borderWidth: 1,
    borderColor: Colors.inactiveTabColor,
    borderRadius: getFontSize(1),
    paddingVertical: getFontSize(1),
    width: '90%',
    alignSelf: 'center',
    marginTop: getFontSize(4),
    backgroundColor: Colors.shareModalBgColor,
  },
  logoContainer: {
    position: 'absolute',
    top: getFontSize(1),
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    height: getFontSize(3),
    width: getFontSize(12),
    alignSelf: 'center',
    marginTop: getFontSize(0.5),
    marginBottom: getFontSize(2.7),
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
