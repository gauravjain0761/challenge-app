import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import {router} from 'expo-router';
import FastImage from 'react-native-fast-image';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {setFreePlan} from '@/features/authSlice';

const YourPlan = () => {
  const dispatch = useAppDispatch();
  const {freePlan} = useAppSelector(state => state.auth);
  return (
    <TouchableOpacity
      onPress={() => {
        if (freePlan) {
          router.push('/(modals)/(profile)/subscription');
        } else {
          dispatch(setFreePlan(true));
          router.push('/(modals)/(profile)/freeSubscription');
        }
      }}
      style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.plan}>Your plan</Text>
        <Text style={styles.plan2}>Free</Text>
      </View>

      <ImageBackground
        source={Images.badge_bg}
        resizeMode="contain"
        style={styles.badge}>
        <FastImage
          source={Images.crown}
          style={{height: getFontSize(2), width: getFontSize(2)}}
          resizeMode="contain"
        />
        <Text style={styles.levelTitle}>Upgrade</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default memo(YourPlan);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.orangeOpacity2,
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: getFontSize(1),
    marginTop: getFontSize(3),
    padding: getFontSize(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  plan: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
  plan2: {
    color: Colors.primary,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
  },
  textContainer: {
    gap: getFontSize(1),
  },
  badge: {
    padding: getFontSize(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  levelTitle: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '600',
  },
});
