import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import DayPicker from '@/components/DayPicker';
import Button from '@/components/Button';
const LABELS = ['Didn’t turn up', 'Sloppy', 'Average', 'Pushed', 'Smashed It'];

const RateYourEffort = ({
  onPress = () => {},
  isLoading,
}: {
  onPress: () => void;
  isLoading?: boolean;
}) => {
  const [selectValue, setSelectValue] = useState(1);

  return (
    <View style={styles.container}>
      <GradientText
        text={'Rate how much effort you\nput into this action! '}
        colors={['#C05600', '#9C9A9A']}
        style={styles.headingText}
        height={getFontSize(7)}
      />

      <DayPicker
        label={LABELS}
        selectedDuration={selectValue}
        handleDurationChange={setSelectValue}
        containerStyle={{marginTop: -20, height: getFontSize(20)}}
      />
      {/* <DayPicker label={} handleDurationChange={() => {}} /> */}
      <GradientText
        text={
          'One of the hardest challenges is to\nbe be honest with ourselves.'
        }
        colors={['#555555', '#D1D1D6']}
        style={styles.description}
        height={getFontSize(7)}
      />
      <Button
        title={isLoading ? 'Completing...' : 'Complete'}
        disabled={isLoading}
        onPress={onPress}
      />
    </View>
  );
};

export default RateYourEffort;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: getFontSize(2.6),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: getFontSize(2.1),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
});
