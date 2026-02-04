import React, {useState, useEffect} from 'react';
import HeaderBack from '@/components/HeaderBack';
import GradientContainer from '@/components/GradientContainer';
import {StyleSheet, View, Alert} from 'react-native';
import {Colors} from '@/constants/Colors';
import {WebView} from 'react-native-webview';
import Loader from '@/components/Loader';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useFeaturebaseEmbedTokenMutation} from '@/api/authApi';

const FeedbackFeaturebase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [getFeaturebaseToken] = useFeaturebaseEmbedTokenMutation();

  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        const {token} = await getFeaturebaseToken({}).unwrap();
        const url = `https://feedback.mentoolschallenges.co/?jwt=${encodeURIComponent(token)}`;
        setEmbedUrl(url);
      } catch (error: any) {
        console.error('Error getting embed token:', error);
        Alert.alert('Error', 'Unable to load feedback view. Please try again later.');
        // Fallback to non-authenticated URL
        setEmbedUrl('https://feedback.mentoolschallenges.co/');
      }
    };

    fetchEmbedToken();
  }, []);

  return (
    <GradientContainer color={['#000', '#000', Colors.black]}>
      <HeaderBack title={'Feedback and Roadmap'} isBackground />
      <View style={styles.container}>
        {embedUrl && (
          <WebView
            source={{uri: embedUrl}}
            onLoadEnd={() => setIsLoading(false)}
            bounces={false}
            style={[GeneralStyle.flex, styles.webview]}
          />
        )}
      </View>
      {isLoading && <Loader />}
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default FeedbackFeaturebase;
