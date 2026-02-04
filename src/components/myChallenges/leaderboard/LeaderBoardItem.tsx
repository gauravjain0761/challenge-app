import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {LeaderboardEntry} from '@/validation/schemas';
import IconComponent from '@/components/IconComponent';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import ImageModal from 'react-native-image-modal';
type Props = {
  item: LeaderboardEntry;
  index: number;
  onPressDots?: (item: LeaderboardEntry | null) => void;
  selectedUser?: LeaderboardEntry | null;
  onPressAdd?: () => void;
  onPressNudges?: () => void;
  senderId?: string | undefined;
  selectedLevelUnit?: string | null;
};

const LeaderBoardItem = ({
  item,
  index,
  onPressDots = () => {},
  selectedUser,
  onPressAdd = () => {},
  onPressNudges = () => {},
  senderId,
  selectedLevelUnit,
}: Props) => {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (senderId === item?.user?._id) {
      offset.value = withSequence(
        withTiming(-10, {duration: 150}),
        withTiming(10, {duration: 150}),
        withTiming(-10, {duration: 150}),
        withTiming(10, {duration: 150}),
        withTiming(0, {duration: 150}),
      );
    }
  }, [senderId, item]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));


  return (
    <TouchableWithoutFeedback onPress={() => onPressDots(null)}>
      <Animated.View style={animatedStyle}>
        <View style={[styles.container, item?.isCurrentUser && styles.current]}>
          <View style={styles.indexView}>
            <Text style={styles.indexText}>{item?.rank || index + 1}</Text>
          </View>
          <View style={styles.imageView}>
            {item?.user?.profilePicture ? (
              <ImageModal
                source={{
                  uri: item?.user?.profilePicture,
                }}
                style={styles.imageStyle}
                resizeMode="cover"
                modalImageResizeMode="contain"
              />
            ) : (
              <LinearGradient
                colors={[Colors._9C9A9A, Colors._893E00]}
                style={styles.imageContainer}>
                <Text style={styles.imageText}>
                  {item?.user?.name?.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}
            {item?.isFriend && (
              <View style={styles.friendView}>
                <Text style={styles.friendText}>Friend</Text>
              </View>
            )}
          </View>
          <View style={styles.detailView}>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>
                {item?.user?.name?.split(' ')[0] || ''}
              </Text>
              <ImageBackground
                source={Images.badge_bg}
                resizeMode="stretch"
                style={styles.badge}>
                <Text style={styles.levelTitle}>{item?.level || ''}</Text>
              </ImageBackground>
              {senderId === item?.user?._id && (
                <FastImage
                  source={Images.nudge}
                  defaultSource={Images.nudge}
                  style={styles.nudge}
                  tintColor={Colors._C05600}
                  resizeMode="stretch"
                />
              )}
            </View>
            <View style={styles.nameView}>
              <Text style={styles.statsText}>
                {item?.stats?.totalActionsCompleted || 0} Actions
              </Text>

              <Text style={styles.statsText}>
                {item?.stats?.totalDaysFailed || 0} Fails
              </Text>

              {item?.stats?.totalActionsSkipped !== undefined &&
              item?.stats?.totalActionsSkipped >= 0 ? (
                <Text style={styles.statsText}>
                  {item?.stats?.totalActionsSkipped || 0} Skips
                </Text>
              ) : null}

              {item?.stats?.totalCompletionCount !== undefined &&
              item?.stats?.totalCompletionCount >= 0 ? (
                <Text
                  style={[
                    styles.statsText,
                    {
                      textTransform: 'capitalize',
                      paddingLeft: getFontSize(0.5),
                    },
                  ]}>
                  {item?.stats?.totalCompletionCount || 0}{' '}
                  {selectedLevelUnit || ''}
                </Text>
              ) : null}

              {item?.stats?.bestCount !== undefined &&
              item?.stats?.bestCount >= 0 ? (
                <Text
                  style={[
                    styles.statsText,
                    {
                      textTransform: 'capitalize',
                      paddingLeft: getFontSize(0.2),
                    },
                  ]}>
                  {item?.stats?.bestCount || 0}{' '}
                  {item?.stats?.unit ? item?.stats?.unit : selectedLevelUnit}
                </Text>
              ) : null}
            </View>
          </View>
          {!item.isCurrentUser ? (
            <IconComponent
              size={getFontSize(3)}
              type="Entypo"
              name="dots-three-vertical"
              color={Colors.white}
              onPress={() => onPressDots(item)}
            />
          ) : (
            <View style={{width: getFontSize(3)}} />
          )}

          {selectedUser?.user._id === item?.user?._id ? (
            <View style={styles.dotContainer}>
              <TouchableOpacity
                style={{
                  ...styles.nameView,
                  padding: getFontSize(2),
                  gap: getFontSize(1),
                }}
                onPress={
                  item?.isFriend && item?.isFriend ? onPressNudges : onPressAdd
                }>
                {item?.isFriend && item?.isFriend ? (
                  <FastImage
                    source={Images.nudge}
                    defaultSource={Images.nudge}
                    style={styles.nudge}
                    tintColor={Colors.white}
                    resizeMode="stretch"
                  />
                ) : (
                  <IconComponent
                    size={getFontSize(2.5)}
                    type="Ionicons"
                    name="person-add"
                    color={Colors.white}
                  />
                )}
                <Text style={styles.dotText}>
                  {item?.isFriend && item?.isFriend ? 'Nudge' : 'Add friend'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(LeaderBoardItem, (prev, next) => {
  return (
    prev.item === next.item &&
    prev.selectedUser?.user._id === next.selectedUser?.user._id &&
    prev.senderId === next.senderId &&
    prev.selectedLevelUnit === next.selectedLevelUnit
  );
});
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
    width: getFontSize(7),
    height: getFontSize(7),
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
    fontWeight: '500',
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
  dotContainer: {
    position: 'absolute',
    right: getFontSize(2),
    backgroundColor: Colors._25201a,

    borderRadius: getFontSize(1),
  },
  dotText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
  },

  nudge: {
    width: getFontSize(3),
    height: getFontSize(3),
    left: getFontSize(0.3),
  },
  imageContainer: {
    width: getFontSize(7),
    height: getFontSize(7),
    borderRadius: getFontSize(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '700',
  },
});
