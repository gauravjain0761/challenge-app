import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';

const Loader = ({isAutoJoining}: {isAutoJoining?: boolean}) => {
  return isAutoJoining ? (
    <View style={styles.container}>
      <FastImage
        source={Images.join_loader}
        style={{width: '100%', height: '100%'}}
        resizeMode="stretch"
      />
      <ActivityIndicator
        size={'large'}
        color={Colors.orange}
        animating
        style={{
          top: '60%',
          position: 'absolute',
          transform: [{scaleX: 2.5}, {scaleY: 2.5}],
        }}
      />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <View
        style={{
          height: getFontSize(10),
          width: getFontSize(10),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: getFontSize(1),
          backgroundColor: Colors._1e1e1e,
        }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },

  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 999,
  },
  headingText: {
    fontSize: getFontSize(4),
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    top: getFontSize(4),
  },
});
