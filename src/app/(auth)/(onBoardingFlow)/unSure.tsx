import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {UNSURE_STEPS, AsyncTypes, MIX_PANEL_EVENTS} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {useGuestSessionMutation} from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '@/constants/Colors';
import {trackEvent} from '@/hooks/useMixpanelClient';

const UnSure = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const [guestSession, {isLoading}] = useGuestSessionMutation();

  const handlePress = async () => {
    if (isSelected === UNSURE_STEPS.PERSONALISED_EXPERIENCE) {
      router.dismissTo(`../(onBoardingFlow)/(mainPersonalExp)`);
    } else if (isSelected === UNSURE_STEPS.TAKE_ACTION_NOW) {
      router.dismissTo(`./justTakeAction`);
    } else if (isSelected === UNSURE_STEPS.LOOK_AROUND) {
      try {
        trackEvent(MIX_PANEL_EVENTS.onboarding_finished, {
          device_type: Platform.OS,
          entry_point: 'guest_mode',
          selected_preferences: isSelected,
        });
        await guestSession().unwrap();
        await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');
        router.push('/(tabs)/(today)');
      } catch (error) {
        console.error('Guest session failed:', error);
      }
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
            text={'Taking action is about making\nhard decisions.'}
            style={styles.heading}
            height={getFontSize(7.5)}
          />
          <GradientText
            text={
              'Use this opportunity to break the\nold indecisive habits and become\na man of action.'
            }
            style={styles.subHeading}
            height={getFontSize(15)}
          />

          <SelectionList
            data={[...Object.values(UNSURE_STEPS)]}
            selected={setSelected}
            setSelectedItem={setSelected}
          />
        </View>
        {isSelected && (
          <Button
            title="Let’s Do This"
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
            isLoading={isLoading && isSelected === UNSURE_STEPS.LOOK_AROUND}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UnSure;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  heading: {
    fontSize: getFontSize(3),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  subHeading: {
    fontSize: getFontSize(2.6),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    marginTop: getFontSize(2),
    flex: 1,
    gap: 10,
  },
});
