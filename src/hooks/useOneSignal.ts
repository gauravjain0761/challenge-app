import {useEffect} from 'react';
import {router} from 'expo-router';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import {ONESIGNAL_APP_ID} from '@/utils/constants/api';
import {AsyncTypes, NotificationType} from '@/types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useOneSignal(
  setModalVisible: (val: boolean) => void,
  setUserChallengeId: (val: string) => void,
) {
  useEffect(() => {
    OneSignal.initialize(ONESIGNAL_APP_ID);

    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    const onClick = async (event: any) => {
      const data = event.notification.additionalData;
      console.log('Notification Click data:', JSON.stringify(event, null, 2));

      await AsyncStorage.setItem(AsyncTypes.FROM_NOTIFICATION, 'true');

      const challengeItem = JSON.stringify({
        name: data.challengeName || '',
        image: data.challengeImage || '',
      });

      switch (data.type) {
        case NotificationType.FRIEND_INVITE:
          router.navigate('/(modals)/(profile)/friendsRequest');
          break;

        case NotificationType.CHALLENGE_STARTED:
        case NotificationType.CHALLENGE_DAY_FAILED:
        case NotificationType.FRIEND_NUDGE:
        case NotificationType.CHALLENGE_REMINDER:
          router.push({
            pathname: '/(modals)/(myChallenges)/(progressChallenges)/[id]',
            params: {
              id: data.userChallengeId,
              challengeItem: challengeItem,
              isProgress:
                data.type === NotificationType.CHALLENGE_DAY_FAILED
                  ? 'true'
                  : 'false',
              isFriendNudge:
                data.type === NotificationType.FRIEND_NUDGE ? 'true' : 'false',
              userId: data?.userId,
              senderId: data?.senderId,
            },
          });
          break;

        case NotificationType.ADMIN_CHALLENGE_LIVE:
          router.push({
            pathname: '/(modals)/(exploreChallenges)/[id]',
            params: {
              id: data.challengeId,
              challengeItem: challengeItem,
            },
          });
          break;

        case NotificationType.CHALLENGE_COMPLETED:
          setModalVisible(true);
          setUserChallengeId(data?.userChallengeId);
          break;

        default:
          break;
      }
    };

    const onForeground = (event: any) => {
      event.getNotification().display();
    };

    OneSignal.Notifications.addEventListener('click', onClick);
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      onForeground,
    );

    return () => {
      OneSignal.Notifications.removeEventListener('click', onClick);
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        onForeground,
      );
    };
  }, []);
}
