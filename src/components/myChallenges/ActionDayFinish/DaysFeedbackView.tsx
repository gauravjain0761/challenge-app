import {StyleSheet, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import FeedBackComponent from './FeedBack/FeedBackComponent';
import FeedbackExplore from './FeedBack/FeedbackExplore';
import FeedBackReflection from './FeedBack/FeedBackReflection';
import FeedBackSlider from './FeedBack/FeedBackSlider';
type Props = {
  days?: any;
  onPressChallenge?: () => void;
  onPressFeedBack?: () => void;
  ChallengeType?: any;
  preRating?: any;
  challengeName?: any;
  challengeActions?: any;
};
const DaysFeedbackView = ({
  days,
  onPressChallenge = () => {},
  onPressFeedBack = () => {},
  ChallengeType,
  preRating,
  challengeName,
  challengeActions,
}: Props) => {
  return (
    <View style={styles.container}>
      {days === 7 ? (
        <FeedBackSlider preRating={preRating} challengeName={challengeName} />
      ) : days === 3 || days === 5 ? (
        <FeedbackExplore
          onPress={onPressChallenge}
          ChallengeType={ChallengeType}
        />
      ) : days === 2 || days === 6 ? (
        <FeedBackReflection days={days} />
      ) : (
        <FeedBackComponent
          days={days}
          challengeActions={challengeActions}
          onPress={onPressFeedBack}
        />
      )}
    </View>
  );
};

export default DaysFeedbackView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: getFontSize(0.5),
    gap: getFontSize(0.7),
    paddingHorizontal: getFontSize(0.2),
  },
});
