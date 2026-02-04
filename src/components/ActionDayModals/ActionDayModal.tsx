import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '../GradientText';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import DaysWiseView from './DaysWiseView';
import Button from '../Button';
import DaysWiseActionView from './DaysWiseActionView';
import {
  useDailyPopupMutation,
  useRatingMutation,
} from '@/api/progressChallengesApi';
import {errorToast} from '@/utils/common/commonFunction';
import {RATING_TYPE} from '@/types/enums';
import Loader from '../Loader';

interface ActionDayModalProps {
  visible: boolean;
  onClose: () => void;
  challengeActions?: any;
}
const ActionDayModal = ({
  visible,
  onClose,
  challengeActions,
}: ActionDayModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [dailyPopup, {isLoading}] = useDailyPopupMutation();
  const [rating, {isLoading: isRatingLoader}] = useRatingMutation();

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const getDay = parseInt(
    (
      (challengeActions?.actionDay?.day &&
        (challengeActions?.actionDay?.day as string)) ||
      ''
    ).replace(/\D/g, ''),
    10,
  );

  const handleReady = async () => {
    try {
      const res = await dailyPopup({
        day: challengeActions?.actionDay?.day,
        id: challengeActions?._id,
      }).unwrap();
      if (res.message) {
        setIsReady(true);
      }
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  const handleMore = async () => {
    try {
      await rating({
        data: {
          rating: sliderValue,
          ratingType: RATING_TYPE.PRE,
        },
        id: challengeActions?._id,
      }).unwrap();

      handleClose();
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.container}>
      <View style={styles.modal}>
        {isReady ? (
          <DaysWiseActionView
            days={getDay}
            onChangeSlider={setSliderValue}
            why={challengeActions?.userWhy}
            challengeName={
              challengeActions?.challengeShortName ||
              challengeActions?.challengeName
            }
          />
        ) : (
          <DaysWiseView days={getDay} />
        )}

        <Button
          isLoading={isLoading || isRatingLoader}
          title={isReady ? 'No more fluff, let’s go >' : 'I am ready >'}
          type="outline"
          style={styles.btn}
          onPress={() => {
            if (isReady) {
              if (getDay === 1) {
                handleMore();
              } else {
                handleClose();
              }
            } else {
              handleReady();
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default ActionDayModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'center',
  },
  logo: {
    width: getFontSize(10),
    height: getFontSize(5),
    alignSelf: 'center',
    marginBottom: getFontSize(2),
  },

  modal: {
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
    paddingTop: getFontSize(2),
    marginHorizontal: getFontSize(2.5),
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  btn: {
    borderColor: Colors.whiteOpacity_20,
    backgroundColor: Colors.textInputBackground,
    alignSelf: 'center',
    width: '90%',
    marginBottom: getFontSize(1.5),
    height: getFontSize(7),
    borderWidth: 1,
  },
});
