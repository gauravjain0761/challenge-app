import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize, SCREEN_HEIGHT} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import GradientText from '@/components/GradientText';
import {Colors} from '@/constants/Colors';
import {router} from 'expo-router';
import {setAsyncToday} from '@/utils/common/useAsyncFunctions';
import IconComponent from '@/components/IconComponent';

interface TodayStepOneProps {
  next: () => void;
  onLayout?: (event: any) => void;
}

const TodayStepOne = (props: TodayStepOneProps) => {
  const {next, onLayout} = props;

  const onNext = async () => {
    try {
      await setAsyncToday();
      await next();
      router.push('/(tabs)/(challenges)');
    } catch (error) {
      console.error('🎯 TodayStepOne - Error:', error);
    }
  };

  const close = async () => {
    await setAsyncToday();
    await next();
  };
  return (
    <View style={styles.overlay} onLayout={onLayout}>
      <View style={styles.mainContainer}>
        <IconComponent
          name="close"
          size={getFontSize(3)}
          onPress={close}
          color={Colors.white}
          style={styles.close}
        />
        <GradientText
          text={
            'Welcome to MenTools Challenges, Let’s take a quick tour and get you taking action.'
          }
          height={getFontSize(9)}
          style={styles.nameText}
          containerStyle={styles.nameContainer}
        />
        <Button
          title="Next"
          onPress={onNext}
          style={GeneralStyle.btnStyle}
          textStyle={GeneralStyle.btnTextStyle}
        />
      </View>
    </View>
  );
};

export default TodayStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(35),
    height: getFontSize(25),
    position: 'absolute',
    top: SCREEN_HEIGHT / 2.5,
    justifyContent: 'center',
    backgroundColor: Colors._1A1A1A,
    alignSelf: 'center',
    //borderRadius: getFontSize(2),
  },

  mainContainer: {
    padding: getFontSize(2),
    // paddingTop: getFontSize(4),
  },
  nameText: {
    fontSize: getFontSize(2),
    fontWeight: '600',
    textAlign: 'center',
  },
  nameContainer: {
    marginBottom: getFontSize(2),
  },
  close: {
    right: getFontSize(0),
    alignSelf: 'flex-end',
    marginBottom: getFontSize(1),
  },
});
