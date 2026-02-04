import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '@/components/GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import SliderVIew from '@/components/ActionDayModals/SliderVIew';

const FeedBackSlider = ({
  preRating,
  challengeName,
}: {
  preRating?: number;
  challengeName?: string;
}) => {
  const [sliderValue, setSliderValue] = React.useState(1);

  console.log('preRating', preRating);

  const improvement = (sliderValue - (preRating || 1)) * 10;

  const postRatingText = `YOUR POST CHALLENGE\n${
    challengeName ? challengeName.toUpperCase() : ''
  } RATING:`;

  const preRatingText = `YOUR PRE CHALLENGE\n${
    challengeName ? challengeName.toUpperCase() : ''
  } RATING:`;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text={`RATE YOUR\nSTATE!`}
        colors={['#C05600', '#5A2800']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.headingText1}
        height={getFontSize(11)}
      />
      <GradientText
        text={`${improvement < 0 ? '' : '+'}${improvement}% IMPROVEMENT`}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        colors={[Colors._9C9A9A, Colors.white]}
        style={styles.headingText}
      />
      <SliderVIew
        text={postRatingText}
        containerStyle={{
          marginTop: 20,
          height:
            postRatingText.length < 35 ? getFontSize(15) : getFontSize(17),
        }}
        onChangeSlider={setSliderValue}
      />
      <SliderVIew
        text={preRatingText}
        containerStyle={{marginTop: getFontSize(1.2)}}
        isProgressBar={true}
        total={10}
        remaining={preRating}
      />
    </ScrollView>
  );
};

export default FeedBackSlider;

const styles = StyleSheet.create({
  headingText1: {
    fontSize: getFontSize(4),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headingText: {
    fontSize: getFontSize(2),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});
