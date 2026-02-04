import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '../GradientText';
import CustomInput from '../CustomInput';

const WhyView = ({
  onChangeText,
  error,
}: {
  onChangeText?: (text: string) => void;
  error?: string;
}) => {
  const [value, setValue] = React.useState('');

  const handleTextChange = (text: string) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.whyView}>
      <GradientText text={`WHY?`} style={styles.heading} />

      <GradientText
        text={`Write a quick reminder of why this challenge is important to you.`}
        colors={['#555555', '#D1D1D6']}
        style={styles.dec}
        height={getFontSize(5)}
        containerStyle={styles.gradientContainer}
      />

      <CustomInput
        value={value}
        onChangeText={handleTextChange}
        mainContainer={styles.inputContainer}
        placeholder="Answer....."
        error={error}
        maxLength={70}
      />
    </View>
  );
};

export default WhyView;

const styles = StyleSheet.create({
  whyView: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    // alignItems: 'center',
    borderColor: Colors.borderColor,
    borderWidth: getFontSize(0.08),
    paddingTop: getFontSize(3),
    paddingBottom: getFontSize(3),
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dec: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '400',
    textAlign: 'center',
  },
  gradientContainer: {
    marginTop: getFontSize(2),
    width: '70%',
    alignSelf: 'center',
    marginBottom: getFontSize(2),
  },
  inputContainer: {
    marginBottom: getFontSize(0),
  },
});
