import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import CustomSlider from '../CustomRangeSlider';
import GradientText from '../GradientText';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ProgressBar from '@/constants/ProgressBar';

const SliderVIew = ({
  text,
  containerStyle,
  onChangeSlider,
  isProgressBar,
  total = 0,
  remaining = 0,
}: {
  text: string;
  containerStyle?: ViewStyle;
  onChangeSlider?: (value: number) => void;
  isProgressBar?: boolean;
  total?: number | undefined;
  remaining?: number | undefined;
}) => {
  const [sliderValue, setSliderValue] = React.useState(remaining || 1);
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        // {height: text.length < 35 ? getFontSize(15) : getFontSize(18)},
      ]}>
      <View
        style={{
          flex: 1,
          flexWrap: 'wrap',
          bottom: getFontSize(-1),
        }}>
        <GradientText
          text={text}
          colors={['#FFFFFF', '#9C9A9A']}
          style={styles.description}
          height={getFontSize(8)}
          containerStyle={{
            // marginBottom: getFontSize(2),
            width: '70%',
          }}
        />

        <GradientText
          text={sliderValue + '/10'}
          colors={['#F59815', '#999999']}
          style={styles.headingText}
          height={getFontSize(7)}
          containerStyle={{
            width: '30%',
          }}
        />
      </View>
      {isProgressBar ? (
        <ProgressBar total={total} remaining={remaining} />
      ) : (
        <GestureHandlerRootView
          style={{
            alignItems: 'center',
            height: getFontSize(4.5),
          }}>
          <CustomSlider
            value={sliderValue}
            onChange={v => {
              onChangeSlider && onChangeSlider(v);
              setSliderValue(v);
            }}
            max={10}
            min={1}
          />
        </GestureHandlerRootView>
      )}
    </View>
  );
};

export default SliderVIew;

const styles = StyleSheet.create({
  container: {
    height: getFontSize(15),
    padding: getFontSize(2),
    marginHorizontal: getFontSize(1),
    borderRadius: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingHorizontal: getFontSize(3.4),
  },
  headingText: {
    fontSize: getFontSize(3.2),
    fontWeight: '500',
    textAlign: 'right',
  },
  description: {
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
});
