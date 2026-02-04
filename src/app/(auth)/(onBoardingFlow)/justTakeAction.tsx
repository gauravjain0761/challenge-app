import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {useGuestSessionMutation} from '@/api/authApi';
import {router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncTypes, MIX_PANEL_EVENTS, UNSURE_STEPS} from '@/types/enums';
import {trackEvent} from '@/hooks/useMixpanelClient';

const JustTakeAction = () => {
  const [guestSession, {isLoading}] = useGuestSessionMutation();

  const handlePress = async () => {
    try {
      trackEvent(MIX_PANEL_EVENTS.onboarding_finished, {
        device_type: Platform.OS,
        entry_point: 'guest_mode',
        selected_preferences: UNSURE_STEPS.TAKE_ACTION_NOW,
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
      <View style={GeneralStyle.flex}>
        <FastImage
          source={Images.Men_Tools_Logo} // Replace with your video path
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headingView}>
          <GradientText
            text={'72% OF MEN'}
            colors={[Colors.white, Colors._999999]}
            style={styles.headingText}
            height={getFontSize(5)}
          />
          <GradientText
            text={'Complete over 3\nchallenges'}
            colors={[Colors.white, Colors._999999]}
            style={styles.headingText1}
            height={getFontSize(8)}
          />
          <GradientText
            text={'You?'}
            style={styles.headingText2}
            height={getFontSize(5)}
          />
          <FastImage
            source={Images.onBoardInfo1}
            resizeMode="stretch"
            style={styles.image}
          />
        </View>
        <Button title="Ready" onPress={handlePress} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default JustTakeAction;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(3.6),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headingText1: {
    fontSize: getFontSize(2.8),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: getFontSize(0.5),
  },
  headingText2: {
    fontSize: getFontSize(3.6),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headingView: {
    flex: 1,
    // gap: 10,
    justifyContent: 'center',
    marginTop: getFontSize(-10),
  },
  image: {
    width: '100%',
    height: getFontSize(23),
    marginTop: getFontSize(10),
  },
});
