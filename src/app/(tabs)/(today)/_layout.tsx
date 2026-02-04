import React, {useEffect} from 'react';
import {Stack} from 'expo-router';
import {PermissionsAndroid, Platform} from 'react-native';
import {OneSignal} from 'react-native-onesignal';

const _layout = () => {
  useEffect(() => {
    // ✅ Request Android 13+ (API 33) notification permission
    const requestAndroidPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('Android notification permission:', result);
      }
    };

    requestAndroidPermission();

    // ✅ Request iOS notification permission
    OneSignal.Notifications.requestPermission(false);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  );
};

export default _layout;
