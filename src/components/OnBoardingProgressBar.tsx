import {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getFontSize} from '../utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const OnBoardingProgressBar = memo(({step}: {step: number}) => {
  const percentage = useMemo(() => (step / 6) * 100, [step]);

  return (
    <View style={styles.progressBar}>
      <LinearGradient
        colors={['rgba(137, 62, 0, 0.90)', 'rgba(137, 62, 0, 0.80)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[
          styles.progressFill,
          {
            width: `${percentage}%`,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  progressBar: {
    height: getFontSize(1.5),
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(1),
    overflow: 'hidden',
    width: '85%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
    marginTop: getFontSize(5),
    marginBottom: getFontSize(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: getFontSize(1),
  },
});

export default OnBoardingProgressBar;
