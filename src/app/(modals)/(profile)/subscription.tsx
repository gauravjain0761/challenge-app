import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '@/constants/Colors';
import HeaderBack from '@/components/HeaderBack';
import {getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import SubscriptionView from '@/components/profile/SubscriptionView';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {
  clearToken,
  setSubOfferings,
  setAutoJoinState,
} from '@/features/authSlice';
import {router, useLocalSearchParams} from 'expo-router';
import Purchases, {PurchasesPackage} from 'react-native-purchases';
import {MIX_PANEL_EVENTS, SUBSCRIPTION_PLAN} from '@/types/enums';
import ChallengeSelectionModal from '@/components/profile/ChallengeSelectionModal';
import Loader from '@/components/Loader';
import {resetStore} from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {usePostAuthIntegration} from '@/hooks/usePostAuthIntegration';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import {trackEvent} from '@/hooks/useMixpanelClient';

const subscription = () => {
  const isPlan = false;
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const {isGuestUser, user} = useAppSelector(state => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(
    SUBSCRIPTION_PLAN.PREMIUM_MONTHLY,
  );
  const [offerings, setOfferings] = React.useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    smartRevenueCatLogin,
    refreshAppDataAfterSubscription,
    processQueuedChallengeJoin,
  } = usePostAuthIntegration();

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setIsLoading(true);
        const customerInfo = await smartRevenueCatLogin(user?.id);
        console.log(
          'Smart RC login result:',
          JSON.stringify(customerInfo, null, 2),
        );

        const offers = await Purchases.getOfferings();

        if (offers.all && Object.keys(offers.all).length > 0) {
          setOfferings(offers?.all);
          setIsLoading(false);
          dispatch(setSubOfferings(offers?.all));
        } else {
          console.warn('No current offering configured.');
          setIsLoading(false);
        }

        trackEvent(MIX_PANEL_EVENTS.paywall_shown, {
          user_id: user?.id,
          device_type: Platform.OS,
        });
      } catch (e) {
        console.error('Error fetching offerings', e);
        setIsLoading(false);
      }
    };
    fetchOfferings();
  }, []);

  const goToSignUp = async () => {
    console.log(
      '🔄 Guest user with subscription - navigating to signup for auth transfer',
    );
    router.dismissTo('../../(auth)/signUp');
    router.push('../../(auth)/signUp');
    successToast('Purchased successfully, please sign up to continue');
    dispatch(clearToken());
    await resetStore();
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const pkg: PurchasesPackage =
        offerings[selectedPlan]?.lifetime ||
        offerings[selectedPlan]?.monthly ||
        offerings[selectedPlan]?.annual ||
        offerings[selectedPlan]?.weekly ||
        '';

      const {customerInfo} = await Purchases.purchasePackage(pkg);

      if (
        customerInfo.entitlements.active[SUBSCRIPTION_PLAN.PREMIUM_7DAYS] ||
        customerInfo.entitlements.active[SUBSCRIPTION_PLAN.PREMIUM_MONTHLY] ||
        customerInfo.entitlements.active[SUBSCRIPTION_PLAN.PREMIUM_YEARLY]
      ) {
        // Set hasPremium flag for device-specific purchase tracking
        await AsyncStorage.setItem('hasPremium', 'true');
        console.log(
          '✅ hasPremium flag set - user purchased subscription on this device',
        );

        // Refresh app data after successful s  ubscription
        await refreshAppDataAfterSubscription();

        trackEvent(MIX_PANEL_EVENTS.subscription_started, {
          user_id: user?.id,
          subscription_plan: pkg?.packageType,
          subscription_value: pkg?.product.price,
          currency: pkg?.product?.currencyCode,
        });

        if (isGuestUser) {
          // Remove unused customerInfo storage - we use hasPremium flag instead
          await goToSignUp();
        } else {
          // Authenticated user - just refresh app data and auto-join if from challenge
          //setIsLoading(false);
          if (params?.challengeID) {
            // Subscribed via challenge - auto-join the challenge
            await processQueuedChallengeJoin(false);
            setIsLoading(false);
          } else {
            // Clear autoJoinState for guest subscription flow (no challenge to join)

            successToast('Subscription purchased successfully');
            setIsLoading(false);
            dispatch(setAutoJoinState(false));
            router.dismiss();
          }
        }
      }
    } catch (e: any) {
      console.log('error', e.message);
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsLoading(true);

      const restoredInfo = await Purchases.restorePurchases();

      if (Object.keys(restoredInfo.entitlements.active).length > 0) {
        // Set hasPremium flag for device-specific purchase tracking
        await AsyncStorage.setItem('hasPremium', 'true');
        console.log('✅ hasPremium flag set - purchases restored successfully');

        // Refresh app data after successful restoration
        await refreshAppDataAfterSubscription();

        if (isGuestUser) {
          // Remove unused customerInfo storage - we use hasPremium flag instead
          await goToSignUp();
        } else {
          // Authenticated user - just refresh app data and auto-join if from challenge
          if (params?.challengeID) {
            // Restored via challenge - auto-join the challenge
            await processQueuedChallengeJoin(false);
            setIsLoading(false);
          } else {
            // Clear autoJoinState for guest restoration flow (no challenge to join)
            successToast('Purchases restored successfully!');
            setIsLoading(false);
            dispatch(setAutoJoinState(false));
            router.dismiss();
          }
        }
      } else {
        console.log('ℹ️ No purchases found to restore');
        errorToast('No purchases found to restore.');
        setIsLoading(false);
      }
    } catch (e: any) {
      console.log('restore error', e.message);
      errorToast('Failed to restore purchases. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <HeaderBack
        title="Upgrade"
        iconName="close"
        containerStyle={styles.header}
      /> */}
      <View style={styles.mainContainer}>
        <SubscriptionView
          offerings={offerings}
          selectedPlan={selectedPlan}
          isLoading={isLoading}
          onSelection={(pkg: string) => {
            setSelectedPlan(pkg || SUBSCRIPTION_PLAN.PREMIUM_MONTHLY);
          }}
          onRestore={handleRestore}
          isHellChallenge={isPlan}
        />
      </View>
      <View>
        <Button
          title="Take Action Now"
          onPress={handlePurchase}
          colors={isPlan ? [Colors._FE0D0D, '#555555'] : undefined}
        />
      </View>

      <ChallengeSelectionModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />

      {isLoading && <Loader />}
    </SafeAreaView>
  );
};

export default subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: getFontSize(2),
  },
  header: {
    paddingHorizontal: getFontSize(2),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
