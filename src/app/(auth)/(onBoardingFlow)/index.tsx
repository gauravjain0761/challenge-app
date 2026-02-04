import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {MIX_PANEL_EVENTS, ONBOARDING_STEPS} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {trackEvent} from '@/hooks/useMixpanelClient';

const index = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const handlePress = () => {
    trackEvent(MIX_PANEL_EVENTS.onboarding_started, {
      device_type: Platform.OS,
      entry_point: 'guest_mode',
    });

    if (isSelected === ONBOARDING_STEPS.PERSONALISED_EXPERIENCE) {
      router.dismissTo(`../(onBoardingFlow)/(mainPersonalExp)`);
    } else if (isSelected === ONBOARDING_STEPS.JUST_TAKE_ACTION) {
      router.dismissTo(`../(onBoardingFlow)/justTakeAction`);
    }
    // else if (isSelected === ONBOARDING_STEPS.UNSURE) {
    //   router.dismissTo(`../(onBoardingFlow)/unSure`);
    // }
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
            text={''}
            style={styles.heading}
            height={getFontSize(8)}
          />
          <GradientText
            text={
              'Choose 1 option below and let’s \nget this challenge \nstarted.  '
            }
            style={styles.subHeading}
            height={getFontSize(14)}
          />

          <SelectionList
            data={[...Object.values(ONBOARDING_STEPS)]}
            selected={setSelected}
            setSelectedItem={setSelected}
          />
        </View>
        {isSelected && (
          <Button
            title="Let’s go for it"
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
          />
        )}
        <Text
          style={styles.loginText}
          onPress={() => router.push('/(auth)/logIn')}>
          Already have an account? Log in
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default index;

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
    marginTop: getFontSize(5),
    flex: 1,
  },
  loginText: {
    fontSize: getFontSize(2),
    fontWeight: '600',
    textAlign: 'center',
    color: Colors._C05600,
    paddingHorizontal: getFontSize(2),
    textDecorationLine: 'underline',
  },
});
