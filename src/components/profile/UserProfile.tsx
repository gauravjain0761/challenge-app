import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectIsGuestUser, selectProfileData} from '@/features/authSlice';
import ImageModal from 'react-native-image-modal';
import {Images} from '@/assets/images';

const UserProfile = () => {
  const profile = useAppSelector(selectProfileData);
  const isGuest = useAppSelector(selectIsGuestUser);

  return (
    <View style={styles.container}>
      {profile?.profilePicture ? (
        <ImageModal
          source={{
            uri: profile?.profilePicture || '',
          }}
          resizeMode="cover"
          modalImageResizeMode="contain"
          style={styles.imageContainer}
        />
      ) : (
        <LinearGradient
          colors={[Colors._9C9A9A, Colors._893E00]}
          style={styles.imageContainer}>
          <Text style={styles.imageText}>
            {isGuest ? 'G' : profile?.name?.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
      )}
      <View>
        <Text style={styles.name}>{isGuest ? 'Guest' : profile?.name}</Text>
        {profile?.email && <Text style={styles.email}>{profile?.email}</Text>}
      </View>
    </View>
  );
};

export default memo(UserProfile);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getFontSize(3),
    gap: getFontSize(1.5),
  },
  imageContainer: {
    width: getFontSize(8),
    height: getFontSize(8),
    borderRadius: getFontSize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '700',
  },
  name: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '700',
  },
  email: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '700',
  },
});
