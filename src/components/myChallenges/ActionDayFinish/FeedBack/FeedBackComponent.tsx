import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import GradientText from '@/components/GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import CustomInput from '@/components/CustomInput';
import {Colors} from '@/constants/Colors';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {MIX_PANEL_EVENTS} from '@/types/enums';
import Button from '@/components/Button';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

type FeedbackType = 'liked' | 'disliked' | null;

interface FeedBackComponentProps {
  days?: number | string;
  challengeActions?: any;
  onPress?: () => void;
}

const FeedBackComponent: React.FC<FeedBackComponentProps> = ({
  days,
  challengeActions,
  onPress = () => {},
}) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const user = useAppSelector(selectUser);

  const handleSubmit = async () => {
    await trackEvent(MIX_PANEL_EVENTS.day_feedback, {
      challenge_id: challengeActions?.challengeId,
      user_id: user?.id,
      feedback: feedbackType ?? 'none',
      input: feedbackText.trim(),
    });
    onPress();
  };

  const handleSelect = useCallback((type: FeedbackType) => {
    setFeedbackType(prev => (prev === type ? null : type));
  }, []);

  return (
    <View style={styles.container}>
      <GradientText
        text={`DAY ${days}\nFEEDBACK!`}
        colors={['#C05600', '#5A2800']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.headingText1}
        height={getFontSize(11)}
      />

      <GradientText
        text={
          'Did you have a great experience on day 1? Please help us grow by sharing your feedback so we can better impact more men’s lives.'
        }
        colors={['#FFFFFF', '#555555']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.decText}
        height={getFontSize(11)}
        containerStyle={{
          width: '86%',
          alignSelf: 'center',
        }}
      />

      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelect('liked')}
          accessibilityLabel="Like">
          <FastImage
            source={
              feedbackType === 'liked' ? Images.thumbs_up_s : Images.thumbs_up
            }
            style={[
              styles.icon,
              feedbackType === 'liked' && styles.iconSelected,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelect('disliked')}
          accessibilityLabel="Dislike">
          <FastImage
            source={
              feedbackType === 'disliked'
                ? Images.thumbs_down_s
                : Images.thumbs_down
            }
            style={[
              styles.icon,
              feedbackType === 'disliked' && styles.iconSelected,
            ]}
          />
        </TouchableOpacity>
      </View>

      <CustomInput
        value={feedbackText}
        onChangeText={setFeedbackText}
        placeholder="Type your feedback..."
        mainContainer={{marginBottom: getFontSize(1)}}
      />

      {feedbackType && feedbackText.trim() && (
        <Button
          title={'Submit'}
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
      )}
    </View>
  );
};

export default FeedBackComponent;

const styles = StyleSheet.create({
  container: {
    gap: getFontSize(1),
  },
  headingText1: {
    fontSize: getFontSize(4.5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  decText: {
    fontSize: getFontSize(2),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(2),
    marginVertical: getFontSize(1),
  },

  like: {
    height: getFontSize(6),
    width: getFontSize(6),
  },
  icon: {
    height: getFontSize(6),
    width: getFontSize(6),
  },
  iconSelected: {
    height: getFontSize(7),
    width: getFontSize(7),
    transform: [{scale: 1.1}],
  },
  selectedLike: {
    height: getFontSize(8),
    width: getFontSize(8),
  },

  submitBtn: {
    marginVertical: 0,
    height: getFontSize(5),
    width: '50%',
  },
});
