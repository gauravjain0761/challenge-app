import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import ProgressBar from '@/constants/ProgressBar';
import GradientText from '@/components/GradientText';

const PreChallengeView = ({
  remaining = 0,
  total = 0,
  challengeName,
}: {
  total: number;
  remaining: number;
  challengeName: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text
          style={
            styles.heading
          }>{`YOUR PRE CHALLENGE\n${challengeName} RATING:`}</Text>

        <GradientText
          text={`${remaining}/${total}`}
          colors={[Colors._555555, Colors._BBBBBB]}
          start={{x: 0.3, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.headingText}
          containerStyle={{
            marginTop: -20,
            right: -getFontSize(38),
            top: -20,
          }}
        />
      </View>
      <ProgressBar total={total} remaining={remaining} />
    </View>
  );
};

export default PreChallengeView;

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
    paddingVertical: getFontSize(0.5),
    justifyContent: 'center',
    gap: getFontSize(0.5),
  },
  row: {},
  heading: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  headingText: {
    // textAlign: 'center',
    fontSize: getFontSize(3),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
