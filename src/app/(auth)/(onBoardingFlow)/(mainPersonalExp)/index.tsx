import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {PERSONAL_EXP_STEPS} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setPersonalizedCategories} from '@/features/authSlice';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const index = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const handlePress = () => {
    dispatch(setPersonalizedCategories(isSelected as any));
    router.dismissTo('../(mainPersonalExp)/info2');
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
        <OnBoardingProgressBar step={1} />

        <View style={styles.headingView}>
          <GradientText
            text={'What area of your life are you\nmost looking to improve?'}
            style={styles.headingText}
            height={getFontSize(11)}
          />

          <SelectionList
            data={[...Object.values(PERSONAL_EXP_STEPS)]}
            selected={setSelected}
            setSelectedItem={setSelected}
          />
        </View>
        {isSelected && (
          <Button
            title="Let’s Start this"
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
          />
        )}
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
  headingText: {
    fontSize: getFontSize(2.6),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    flex: 1,
  },
});
