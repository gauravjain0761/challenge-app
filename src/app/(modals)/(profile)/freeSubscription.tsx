import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {router} from 'expo-router';

const freeSubscription = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <FastImage
          source={Images.frame_1}
          defaultSource={Images.frame_1}
          style={styles.image}
          resizeMode="stretch"
        />
        <View style={styles.backgroundView}>
          <FastImage
            source={Images.black_background}
            defaultSource={Images.black_background}
            style={styles.backgroundImage}
            resizeMode="stretch"
          />
          <Text style={styles.text}>
            We really want you{'\n'} to experience{'\n'} all our 150+ men{'\n'}{' '}
            challenges for free!
          </Text>
        </View>
        <Button
          onPress={() => {
            router.dismissTo('/(modals)/(profile)/subscription');
          }}
          title="Sounds Fair"
          style={{
            top: -getFontSize(10),
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default freeSubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: getFontSize(2),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backgroundView: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: SCREEN_WIDTH ,
    height: getFontSize(35),
  },
  text: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '700',
    textAlign: 'center',
    position: 'absolute',
  },
});
