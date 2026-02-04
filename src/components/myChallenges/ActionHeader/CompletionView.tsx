import {AppState, StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import GradientText from '@/components/GradientText';

const CompletionView = ({day}: {day?: number}) => {
  const getRandomValue = useMemo(
    () => () => {
      const min = 5;
      const max = 15;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    [],
  );

  return (
    <View style={styles.container}>
      <FastImage
        source={Images.trend_up}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <View style={styles.detail}>
        <Text style={styles.heading}>Top {getRandomValue()}% Men</Text>
        <GradientText
          text={`DAY ${day} ACTION COMPLETION %`}
          colors={[Colors.white, Colors._9C9A9A]}
          style={styles.action}
        />
      </View>
    </View>
  );
};

export default memo(CompletionView);

const styles = StyleSheet.create({
  container: {
    paddingTop: getFontSize(1.5),
    paddingBottom: getFontSize(1.5),
    backgroundColor: Colors.textInputBackground,
    borderRadius: 8,
    borderWidth: 0.9,
    borderColor: Colors.borderColor,
    flex: 1,
    paddingHorizontal: getFontSize(1.5),
    paddingVertical: getFontSize(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(2),
  },
  imageStyle: {
    height: getFontSize(4.8),
    width: getFontSize(4.8),
  },

  detail: {
    flex: 1,
    gap: getFontSize(0.5),
  },
  heading: {
    fontSize: getFontSize(3),
    color: Colors._555555,
    fontWeight: '400',
  },
  action: {
    fontSize: getFontSize(2),
    color: Colors._555555,
    fontWeight: '600',
  },
});
