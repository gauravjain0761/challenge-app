import {useGetProfileQuery} from '@/api/profileApi';
import NetworkErrorBanner from '@/components/NetworkErrorBanner';
import {Colors} from '@/constants/Colors';
import {useAuth} from '@/hooks/useAuth';
import {AsyncTypes} from '@/types/enums';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocalSearchParams, useSegments} from 'expo-router';
import {Redirect, Tabs, router} from 'expo-router';
import React, {useEffect} from 'react';
import {Platform, StyleSheet, View, Text, Dimensions} from 'react-native';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectAutoJoinState} from '@/features/authSlice';

//const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function TabLayout() {
  const {isInitialized, hasValidSession, isLoggedIn, networkError} = useAuth();
  const {
    data,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(
    {},
    {
      skip: !isLoggedIn,
    },
  );
  const segments = useSegments();
  const autoJoinState = useAppSelector(selectAutoJoinState);

  useEffect(() => {
    if (profileError) {
      console.error('❌ Profile loading error:', profileError);
    }
    if (isProfileLoading) {
      console.log('🔄 Profile loading...');
    }
    if (data) {
      console.log('✅ Profile loaded:', data);
    }
  }, [profileError, isProfileLoading, data]);

  useEffect(() => {
    const checkNotificationFlag = async () => {
      if (isInitialized && hasValidSession) {
        const fromNotification = await AsyncStorage.getItem(
          AsyncTypes.FROM_NOTIFICATION,
        );

        // Only navigate if we're not already on today tab and not from notification
        const isOnTodayTab = (segments as string[]).includes('(today)');

        if (!fromNotification && !isOnTodayTab && !autoJoinState) {
          router.push('/(tabs)/(today)');
        }

        // Clear the flag regardless
        await AsyncStorage.removeItem(AsyncTypes.FROM_NOTIFICATION);
      }
    };

    checkNotificationFlag();
  }, [isInitialized, hasValidSession]);

  // const checkNotificationFlag = async () => {
  //   try {
  //     const fromNotification = await AsyncStorage.getItem(
  //       AsyncTypes.FROM_NOTIFICATION,
  //     );
  //     console.log('fromNotification', fromNotification);

  //     if (isInitialized && isLoggedIn) {
  //       router.replace('/(tabs)/(today)');
  //     }
  //     // Clear the flag
  //     // await AsyncStorage.removeItem(AsyncTypes.FROM_NOTIFICATION);
  //   } catch (error) {
  //     console.error('Error checking notification flag:', error);
  //     await AsyncStorage.removeItem(AsyncTypes.FROM_NOTIFICATION);
  //   }
  // };

  // Wait for your auth state to hydrate
  if (!isInitialized) return null;

  if (!hasValidSession) {
    return <Redirect href="/(auth)/logIn" />;
  }
  return (
    <>
      {networkError && <NetworkErrorBanner />}
      <Tabs
        initialRouteName="(today)"
        screenOptions={{
          tabBarActiveTintColor: Colors.orange, // Orange color for active tab
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: Colors.black,
              height: isIphoneX() ? getFontSize(13) : getFontSize(10),
              borderTopWidth: 0,
            },
            default: {
              backgroundColor: Colors.black,
              height: getFontSize(10),
              borderTopWidth: 0,
              position: 'absolute',
              paddingBottom: 10,
            },
          }),
          tabBarIconStyle: {display: 'none'},
          tabBarItemStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarLabel: ({focused, children}) => (
            <TabLabel label={children?.toString() ?? ''} focused={focused} />
          ),
        }}>
        <Tabs.Screen
          name="(progress)"
          options={{
            title: 'PROGRESS',
          }}
        />
        <Tabs.Screen
          name="(today)"
          options={{
            title: 'TODAY',
          }}
        />
        <Tabs.Screen
          name="(challenges)"
          options={{
            title: 'CHALLENGES',
          }}
        />
      </Tabs>
    </>
  );
}

function TabLabel({label, focused}: {label: string; focused: boolean}) {
  return (
    <View style={styles.labelContainer}>
      <View
        style={[
          styles.labelWrapper,
          focused ? styles.labelWrapperFocused : null,
        ]}>
        <Text
          style={[
            styles.label,
            focused ? styles.labelFocused : styles.labelUnfocused,
          ]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flex: 1,
    // height: getFontSize(7),
    alignItems: 'center',
    justifyContent: 'center',
    //width: SCREEN_WIDTH / 3, // Divide screen width by number of tabs
    width: getFontSize(18.5),
  },
  labelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '95%',
    width: '80%',
    marginTop: getFontSize(2),
  },
  labelWrapperFocused: {
    borderWidth: getFontSize(0.1),
    borderColor: Colors._C05600,
  },
  label: {
    fontSize: getFontSize(1.9),
    fontWeight: '500',
    letterSpacing: -0.24,
  },
  labelFocused: {
    color: Colors.white,
  },
  labelUnfocused: {
    color: 'rgba(255, 255, 255, 0.60)',
  },
});
