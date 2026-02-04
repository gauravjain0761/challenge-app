import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Challenge, ChallengeInfo} from '../types';
import {Colors} from '../constants/Colors';
import {formatDate, getFontSize} from '../utils/responsiveFn';
import {useLocalSearchParams, useRouter} from 'expo-router';
import FastImage from 'react-native-fast-image';
import {ChallengeMode} from '@/types/enums';
import {ChallengeListItem} from '@/validation/schemas/explore.schema';
import ProgressBar from './myChallenges/ProgressBar';
import IconComponent from './IconComponent';
import {Images} from '@/assets/images';

interface ChallengeItemProps {
  item: ChallengeListItem;
  exploreChallenge?: boolean;
  todayChallenge?: boolean;
  isProgressShow?: boolean;
  onPress?: () => void;
  isWidth?: boolean;
  isShowLockIcon?: boolean;
  containerStyle?: ViewStyle;
}
const SCREEN_WIDTH = Dimensions.get('window').width;

const ChallengeItem: React.FC<ChallengeItemProps> = ({
  item,
  exploreChallenge,
  todayChallenge = false,
  isProgressShow = false,
  onPress = () => {},
  isWidth,
  isShowLockIcon = true,
  containerStyle,
}) => {
  const router = useRouter();

  const handlePress = () => {
    onPress();
    exploreChallenge
      ? router.push({
          pathname: '/(modals)/(exploreChallenges)/[id]',
          params: {
            id: item._id,
            challengeItem: JSON.stringify(item),
          },
        })
      : todayChallenge
      ? router.push({
          pathname: '/(modals)/(myChallenges)/(progressChallenges)/[id]',
          params: {
            id: item._id,
            challengeItem: JSON.stringify(item),
          },
        })
      : null;
  };
  return (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        {width: isWidth ? undefined : SCREEN_WIDTH * 0.92},
        containerStyle,
      ]}
      onPress={handlePress}>
      {/* Container for Image and Overlays */}
      <View style={styles.imageContainer}>
        {/* Image */}
        <FastImage
          source={
            item?.image
              ? {uri: item?.image}
              : require('../assets/images/iceBath.png')
          }
          style={[styles.challengeImage]}
          resizeMode={FastImage.resizeMode.stretch}
        />
        {isShowLockIcon &&
          (item?.hasAccess === false ? (
            <FastImage
              source={Images.locked}
              style={styles.lockIcon}
              resizeMode="contain"
            />
          ) : (
            <FastImage
              source={Images.free}
              style={styles.lockIcon}
              resizeMode="contain"
            />
          ))}

        {/* Black Glow Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
          style={styles.gradientOverlay}
        />

        {todayChallenge && (
          <View style={styles.tag}>
            <View style={styles.dot} />
            <Text style={styles.tagText}>{item?.category}</Text>
          </View>
        )}

        {/* Challenge Info Over Image */}
        <View style={styles.infoOverlay}>
          <Text style={styles.challengeTitle}>{item?.name}</Text>
          {isProgressShow && (
            <ProgressBar
              currentDay={item?.totalDaysCompleted || 0}
              totalDays={item?.totalDays || 7}
            />
          )}
        </View>
        <View style={styles.viewContainer}>
          <View style={styles.view}>
            <Text style={styles.viewText}>{item.display_type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: SCREEN_WIDTH * 0.92,
    marginRight: getFontSize(0),
    marginBottom: getFontSize(2),
    borderRadius: getFontSize(1),
    overflow: 'hidden',
  },
  challengeCardSeeAll: {
    marginBottom: getFontSize(2),
    width: SCREEN_WIDTH * 0.92,
    marginRight: getFontSize(1),
  },
  imageContainer: {
    position: 'relative', // Enables absolute positioning for child elements
  },
  challengeImage: {
    width: '100%',
    height: getFontSize(20.4),
    backgroundColor: Colors.containerBGColor,
  },
  challengeImageSeeAll: {
    height: getFontSize(30),
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0, // Align at the bottom of the image
    left: 0,
    right: 0,
    height: '50%', // Cover the bottom half
  },
  tag: {
    position: 'absolute',
    top: getFontSize(1),
    left: getFontSize(1),
    backgroundColor: Colors.black,
    borderRadius: getFontSize(2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getFontSize(1.5),
    paddingVertical: getFontSize(1),
    gap: getFontSize(0.5),
  },
  dot: {
    width: getFontSize(1.2),
    height: getFontSize(1.2),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.orange,
  },
  tagText: {
    color: 'white',
    fontSize: getFontSize(1.5),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoOverlay: {
    position: 'absolute', // Overlay text on the image
    bottom: 0, // Align text to the bottom of the image
    left: 0,
    right: 0,
    padding: getFontSize(1),
  },
  challengeTitle: {
    color: 'white',
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    marginBottom: getFontSize(0.5),
  },
  challengeParticipants: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    marginBottom: getFontSize(0.5),
    fontWeight: '400',
  },
  progressContainer: {
    backgroundColor: Colors.orange,
    paddingTop: getFontSize(1.2),
    paddingBottom: getFontSize(1.2),
    width: getFontSize(16),
    borderRadius: getFontSize(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTime: {
    color: Colors.orange,
    fontSize: getFontSize(1.5),
    fontWeight: '400',
  },
  viewContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: getFontSize(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    width: getFontSize(20.4),
    height: getFontSize(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blackOpacity4,
    transform: [{rotate: '-90deg'}],
  },
  viewText: {
    color: Colors.defaultCalenderColor, // light gray text
    fontSize: getFontSize(1.8),
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockIcon: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    height: getFontSize(7),
    width: getFontSize(7),
  },
});

export default memo(ChallengeItem);
