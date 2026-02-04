import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {useGuestSessionMutation} from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncTypes, MIX_PANEL_EVENTS, UNSURE_STEPS} from '@/types/enums';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';

const info7 = () => {
  const [guestSession, {isLoading}] = useGuestSessionMutation();
  const {personalizedCategories} = useAppSelector(state => state.auth);
  const handlePress = async () => {
    try {
      trackEvent(MIX_PANEL_EVENTS.onboarding_finished, {
        device_type: Platform.OS,
        entry_point: 'guest_mode',
        selected_preferences: UNSURE_STEPS.PERSONALISED_EXPERIENCE,
        category_selected: personalizedCategories,
      });
      await guestSession().unwrap();
      await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');
      router.push('/(tabs)/(today)');
    } catch (error) {
      console.error('Guest session failed:', error);
    }
  };

  return (
    <SafeAreaView
      style={[GeneralStyle.flex, {backgroundColor: Colors._2d2d2d}]}>
      <FastImage
        source={Images.grayGradient} // Replace with your video path
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.headingView}>
        <GradientText
          text={'Your Personalised\nexperience is ready.'}
          colors={[Colors.white, Colors._999999]}
          style={{...styles.headingText}}
          height={getFontSize(8)}
        />
        <FastImage
          source={Images.onBoardInfo3}
          resizeMode="stretch"
          style={styles.image}
        />
      </View>
      <Button title="Let's go" onPress={handlePress} disabled={isLoading} />
    </SafeAreaView>
  );
};

export default info7;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(3),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: getFontSize(33),
    marginTop: getFontSize(8),
  },
});
