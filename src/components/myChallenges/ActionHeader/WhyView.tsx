import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import GradientText from '@/components/GradientText';

const WhyView = ({why}: {why?: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.yourText}>YOUR WHY?</Text>
      <GradientText
        text={why || `TO GET A 6 PACK`}
        style={styles.whyText}
        height={why && why?.length > 35 ? getFontSize(6.3) : getFontSize(3)}
      />
    </View>
  );
};

export default WhyView;

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
  },
  yourText: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '400',
    marginBottom: getFontSize(1),
    textAlign: 'center',
  },
  whyText: {
    fontSize: getFontSize(2.4),
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
