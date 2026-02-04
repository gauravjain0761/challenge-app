import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import Loader from '@/components/Loader';

const info6 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const handlePress = () => {
    setIsLoading(false);
    router.dismissTo('../(mainPersonalExp)/info7');
  };

  useEffect(() => {
    const time = setTimeout(() => {
      handlePress();
    }, 3000);
    return () => clearTimeout(time);
  }, []);
  return (
    <SafeAreaView
      style={[GeneralStyle.flex, {backgroundColor: Colors._2d2d2d}]}>
      <FastImage
        source={Images.grayGradient} // Replace with your video path
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.headingView}>
        <GradientText
          text={'Building Your Personalised\nExperience'}
          colors={[Colors.white, Colors._999999]}
          style={{...styles.headingText}}
          height={getFontSize(8)}
        />
        <GradientText
          text={'Greatness is close...'}
          style={{...styles.headingText}}
          height={getFontSize(5)}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FastImage
            source={Images.onBoardInfo2}
            resizeMode="stretch"
            style={styles.image}
          />
          <ActivityIndicator
            size={'large'}
            color={Colors.orange}
            animating
            style={{
              position: 'absolute',
              transform: [{scaleX: 2.5}, {scaleY: 2.5}],
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default info6;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(3),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  image: {
    width: '100%',
    height: getFontSize(23),
    marginTop: getFontSize(3),
  },
});
