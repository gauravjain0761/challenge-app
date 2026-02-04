import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Icon, Title} from '../types';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {router} from 'expo-router';
import IconComponent from './IconComponent';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectIsGuestUser, selectProfileData} from '@/features/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import {DEFAULT_MULTIPLE_LEVELS} from '@/types/enums';
import LevelInstructionModal from './LevelInstructionModal/LevelInstructionModal';

interface HeaderProps {
  title: Title;
  icon?: Icon;
}

export const Header: React.FC<HeaderProps> = ({title, icon}) => {
  const onPressProfile = () => {
    router.push('/(modals)/(profile)');
  };
  const profile = useAppSelector(selectProfileData);
  const isGuest = useAppSelector(selectIsGuestUser);
  const [isVisible, setIsVisible] = React.useState(false);

  const findLevelName = useMemo(
    () => DEFAULT_MULTIPLE_LEVELS?.[profile?.stats?.avgLevel || 0]?.name || '',
    [profile?.stats?.avgLevel],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={!icon}
        onPress={icon ? () => router.back() : () => {}}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon ? (
          <IconComponent
            name="left"
            size={24}
            color={Colors.white}
            //onPress={() => router.back()}
          />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.profile}>
        {icon ? null : (
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <ImageBackground
              source={Images.badge_bg}
              resizeMode="stretch"
              style={styles.badge}>
              <Text style={styles.levelText}>{findLevelName || ''}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onPressProfile}>
          {profile?.profilePicture ? (
            <FastImage
              style={styles.profileImage}
              resizeMode="contain"
              source={{
                uri: profile?.profilePicture || '',
              }}
            />
          ) : (
            <LinearGradient
              colors={[Colors._9C9A9A, Colors._893E00]}
              style={styles.profileImage}>
              <Text style={styles.imageText}>
                {isGuest ? 'G' : profile?.name?.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
      {isVisible && (
        <LevelInstructionModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: Colors.dark.background,
    width: '95%',
    alignSelf: 'center',
    marginTop: isIphoneX() ? getFontSize(7) : getFontSize(3.5),
  },
  title: {
    color: 'white',
    fontSize: getFontSize(2.5),
    fontWeight: 'bold',
    marginRight: getFontSize(0.5),
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressRing: {
    width: getFontSize(5),
    height: getFontSize(5),
    borderRadius: getFontSize(2.5),
    borderWidth: 2,
    borderColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  progressText: {
    color: 'white',
    fontSize: getFontSize(1.8),
  },
  profileImage: {
    width: getFontSize(6),
    height: getFontSize(6),
    borderRadius: getFontSize(3),
    marginLeft: getFontSize(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getFontSize(1.5),
    gap: getFontSize(1),
  },
  levelText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '600',
  },
  imageText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '700',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    height: getFontSize(4),
    width: getFontSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
