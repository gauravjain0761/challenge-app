import {FlatList, Linking, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import HeaderBack from '@/components/HeaderBack';
import {Colors} from '@/constants/Colors';
import GradientContainer from '@/components/GradientContainer';

import UserProfile from '@/components/profile/UserProfile';
import YourPlan from '@/components/profile/YourPlan';
import {
  profileList,
  ProfileListProps,
  ProfileListTypes,
  AsyncTypes,
  MIX_PANEL_EVENTS,
} from '@/types/enums';
import ProfileListItem from '@/components/profile/ProfileListItem';
import {getFontSize} from '@/utils/responsiveFn';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useLogoutMutation} from '@/api/authApi';
import {errorToast} from '@/utils/common/commonFunction';
import Loader from '@/components/Loader';
import {router} from 'expo-router';
import CommonModal from '@/components/CommonModal';
import {resetStore} from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectIsGuestUser, selectProfileData} from '@/features/authSlice';
import Purchases from 'react-native-purchases';
import {PRIVACY_URL, TERMS_URL} from '@/utils/constants/api';
import {OneSignal} from 'react-native-onesignal';
import {resetMixpanel, trackEvent} from '@/hooks/useMixpanelClient';

const Profile = () => {
  const [logout, {isLoading}] = useLogoutMutation();
  const [isVisible, setIsVisible] = React.useState(false);
  const [pendingLogout, setPendingLogout] = React.useState(false);
  const isGuest = useAppSelector(selectIsGuestUser);
  const user = useAppSelector(selectProfileData);

  const onPressItem = (title: string) => {
    switch (title) {
      case ProfileListTypes.MANAGE_SUBSCRIPTION:
        openSubscriptionManagement();
        break;
      case ProfileListTypes.Profile_Settings:
        router.push('/(modals)/(profile)/profileSetting');
        break;

      case ProfileListTypes.Manage_Challenges:
        router.push('/(modals)/(profile)/manageChallenges');
        break;

      case ProfileListTypes.Friend_Request:
        router.push('/(modals)/(profile)/friendsRequest');
        break;

      case ProfileListTypes.Logout:
        setIsVisible(true);
        break;

      case ProfileListTypes.Help:
        router.push('/(modals)/(profile)/helpScreen');
        break;

      case ProfileListTypes.Notifications:
        router.push('/(modals)/(profile)/notification');
        break;

      case ProfileListTypes.Feedback_Roadmap:
        trackEvent(MIX_PANEL_EVENTS.feedback_and_roadmap, {
          user_id: user?.id,
        });
        router.push('/(modals)/(profile)/feedbackFeaturebase');
        break;

      case ProfileListTypes.Privacy:
      case ProfileListTypes.Terms:
        router.push('/(modals)/(profile)/webScreen');
        router.setParams({
          title: title,
          url: title === ProfileListTypes.Privacy ? PRIVACY_URL : TERMS_URL,
        });
        break;
      case ProfileListTypes.Close_Account:
        router.push('/(modals)/(profile)/closeAccount');
        break;

      default:
        break;
    }
  };

  async function openSubscriptionManagement() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const url = customerInfo.managementURL;

      trackEvent(MIX_PANEL_EVENTS.manage_subscription, {
        user_id: user?.id,
      });

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          errorToast?.('Unable to open subscription settings');
        }
      } else {
        errorToast?.(
          Platform.OS === 'ios'
            ? 'No active subscription found in App Store'
            : 'No active subscription found in Play Store',
        );
      }
    } catch (error) {
      errorToast?.('Failed to open subscription management');
    }
  }

  const handleLogout = () => {
    setPendingLogout(true);
    setIsVisible(false);
  };

  const handleLogoutModalHide = async () => {
    if (pendingLogout) {
      try {
        const {data} = await logout();
        if (data) {
          const customerInfo = await Purchases.getCustomerInfo();
          const isAnonymous =
            customerInfo.originalAppUserId?.startsWith('$RCAnonymousID');

          if (!isAnonymous) {
            await Purchases.logOut();
          } else {
            console.log('ℹ️ Skipping Purchases.logOut(): already anonymous');
          }
          await resetStore();
          resetMixpanel();
          const keysToRemove = [
            AsyncTypes.PENDING_BRANCH_LINK,
            AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
            AsyncTypes.FROM_NOTIFICATION,
          ];

          await OneSignal.logout();

          await AsyncStorage.multiRemove(keysToRemove);
          // await AsyncStorage.clear();
          router.back();
        } else if (isGuest) {
          router.back();
        }
      } catch (error: any) {
        errorToast(error.data?.message || error.message || 'Please try again');
      } finally {
        setPendingLogout(false);
      }
    }
  };

  const renderItem = ({item}: {item: ProfileListProps}) => {
    return (
      <ProfileListItem
        key={item._id.toString()}
        item={item}
        onPress={onPressItem}
      />
    );
  };

  const filteredProfileList = profileList
    .map((section: any) => {
      if (isGuest) {
        // ❌ hide whole sections
        if (
          [
            ProfileListTypes.Challenges,
            ProfileListTypes.Friends,
            ProfileListTypes.MANAGE_SUBSCRIPTION,
          ].includes(section.title)
        ) {
          return null;
        }

        // ⚡️ hide only Profile_Settings inside Settings
        if (section.title === ProfileListTypes.Settings) {
          return {
            ...section,
            list: section.list.filter(
              (item: any) => item.title !== ProfileListTypes.Profile_Settings,
            ),
          };
        }

        if (section.title === ProfileListTypes.App) {
          return {
            ...section,
            list: section.list.filter(
              (item: any) => item.title !== ProfileListTypes.Feedback_Roadmap,
            ),
          };
        }

        // ⚡️ hide only Close_Account inside Account
        if (section.title === ProfileListTypes.Account) {
          return {
            ...section,
            list: section.list.filter(
              (item: any) => item.title !== ProfileListTypes.Close_Account,
            ),
          };
        }
      } else {
        if (!user?.isSubscribed) {
          return {
            ...section,
            list: section.list.filter(
              (item: any) =>
                item.title !== ProfileListTypes.MANAGE_SUBSCRIPTION,
            ),
          };
        }
      }
      return section;
    })
    // remove nulls and empty sections
    .filter(section => section && section.list.length > 0);

  return (
    <GradientContainer>
      <HeaderBack title={'Profile'} isBackground />

      <UserProfile />

      {!user?.isSubscribed && <YourPlan />}

      <View style={styles.listContainer}>
        <FlatList
          data={filteredProfileList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          style={GeneralStyle.flex}
        />
      </View>

      <CommonModal
        onClose={() => setIsVisible(false)}
        visible={isVisible}
        onPress={() => handleLogout()}
        onModalHide={handleLogoutModalHide}
      />
      {isLoading && <Loader />}
    </GradientContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  listContainer: {
    flexGrow: 1,
    marginTop: getFontSize(2),
  },
});
