import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {UserLeaderboardData} from '@/validation/schemas';
import {DEFAULT_MULTIPLE_LEVELS} from '@/types/enums';
import {Images} from '@/assets/images';
import LinearGradient from 'react-native-linear-gradient';
import ImageModal from 'react-native-image-modal';

type Props = {
  item: UserLeaderboardData;
  index: number;
};

const UserLeaderBoard = ({item, index}: Props) => {
  const findLevelName = useMemo(
    () => DEFAULT_MULTIPLE_LEVELS?.[item?.stats?.avgLevel || 0]?.name || '',
    [item],
  );

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.container, item?.isCurrentUser && styles.current]}>
        <View style={styles.indexView}>
          <Text style={styles.indexText}>{item?.position || index + 1}</Text>
        </View>
        <View style={styles.imageView}>
          {item?.profilePicture ? (
            <ImageModal
              style={styles.profileImage}
              resizeMode="cover"
              modalImageResizeMode="contain"
              source={{
                uri: item?.profilePicture || '',
              }}
            />
          ) : (
            <LinearGradient
              colors={[Colors._9C9A9A, Colors._893E00]}
              style={styles.profileImage}>
              <Text style={styles.imageText}>
                {item?.name?.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.detailView}>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>
              {item?.name?.split(' ')[0] || ''}
            </Text>
            <ImageBackground
              source={Images.badge_bg}
              resizeMode="stretch"
              style={styles.badge}>
              <Text style={styles.levelTitle}>{findLevelName || ''}</Text>
            </ImageBackground>
          </View>
          <View style={styles.nameView}>
            <Text style={styles.statsText}>
              {item?.stats?.totalStarted || 0} Started
            </Text>

            <Text style={styles.statsText}>
              {item?.stats?.totalCompleted || 0} Completed
            </Text>
            <Text style={styles.statsText}>
              {item?.stats?.totalFailed || 0} Failed
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(UserLeaderBoard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(2),
    paddingVertical: getFontSize(1.5),
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

  detailView: {
    gap: 5,
    flex: 1,
  },

  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.6),
    flex: 1,
  },
  nameText: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    flex: 1,
  },
  statsText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    fontWeight: '500',
    opacity: 0.6,
  },
  badge: {
    height: getFontSize(4),
    width: getFontSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '600',
    // padding: getFontSize(0.5),
  },

  profileImage: {
    width: getFontSize(6),
    height: getFontSize(6),
    borderRadius: getFontSize(3),
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '700',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
