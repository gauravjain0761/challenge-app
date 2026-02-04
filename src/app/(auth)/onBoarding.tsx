import {Images} from '@/assets/images';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import {Colors} from '@/constants/Colors';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useAuth} from '@/hooks/useAuth';
import {AsyncTypes} from '@/types/enums';
import {getFontSize} from '@/utils/responsiveFn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Redirect, router, useNavigation} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const {isLoading} = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkOnboardingAndNavigate = async () => {
      try {
        const completed = await AsyncStorage.getItem(
          AsyncTypes.ONBOARDING_COMPLETED,
        );
        setIsOnboardingCompleted(completed);
        if (completed === 'true') {
          // router.push('./logIn');
          console.log('isOnboardingCompleted', completed);
        } else {
          const time = setTimeout(() => {
            router.dismissTo('./(onBoardingFlow)/');
          }, 2000);
          return () => clearTimeout(time);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        const time = setTimeout(() => {
          router.dismissTo('./(onBoardingFlow)/');
        }, 2000);
        return () => clearTimeout(time);
      }
    };

    checkOnboardingAndNavigate();
  }, []);

  return (
    <SafeAreaView
      style={[GeneralStyle.flex, {backgroundColor: Colors._2d2d2d}]}>
      <StatusBar style="light" />
      {/* Background Video */}
      <FastImage
        source={Images.onboard} // Replace with your video path
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>
          The harder the{'\n'}challenge the{'\n'}greater the growth
        </Text>
      </View>
      {/* <Video
        source={require('../../assets/images/onBoarding.mp4')} // Replace with your video path
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        repeat
        //muted
      />
      <View style={styles.overlay}>
        <Text style={{...styles.title, marginTop: getFontSize(5)}}>
          Take Massive
        </Text>
        <Text
          style={{
            ...styles.title,
            marginBottom: getFontSize(1),
            marginTop: getFontSize(-1),
          }}>
          Action
        </Text>
        <Text style={styles.subtitle}>- Tony Robbins -</Text>
      </View> */}
      {isOnboardingCompleted === 'true' && (
        <View style={styles.buttonView}>
          <Button
            title="Signup"
            onPress={() => navigation.navigate('signUp' as never)}
            style={{width: '80%'}}
          />
          <Button
            title="Login"
            type="outline"
            onPress={() => navigation.navigate('logIn' as never)}
          />
        </View>
      )}
      {isLoading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay,
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(5),
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    textAlign: 'center',
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: getFontSize(5),
  },
});

export default OnboardingScreen;
