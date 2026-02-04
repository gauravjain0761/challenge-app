import React, {useEffect, useRef} from 'react';
import {router, Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from 'expo-font';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {store, persistor} from '@/store';
import {useColorScheme} from '@/hooks/useColorScheme';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Animated, Easing, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {AudioModule} from 'expo-audio';
import branch from 'react-native-branch';
import ChallengeCompleteModal from '@/components/myChallenges/ChallengeCompleteModal';
import ToastConfig from '@/components/ToastConfig';
import useOneSignal from '@/hooks/useOneSignal';
import BranchHandler from '@/components/deeplinking/BranchHandler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WalkthroughProvider} from 'react-native-interactive-walkthrough';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import '@/global/TextDefaults';
import {useAuth} from '@/hooks/useAuth';
import {initMixpanel} from '@/hooks/useMixpanelClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const lineAnim = useRef(new Animated.Value(1)).current;
  const [isCompleteModalVisible, setIsCompleteModalVisible] =
    React.useState<boolean>(false);
  const [userChallengeId, setUserChallengeId] = React.useState<string>('');

  // ✅ Handles OneSignal logic
  useOneSignal(setIsCompleteModalVisible, setUserChallengeId);

  useEffect(() => {
    initMixpanel();

    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const apiKey =
      Platform.OS === 'android'
        ? 'REVENUECAT_ANDROID_SDK_KEY'
        : 'appl_ENUFMJwkbbcrvlONBwGeTEbysdj';

    Purchases.configure({apiKey});
  }, []);

  useEffect(() => {
    (async () => {
      const initial = await branch.getLatestReferringParams();
      const {'+clicked_branch_link': initialClicked} = initial;
      const {isLoggedIn} = useAuth();

      if (!initialClicked) {
        const state = store.getState();
        if (!state.auth.autoJoinState && isLoggedIn) {
          router.dismissTo('/(tabs)/(today)');
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    AudioModule.setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
    });
  }, []);

  const startLineAnimation = () => {
    lineAnim.setValue(1);
    Animated.timing(lineAnim, {
      toValue: 0,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* BranchHandler must be inside Provider so useAppSelector works */}
        <BranchHandler />
        <SafeAreaProvider>
          <WalkthroughProvider backdropColor="rgba(0, 0, 0, 0.7)">
            <AppThemeGate>
              <Stack
                initialRouteName="(auth)"
                screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(modals)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="light" />
              <Toast
                config={ToastConfig(lineAnim)}
                position="bottom"
                visibilityTime={3000}
                onShow={startLineAnimation}
                onHide={() => {
                  const time = setTimeout(() => {
                    lineAnim.setValue(1);
                  }, 200);
                  return () => clearTimeout(time);
                }}
              />
              {isCompleteModalVisible && (
                <ChallengeCompleteModal
                  visible={isCompleteModalVisible}
                  onClose={() => setIsCompleteModalVisible(false)}
                  userChallengeId={userChallengeId}
                />
              )}
            </AppThemeGate>
          </WalkthroughProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

function AppThemeGate({children}: {children: React.ReactNode}) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}
