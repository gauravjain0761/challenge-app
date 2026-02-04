import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import IconComponent from '../IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';

type Props = {
  image: string;
  title: string;
  onBack: () => void;
};

const HeaderSection = ({image, title, onBack}: Props) => {
  return (
    <View style={styles.imageContainer}>
      <FastImage
        source={
          image ? {uri: image} : require('@/assets/images/drinkWater.png')
        }
        style={styles.headerImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(7, 7, 7, 0.77)']}
        style={styles.gradientOverlay}
      />

      <IconComponent
        name="left"
        size={getFontSize(3)}
        color={Colors.white}
        style={styles.backButton}
        onPress={onBack}
      />
      <View style={styles.headerOverlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default memo(HeaderSection);

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: getFontSize(25),
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    bottom: getFontSize(15),
    left: getFontSize(1.5),
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: getFontSize(2),
    left: getFontSize(1.5),
  },
  title: {
    fontSize: getFontSize(3),
    color: Colors.white,
    fontWeight: '600',
  },
});
