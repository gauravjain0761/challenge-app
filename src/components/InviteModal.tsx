import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import IconComponent from './IconComponent';
import {getFontSize, isIphoneX, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CompeteFriends from './info/CompeteFriends';
import Loader from './Loader';
import GradientText from './GradientText';
import Button from './Button';
import {Images} from '@/assets/images';
import {captureRef} from 'react-native-view-shot';

interface InviteModal {
  visible: boolean;
  onClose: () => void;
  onPress?: () => void;
  isLoading?: boolean;
  selectedGoal?: any;
  challengeName?: string;
}

const InviteModal = ({
  visible,
  onClose,
  onPress,
  isLoading = false,
  challengeName,
  selectedGoal,
}: InviteModal) => {
  const [isVisible, setIsVisible] = useState(false);
  const captureRefs = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleClose = () => {
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
      const fixedHeight = SCREEN_WIDTH * (16 / 9);

      const localUri = await captureRef(captureRefs.current, {
        width: SCREEN_WIDTH,
        height: fixedHeight,
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      console.log('Share URI:', localUri);

      await Share.share({
        message: `Check out my progress! 💪 #MenTools #Challenge`,
        url: localUri,
      });
    } catch (error) {
      console.error('Error capturing view:', error);
    } finally {
      setIsCapturing(false);
      setLoader(false);
    }
  }, []);

  const RenderItem = memo(({title, count}: any) => {
    return (
      <View style={[styles.itemContainer]}>
        <GradientText
          colors={['#FF7302', Colors.black]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 0.9}}
          customGradient={
            <IconComponent
              name="fire"
              type="Fontisto"
              size={getFontSize(2)}
              color={Colors._b1b1b5}
            />
          }
          gradientStyle={{width: getFontSize(1.8), height: getFontSize(2)}}
        />
        <Text style={[styles.itemName]}>{title}</Text>
        <GradientText
          colors={['#999999', Colors.white]}
          text={count}
          style={styles.itemCount}
          gradientStyle={{width: getFontSize(14)}}
        />
      </View>
    );
  });

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.container}>
      <SafeAreaView style={styles.modal}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <GradientText
            text={`CHALLENGE ON!`}
            colors={[Colors._999999, Colors.white, Colors._999999]}
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            style={styles.headingText1}
            containerStyle={{
              marginBottom: getFontSize(4),
            }}
          />
          <CompeteFriends
            onPress={onPress}
            containerStyle={styles.containerStyle}
          />
          <GradientText
            text={`and...`}
            colors={[Colors._999999, Colors.white, Colors._999999]}
            start={{x: 0.25, y: 0}}
            end={{x: 0, y: 0}}
            style={{...styles.headingText1, textAlign: 'left'}}
            containerStyle={{
              marginVertical: getFontSize(2),
            }}
          />

          <View
            ref={captureRefs}
            collapsable={false}
            style={[styles.innerContainer]}>
            <ImageBackground
              source={Images.levelBg}
              resizeMode="stretch"
              style={[
                styles.bgImage,
                isCapturing && {
                  paddingVertical: getFontSize(10),
                },
              ]}>
              <GradientText
                text={challengeName}
                style={styles.headingText}
                height={
                  challengeName && challengeName?.length > 20
                    ? getFontSize(8)
                    : getFontSize(5)
                }
              />

              <View style={styles.unitView}>
                <RenderItem
                  isCustom
                  title={'PERSONAL GOAL'}
                  count={selectedGoal ?? ''}
                />
              </View>
              {!isCapturing && (
                <View style={styles.shareSection}>
                  <Button
                    title="Share"
                    type="fill"
                    style={styles.buttonStyle}
                    onPress={onPressShare}
                  />
                  <Text style={styles.shareText}>If you dare</Text>
                </View>
              )}
            </ImageBackground>
          </View>
        </ScrollView>
        <View style={styles.btnContainer}>
          <Button title="Done" onPress={handleClose} />
        </View>
        {isLoading && <Loader />}
      </SafeAreaView>
    </Modal>
  );
};

export default InviteModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    padding: getFontSize(1),
  },
  containerStyle: {
    marginTop: 0,
  },
  modal: {
    backgroundColor: Colors.black,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: getFontSize(2),
  },
  headingText1: {
    fontSize: getFontSize(4.5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: getFontSize(2),
    // backgroundColor: Colors._1A1A1A,
  },

  innerContainer: {
    borderWidth: 1,
    borderColor: Colors.orange,
    overflow: 'hidden',
    borderRadius: getFontSize(0.5),
    marginBottom: getFontSize(2.2),
  },
  bgImage: {
    // paddingHorizontal: getFontSize(2),
    // paddingVertical: getFontSize(8),
    height: getFontSize(45),
    justifyContent: 'center',
  },

  headingText: {
    textAlign: 'center',
    fontSize: getFontSize(4),
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  shareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(2),
    paddingTop: getFontSize(2),
    top: getFontSize(2),
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
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  unitView: {
    width: '80%',
    alignSelf: 'center',
    marginTop: getFontSize(4),
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: getFontSize(1.2),
    paddingVertical: getFontSize(2),
    borderRadius: getFontSize(1),
    borderColor: Colors._7f7d7c,
    gap: getFontSize(1.5),
  },
  contentContainerStyle: {
    paddingVertical: getFontSize(0.5),
    gap: getFontSize(0.7),
    paddingHorizontal: getFontSize(0.2),
  },
  itemName: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 1,
  },
});
