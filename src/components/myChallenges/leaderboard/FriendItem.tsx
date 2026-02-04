import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {LeaderboardEntry, ParticipantList} from '@/validation/schemas';
import {DEFAULT_MULTIPLE_LEVELS} from '@/types/enums';

type Props = {
  item: ParticipantList;
  index: number;
};

const FriendItem = ({item, index}: Props) => {
  const levelName =
    DEFAULT_MULTIPLE_LEVELS.find((_, n) => n === item?.selectedLevelIndex)
      ?.name ?? '';

  return (
    <View style={[styles.container]}>
      <View style={styles.imageView}>
        <FastImage
          source={require('../../../assets/images/identityJournal.png')}
          style={styles.imageStyle}
        />
        {item?.isRealFriend && (
          <View style={styles.friendView}>
            <Text style={styles.friendText}>Friend</Text>
          </View>
        )}
      </View>
      <View style={styles.detailView}>
        <View style={styles.nameView}>
          <Text style={styles.nameText}>{item?.name || ''}</Text>
          <ImageBackground
            source={Images.badge_bg}
            resizeMode="contain"
            style={styles.badge}>
            <Text style={styles.levelTitle}>
              {/* {item?.selectedLevelIndex || ''} */}
              {levelName}
            </Text>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

export default memo(FriendItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(2),
    paddingVertical: getFontSize(1),
    paddingHorizontal: getFontSize(1),
  },
  current: {
    borderWidth: 1,
    borderColor: Colors._C05600,
    marginVertical: getFontSize(0.5),
  },

  indexView: {
    width: getFontSize(4.5),
    height: getFontSize(4.5),
    borderRadius: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.textInputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
  },

  imageView: {
    alignItems: 'center',
  },

  imageStyle: {
    width: getFontSize(6),
    height: getFontSize(6),
    borderRadius: getFontSize(5),
  },

  friendView: {
    backgroundColor: Colors.white,
    paddingVertical: getFontSize(0.5),
    borderRadius: getFontSize(3),
    position: 'absolute',
    bottom: -getFontSize(1),
    width: '100%',
    alignItems: 'center',
  },
  friendText: {
    color: Colors.black,
    fontSize: getFontSize(1.5),
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  detailView: {
    gap: 5,
  },

  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  nameText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  badge: {
    paddingHorizontal: getFontSize(1.5),
  },
  levelTitle: {
    color: 'white',
    fontSize: getFontSize(1.8),
    fontWeight: '600',
    padding: getFontSize(0.5),
  },
});
