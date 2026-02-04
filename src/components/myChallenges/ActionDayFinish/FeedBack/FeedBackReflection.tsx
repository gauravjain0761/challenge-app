import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GradientText from '@/components/GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CustomInput from '@/components/CustomInput';

const FeedBackReflection = ({days}: {days?: any}) => {
  const [today, setToday] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  return (
    <View>
      <GradientText
        text={`DAY ${days}\nREFLECTION!`}
        colors={['#C05600', '#5A2800']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.headingText1}
        height={getFontSize(11)}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>WHAT WAS ONE WIN TODAY?</Text>

        <CustomInput
          value={today}
          onChangeText={setToday}
          placeholder="Type Here............................."
          placeholderTextColor={Colors.white}
          containerStyle={styles.inputStyle}
        />

        <Text style={styles.heading}>WHAT WILL YOU DO BETTER TOMORROW?</Text>

        <CustomInput
          value={tomorrow}
          onChangeText={setTomorrow}
          placeholder="Type Here............................."
          placeholderTextColor={Colors.white}
          containerStyle={styles.inputStyle}
        />
      </View>
    </View>
  );
};

export default FeedBackReflection;

const styles = StyleSheet.create({
  headingText1: {
    fontSize: getFontSize(4.5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: getFontSize(1),
    paddingVertical: getFontSize(2),
    backgroundColor: Colors.borderColor,
    marginVertical: getFontSize(3),
  },

  heading: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    textAlign: 'center',
  },
  inputStyle: {
    backgroundColor: 'transparent',
    marginVertical: getFontSize(1.5),
    marginHorizontal: getFontSize(4),
  },
});
