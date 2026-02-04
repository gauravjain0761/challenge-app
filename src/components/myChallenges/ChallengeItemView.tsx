import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useRouter} from 'expo-router';
import FastImage from 'react-native-fast-image';
import {formatDate, getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {ChallengeData} from '@/validation/schemas';
import ProgressBar from './ProgressBar';

interface ChallengeItemProps {
  item: ChallengeData;
  onPress?: () => void;
  isProgressShown?: boolean;
  isType?: 'Live' | 'Next' | 'Past';
}

const ChallengeItemView: React.FC<ChallengeItemProps> = ({
  item,
  onPress = () => {},
  isProgressShown = true,
  isType = 'Live',
}) => {
  const router = useRouter();

  const handlePress = () => {
    onPress();
    router.push({
      pathname:
        isType === 'Past'
          ? '/(modals)/(myChallenges)/(pastChallenges)/[id]'
          : isType === 'Live'
          ? '/(modals)/(myChallenges)/(progressChallenges)/[id]'
          : '/(modals)/(myChallenges)/(scheduledChallenges)/[id]',
      params: {
        id: item._id,
        challengeItem: JSON.stringify(item),
      },
    });
  };

  const returnType = () => {
    switch (isType) {
      case 'Live':
        return 'Ongoing';
      case 'Next':
        return 'Live ' + (item?.startDate ? formatDate(item?.startDate) : '');
      case 'Past':
        return item?.status;
      default:
        return 'Ongoing';
    }
  };

  const returnColor = () => {
    switch (isType) {
      case 'Live':
        return Colors.primary;
      case 'Next':
        return Colors.primary;
      case 'Past':
        return item?.status === 'Completed' ? Colors.green : Colors.red;
      default:
        return Colors.primary;
    }
  };
  return (
    <TouchableOpacity
      style={[styles.challengeCardSeeAll]}
      onPress={handlePress}>
      {/* Container for Image and Overlays */}
      <View style={styles.imageContainer}>
        {/* Image */}
        <FastImage
          source={
            item?.challengeImage ? {uri: item?.challengeImage} : Images.iceBath
          }
          style={[styles.challengeImage]}
          resizeMode={FastImage.resizeMode.stretch}
        />

        {/* Black Glow Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
          style={styles.gradientOverlay}
        />

        {/* {item?.challengeMode !== ChallengeMode.GROUP && ( */}
        <View style={styles.tag}>
          <View style={[styles.dot, {backgroundColor: returnColor()}]} />
          <Text style={styles.tagText}>
            {/* Ongoing: {item?.startDate && formatDate(item?.startDate)} */}
            {returnType()}
          </Text>
        </View>
        {/* )} */}

        {/* Challenge Info Over Image */}
        <View style={styles.infoOverlay}>
          <Text style={styles.challengeTitle}>{item?.challengeName}</Text>
          {isProgressShown && (
            <ProgressBar
              currentDay={item?.totalDaysCompleted || 0}
              totalDays={item?.totalDays || 0}
            />
          )}

          {/* {myChallenge ? (
            <View style={styles.progressContainer}>
              <Text
                style={{
                  ...styles.challengeParticipants,
                  position: 'absolute',
                }}>
                {item?.progress}
              </Text>
            </View>
          ) : null} */}
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
  challengeCardSeeAll: {
    marginRight: getFontSize(2),
    width: getFontSize(45),
    borderRadius: getFontSize(1),
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative', // Enables absolute positioning for child elements
  },
  challengeImage: {
    width: '100%',
    height: getFontSize(23),
    backgroundColor: Colors.containerBGColor,
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
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(1),
    borderRadius: getFontSize(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  liveTag: {
    backgroundColor: Colors.black, // Different background for Live tag
  },
  dot: {
    width: getFontSize(1),
    height: getFontSize(1),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.orange,
  },
  tagText: {
    color: 'white',
    fontSize: getFontSize(1.5),
    fontWeight: '600',
    textTransform: 'capitalize',
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
    width: getFontSize(23),
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
});

export default memo(ChallengeItemView);
