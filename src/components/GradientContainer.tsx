import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import Loader from './Loader';

const GradientContainer = ({
  isLoading,
  children,
  color,
}: {
  isLoading?: boolean;
  children: React.ReactNode;
  color?: string[];
}) => {
  return (
    <LinearGradient
      colors={color ? color : ['#000', '#000', Colors.orangeOpacity]} // Adjust gradient colors
      style={styles.container}>
      {isLoading && <Loader />}

      <SafeAreaView style={styles.header}>
        <View style={styles.mainContainer}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GradientContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    // width: '92%',
    // paddingHorizontal: getFontSize(2),
    // alignSelf: 'center',
    // marginTop: getFontSize(7),
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: getFontSize(2),
  },
});
