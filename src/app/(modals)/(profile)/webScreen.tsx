import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '@/components/HeaderBack';
import {useLocalSearchParams} from 'expo-router';
import {WebView} from 'react-native-webview';
import {GeneralStyle} from '@/constants/GeneralStyle';
import Loader from '@/components/Loader';
import {Colors} from '@/constants/Colors';
import GradientContainer from '@/components/GradientContainer';

const WebScreen = () => {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  return (
    <GradientContainer color={['#000', '#000', Colors.black]}>
      <HeaderBack title={params?.title as string} isBackground />

      <WebView
        source={{uri: (params?.url as string) || ''}}
        bounces={false}
        style={[GeneralStyle.flex, styles.webview]}
        onLoadEnd={() => setIsLoading(false)}
      />

      {isLoading && <Loader />}
    </GradientContainer>
  );
};

export default WebScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    backgroundColor: 'transparent',
  },
});
