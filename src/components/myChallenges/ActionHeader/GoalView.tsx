import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import CircularProgress from './CircularProgress';

const GoalView = ({
  goalName,
  total,
  remaining,
  challengeName,
}: {
  goalName?: string;
  total: number;
  remaining: number;
  challengeName?: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <CircularProgress total={total} remaining={remaining} />
        <Text style={styles.heading}>{'TODAY’S\nGOAL'}</Text>
      </View>
      <ImageBackground
        source={Images.badge_bg}
        resizeMode="stretch"
        style={styles.badge}>
        <Text style={GeneralStyle.levelText}>{challengeName || ''}</Text>
        <Text style={GeneralStyle.levelText}>{goalName || 'Goal'}</Text>
      </ImageBackground>
    </View>
  );
};

export default GoalView;

const styles = StyleSheet.create({
  container: {
    paddingTop: getFontSize(1.5),
    paddingBottom: getFontSize(1.5),
    backgroundColor: Colors.textInputBackground,
    borderRadius: 8,
    borderWidth: 0.9,
    borderColor: Colors.borderColor,
    // flex: 1,
    paddingHorizontal: getFontSize(1.5),
    paddingVertical: getFontSize(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    height: getFontSize(7),
    width: getFontSize(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    flexDirection: 'row',
    gap: getFontSize(1.5),
  },
  heading: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '400',
  },
});
