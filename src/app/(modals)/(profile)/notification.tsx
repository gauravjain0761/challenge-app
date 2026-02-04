import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import CustomSwitch from '@/components/CommonSwitch';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {OneSignal} from 'react-native-onesignal';
import {
  useGetSettingQuery,
  useLazyGetSettingQuery,
  useNotificationPermissionMutation,
  useUpdateSettingMutation,
} from '@/api/notificationApi';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import {useIsFocused} from '@react-navigation/native';

const notification = () => {
  const isFocused = useIsFocused();
  const [triggerGetSetting, {data, isLoading, isSuccess}] =
    useLazyGetSettingQuery();

  const [notificationPermission, {isLoading: notificationLoading}] =
    useNotificationPermissionMutation();
  const [updateSetting, {isLoading: updateLoading}] =
    useUpdateSettingMutation();

  const [isContent, setIsContent] = useState<boolean>(false);
  const [isReminders, setIsReminders] = useState<boolean>(false);
  const [isAllOff, setIsAllOff] = useState<boolean>(false);

  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const handleGlobalToggle = async () => {
    const permission = await OneSignal.Notifications.getPermissionAsync();
    setIsGlobal(!isGlobal);

    if (isGlobal) {
      // User wants to turn OFF notifications → Redirect to settings
      if (Platform.OS === 'ios') {
        console.log('test');
        Linking.openSettings();
      } else {
        Linking.openSettings();
      }
    } else {
      // User wants to turn ON notifications → Request permission
      if (!permission) {
        await OneSignal.Notifications.requestPermission(true);
      }
    }

    // Toggle state after action
    // setIsGlobal(!permission);
    console.log('Current Permission:', permission);
  };

  useEffect(() => {
    triggerGetSetting({});
    OneSignal.Notifications.getPermissionAsync().then(permission => {
      setIsGlobal(permission);
    });
  }, [isFocused]);

  useEffect(() => {
    if (isSuccess) {
      const isFriend =
        (data?.notificationTypes?.friend_accept as boolean) || false;
      const isReminder =
        (data?.notificationTypes?.challenge_completed as boolean) || false;

      const pushEnabled = data?.pushEnabled || false;

      setIsContent(isFriend ? true : false);
      setIsReminders(isReminder ? true : false);

      setIsAllOff(pushEnabled);
    }
  }, [isSuccess]);

  const updateSettings = async (isFriend?: boolean, isAll?: boolean) => {
    try {
      if (isFriend) {
        setIsContent(isAll ? !isAllOff : !isContent);
      } else {
        setIsReminders(isAll ? !isAllOff : !isReminders);
      }

      let obj = {
        notificationTypes: {},
      };

      if (isFriend) {
        obj.notificationTypes = {
          friend_accept: isAll ? !isAllOff : !isContent,
          friend_challenge_complete: isAll ? !isAllOff : !isContent,
          friend_invite: isAll ? !isAllOff : !isContent,
        };
      } else {
        obj.notificationTypes = {
          challenge_completed: isAll ? !isAllOff : !isReminders,
          challenge_deadline: isAll ? !isAllOff : !isReminders,
          challenge_reminder: isAll ? !isAllOff : !isReminders,
          challenge_started: isAll ? !isAllOff : !isReminders,
          challenge_day_failed: isAll ? !isAllOff : !isReminders,
          daily_reminder: isAll ? !isAllOff : !isReminders,
          streak_reminder: isAll ? !isAllOff : !isReminders,
          weekly_summary: isAll ? !isAllOff : !isReminders,
        };
      }

      const response = await updateSetting(obj).unwrap();
      if (!isAll) {
        successToast(response.message);
      }
      triggerGetSetting({});
      console.log('Notification settings updated:', response);
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
      console.log('Error updating notification settings:', error);
    }
  };

  const handleNotificationPermission = async () => {
    try {
      setIsAllOff(!isAllOff);

      const response = await notificationPermission({
        pushEnabled: !isAllOff,
      }).unwrap();
      // setIsContent(!isContent);
      // setIsReminders(!isReminders);
      // if (isAllOff) {
      await updateSettings(false, true);
      await updateSettings(true, true);
      // }
      triggerGetSetting({});
      successToast(response.message);
      console.log('Notification permission updated:', response);
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
      console.log('Error updating notification permission:', error);
    }
  };

  return (
    <GradientContainer>
      <HeaderBack title="Notifications Settings" isBackground />
      <View style={styles.container}>
        <Text style={styles.dec}>
          Adjust the notification settings to suit your ping, ping, ping
          tolerance.
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={GeneralStyle.flex}>
          {/* Global */}
          <View style={styles.headingView}>
            <Text style={styles.headingText}>Global Channels</Text>
            <CustomSwitch
              isToggleOn={isGlobal}
              onToggleSwitch={() => handleGlobalToggle()}
            />
          </View>

          <Text style={styles.description}>
            • Enable Push Notifications{' '}
            {Platform.OS === 'ios' ? 'iOS' : 'Android'}
            {'\n'}• Enable In-App (Banner) Notifications
          </Text>

          {/* Content */}
          <View style={styles.headingView}>
            <Text style={styles.headingText}>Content-Based Notifications</Text>
            <CustomSwitch
              isToggleOn={isContent}
              onToggleSwitch={() => {
                updateSettings(true);
              }}
            />
          </View>

          <Text style={styles.description}>
            • Friend / Connection Request{'\n'}• Group / Channel Activity{'\n'}•
            Event Invitations & Reminders{'\n'}
          </Text>

          {/* Reminders */}
          <View style={styles.headingView}>
            <Text style={styles.headingText}>Reminders & PersonaliSation</Text>
            <CustomSwitch
              isToggleOn={isReminders}
              onToggleSwitch={() => updateSettings(false)}
            />
          </View>

          <Text style={styles.description}>
            • Challenge Reminders{'\n'}• Daily / Weekly Summary{'\n'}•
            Recommended Content{'\n'}
          </Text>

          <View style={styles.bottomSwitchView}>
            <Text style={styles.turnOffText}>Turn off All</Text>
            <CustomSwitch
              isToggleOn={isAllOff}
              onToggleSwitch={() => handleNotificationPermission()}
            />
          </View>
        </ScrollView>
      </View>
      {(updateLoading || isLoading || notificationLoading) && <Loader />}
    </GradientContainer>
  );
};

export default notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dec: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    marginTop: getFontSize(2),
    marginBottom: getFontSize(4),
    opacity: 0.6,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    textTransform: 'uppercase',
    flex: 1,
  },
  description: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginTop: getFontSize(1),
    marginBottom: getFontSize(2),
    opacity: 0.6,
  },
  bottomSwitchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: getFontSize(2),
    marginBottom: getFontSize(2),
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(2),
    borderRadius: getFontSize(1),
  },
  turnOffText: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    // textTransform: 'uppercase',
    flex: 1,
  },
});
