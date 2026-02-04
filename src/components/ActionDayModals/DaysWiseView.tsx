import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useAppSelector} from '@/hooks/reduxHooks';

const DaysWiseView = ({days}: {days: any}) => {
  const {user} = useAppSelector(state => state.auth);
  const getDescription = () => {
    switch (days) {
      case 1:
        return (
          user?.name + ' are you ready to take action\nand challenge yourself?'
        );
      case 2:
        return `Back for more ${user?.name}! Nice one,\nlet’s do this.`;
      case 3:
        return `I am proud of your ${user?.name}, you\nare a man of your word.`;
      case 4:
        return `Well done for making it to day 4 ${user?.name},\nkeep the momentum going.`;
      case 5:
        return `You are over half way ${user?.name},\nI think we are all a little surprised.`;
      case 6:
        return `No stopping you now ${user?.name}.`;
      case 7:
        return `Last day. Well done ${user?.name}.`;

      default:
        return '';
    }
  };
  return (
    <View>
      <GradientText
        text={`DAY ` + days}
        colors={['#C05600', '#9C9A9A']}
        style={styles.headingText}
      />
      <GradientText
        text={`Challenge ON!`}
        colors={['#C05600', '#9C9A9A']}
        style={styles.headingText}
      />

      <GradientText
        text={getDescription()}
        colors={['#555555', '#D1D1D6']}
        style={styles.description}
        height={getFontSize(7)}
        containerStyle={{
          marginTop: getFontSize(3),
          marginVertical: getFontSize(2),
        }}
      />
    </View>
  );
};

export default DaysWiseView;

const styles = StyleSheet.create({
  headingText: {
    fontSize: getFontSize(4.5),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: getFontSize(2.1),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
});
