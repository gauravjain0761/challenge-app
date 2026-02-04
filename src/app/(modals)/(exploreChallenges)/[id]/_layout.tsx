import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {
  Slot,
  usePathname,
  Link,
  useLocalSearchParams,
  router,
} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import HeaderSection from '@/components/myChallenges/HeaderSection';
import {useNavigation} from '@react-navigation/native';
import InviteLinkModal from '@/components/InviteLinkModal';
import {useJoinInviteFriendMutation} from '@/api/friendApi';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import branch from 'react-native-branch';
import Loader from '@/components/Loader';
import {GeneralStyle} from '@/constants/GeneralStyle';
import InfoStepOne from '@/components/WalkThroughSteps/exploreInfo/InfoStepOne';
import {useDispatch} from 'react-redux';
import {
  clearToken,
  setIsCompletionInfoData,
  setIsExploreInfoParams,
} from '@/features/authSlice';
import {useAppSelector} from '@/hooks/reduxHooks';
import {
  getAsyncExploreInfo,
  removeAsyncExploreInfo,
  setAsyncSubscribeChallengeInfo,
} from '@/utils/common/useAsyncFunctions';
import {useCustomWalkthrough} from '@/hooks/useCustomWalkthrough';
import WalkthroughBackdrop from '@/components/WalkThrough/WalkthroughBackdrop';
import {resetStore, store} from '@/store';
import {challengeParticipationApi} from '@/api/challengeParticipationApi';
import {
  AsyncTypes,
  ChallengeMode,
  DEFAULT_MULTIPLE_LEVELS,
  MIX_PANEL_EVENTS,
} from '@/types/enums';
import {useGetChallengeInfoQuery} from '@/api/exploreApi';
import {useAuth} from '@/hooks/useAuth';
import {trackEvent} from '@/hooks/useMixpanelClient';

// Memoized Tab Button
const TabButton = React.memo(
  ({
    label,
    isActive,
    href,
    onLayout,
    disabled, // for walkthrough
  }: {
    label: string;
    isActive: boolean;
    href: string;
    onLayout?: any;
    disabled?: boolean;
  }) => {
    if (disabled && !isActive) {
      return (
        <TouchableOpacity
          style={[styles.tabButton, {opacity: 0.5}]}
          disabled={true}
          onLayout={isActive ? onLayout : undefined}>
          <Text style={[styles.tabText, isActive && styles.activeTab]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Link href={href as any} asChild>
        <TouchableOpacity
          style={styles.tabButton}
          onLayout={isActive ? onLayout : undefined}>
          <Text style={[styles.tabText, isActive && styles.activeTab]}>
            {label}
          </Text>
        </TouchableOpacity>
      </Link>
    );
  },
);

// Navigation Component
const TabNavigation = React.memo(
  ({
    challengeId,
    onLayout,
    disableTabs,
    challengeName,
  }: {
    challengeId: string;
    onLayout?: any;
    disableTabs?: boolean;
    challengeName?: string;
  }) => {
    const pathname = usePathname();

    const tabs = useMemo(
      () => [
        {
          label: 'Info',
          href: `/(modals)/(exploreChallenges)/${challengeId}/info`,
        },
        {
          label: 'Actions',
          href: `/(modals)/(exploreChallenges)/${challengeId}/actions${
            challengeName
              ? `?challengeName=${encodeURIComponent(challengeName)}`
              : ''
          }`,
        },
        // {
        //   label: 'Friends',
        //   href: `/(modals)/(exploreChallenges)/${challengeId}/friends`,
        // },
        {
          label: 'Goal',
          href: `/(modals)/(exploreChallenges)/${challengeId}/levels`,
        },
      ],
      [challengeId, challengeName],
    );

    return (
      <View onLayout={onLayout} style={styles.tabContainer}>
        {tabs.map(tab => {
          // Extract the route segment without query params
          const routeSegment = tab.href
            .split('/')
            .pop()
            ?.split('?')[0] as string;
          return (
            <TabButton
              key={tab.label}
              label={tab.label}
              href={tab.href}
              isActive={pathname.endsWith(routeSegment)}
              onLayout={onLayout}
              disabled={disableTabs}
            />
          );
        })}
      </View>
    );
  },
);

export default function ChallengeLayout() {
  const params = useLocalSearchParams<{
    id: string;
    challengeItem: string;
    isInvite: string;
    inviteToken: string;
    deep_link_external: string;
  }>();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const challengeId = params?.id as string;
  const [joinInviteFriend, {isLoading}] = useJoinInviteFriendMutation();
  const {isExploreInfoParams} = useAppSelector(state => state.auth);
  const {user} = useAppSelector(state => state.auth);
  const {isLoggedIn} = useAuth();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isColdStart, setIsColdStart] = React.useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = React.useState(true);

  useEffect(() => {
    (async () => {
      const initial = await branch.getLatestReferringParams();

      const {'+clicked_branch_link': initialClicked} = initial;

      dispatch(setIsExploreInfoParams(params));
      if (initialClicked) {
        setIsLoadingInvite(false);
      } else {
        setIsLoadingInvite(false);
      }
    })();
  }, []);

  const challengeItem = useMemo(() => {
    try {
      return params.challengeItem
        ? JSON.parse(params.challengeItem as string)
        : {};
    } catch (e) {
      console.error('Error parsing challengeItem:', e);
      return {};
    }
  }, [params.challengeItem]);

  // Check if this is a cold start with branch data
  useEffect(() => {
    const checkColdStart = async () => {
      try {
        // Check if we have stored branch params (indicates we came from a branch link)
        const storedParams = await AsyncStorage.getItem(
          AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
        );
        if (storedParams && params?.isInvite === 'true') {
          // This is a cold start with branch data
          setIsColdStart(true);
        }
      } catch (error) {
        console.error('Error checking cold start:', error);
      }
    };

    checkColdStart();
  }, [params?.isInvite]);

  useEffect(() => {
    if (params?.isInvite === 'true' && params?.deep_link_external == null) {
      setIsVisible(true);
    }
  }, [params?.isInvite]);

  const shouldFetchChallengeInfo = params?.isInvite === 'true' && isVisible;

  const {data: challengeInfo} = useGetChallengeInfoQuery(
    {
      challengeId: challengeId,
    },
    {
      skip: shouldFetchChallengeInfo,
    },
  );

  const handleBack = async () => {
    if (params?.isInvite === 'true') {
      try {
        await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO);
      } catch (error) {
        console.error('Error clearing stored branch params:', error);
      }
    }

    if (navigation.canGoBack() && !isColdStart) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)/(today)');
    }
  };

  const loggedInUserJoinByInvite = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response: any = await joinInviteFriend({
        token: params?.inviteToken as string,
        data: {
          timezone: timezone,
        },
      }).unwrap();

      const levelName = DEFAULT_MULTIPLE_LEVELS.find(
        (_, n) => n === Number(response?.userChallenge?.selectedLevelIndex),
      )?.name as string;

      trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
        challenge_id: response?.userChallenge?.challengeId,
        challenge_name: response?.userChallenge?.challengeName,
        is_worldwide: response?.mode === ChallengeMode.PERSONAL ? false : true,
        user_id: user?.id,
        joined_via_invite: true,
        difficulty: levelName,
      });

      // Clear the stored branch params after successful join
      await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO);

      setIsVisible(false);
      successToast(response.message);

      // Invalidate myChallenges cache to refresh data
      store.dispatch(
        challengeParticipationApi.util.invalidateTags(['MyChallenges']),
      );

      dispatch(
        setIsCompletionInfoData({
          _id: response?.userChallenge?._id,
          challengeName: challengeInfo?.shortName ?? challengeInfo?.name,
          selectedGoal: response?.userChallenge?.selectedLevelIndex,
          image: challengeInfo?.image,
        }),
      );

      if (user?.isFirstTimeUser) {
        router.dismissAll();
        router.push('/(modals)/challengeJoin');
      } else {
        router.dismissTo({
          pathname: '/(tabs)/(challenges)',
          params: {isJoined: 'true'},
        });
        router.push('/(modals)/challengeJoin');
      }
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  const joinInvitePayload = async () => {
    let obj = {};
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (params?.isInvite === 'true') {
      obj = {
        inviteToken: params?.inviteToken,
        isInvite: 'true',
        timezone: timezone,
      };
      await setAsyncSubscribeChallengeInfo({
        challengeId: params?.id as string,
        data: obj,
        image: challengeInfo?.image,
        name: challengeInfo?.name,
      });
    }
  };

  const goToSignUp = async () => {
    router.dismissAll();
    router.dismissTo('/(auth)/signUp');
    dispatch(clearToken());
    await resetStore();
  };

  const onJoinInvite = async () => {
    try {
      if (isLoggedIn) {
        if (challengeInfo?.hasAccess) {
          loggedInUserJoinByInvite();
        } else {
          await joinInvitePayload();
          router.push({
            pathname: '../../(profile)/subscription',
            params: {
              isSubscriptionThroughInfo: 'true',
              challengeID: challengeId,
            },
          });
          setIsVisible(false);
        }
      } else {
        if (challengeInfo?.hasAccess) {
          await joinInvitePayload();
          goToSignUp();
        } else {
          await joinInvitePayload();
          router.push({
            pathname: '../../(profile)/subscription',
            params: {
              isSubscriptionThroughInfo: 'true',
              challengeID: challengeId,
            },
          });
          setIsVisible(false);
        }
      }
    } catch (error: any) {
      if (error.status === 403) {
        router.push({
          pathname: '../../(profile)/subscription',
          params: {
            isSubscriptionThroughInfo: 'true',
            challengeID: challengeId,
          },
        });
        setIsVisible(false);
      } else {
        setIsVisible(false);
        errorToast(error.data?.message || error.message || 'Please try again');
      }
    }
  };

  // Global walkthrough for InfoStepOne that works across all tabs
  const {
    currentStep: layoutCurrentStep,
    isActive: layoutIsActive,
    steps: layoutSteps,
  } = useCustomWalkthrough({
    screenName: 'ExploreInfoLayout',
    totalSteps: 1, // Only step 1 (InfoStepOne) at layout level
    getAsyncFunction: async () => {
      const result = await getAsyncExploreInfo();
      return result ?? null;
    },
    setAsyncFunction: async () => {
      console.log(
        '🎯 Layout step 1 completed, this will be handled by InfoStepOne',
      );
    },
    autoStart: true,
    delay: 100,
  });

  const [layoutStep1] = layoutSteps;

  // Temporary: Reset walkthrough for testing
  React.useEffect(() => {
    const resetWalkthrough = async () => {
      await removeAsyncExploreInfo();
      console.log('🎯 ExploreInfo layout walkthrough reset for testing');
    };
    //resetWalkthrough();
  }, []);

  if (isLoadingInvite && params?.isInvite === 'true') {
    return (
      <View style={GeneralStyle.loader}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSection
        image={challengeItem?.image}
        title={challengeItem?.name}
        onBack={handleBack}
      />
      <View style={styles.innerContainer}>
        {/* <LinearGradient
          colors={['#000', '#000', Colors.orangeOpacity]}
          style={styles.gradientContainer}> */}
        <View
          onLayout={isVisible ? undefined : layoutStep1?.onLayout}
          style={styles.gradientContainer}>
          {/* Custom Tab Navigation */}
          <TabNavigation
            challengeId={challengeId}
            disableTabs={layoutIsActive}
            challengeName={challengeItem?.name}
          />
          {/* Content Area - Child routes rendered here */}
          <View style={styles.contentContainer}>
            <Slot />
          </View>
        </View>

        {/* Global Walkthrough Backdrop */}
        <WalkthroughBackdrop
          isVisible={layoutIsActive}
          highlightedArea={layoutSteps[0]?.layoutInfo}
          backdropColor="rgba(0, 0, 0, 0.7)"
        />

        {/* Global InfoStepOne Overlay */}
        {layoutStep1?.isVisible && !isVisible && (
          <InfoStepOne next={layoutStep1.next} />
        )}
        {/* </LinearGradient> */}

        {isVisible && (
          <InviteLinkModal
            visible={isVisible}
            onClose={() => setIsVisible(false)}
            challengeName={challengeItem?.name}
            onPressPreview={() => setIsVisible(false)}
            onPressJoin={() => onJoinInvite()}
            isLoading={isLoading}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: getFontSize(25),
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    bottom: getFontSize(15),
    left: getFontSize(1.5),
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: getFontSize(2),
    left: getFontSize(1.5),
  },
  title: {
    fontSize: getFontSize(3),
    color: Colors.white,
    fontWeight: '600',
  },
  participants: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
  },
  innerContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.background,
    paddingVertical: getFontSize(1),
    marginLeft: getFontSize(1.5),
    marginTop: getFontSize(1),
    marginBottom: getFontSize(1),
  },
  tabButton: {
    marginRight: getFontSize(4),
  },
  tabText: {
    fontSize: getFontSize(2),
    color: Colors.inactiveTabColor,
    fontWeight: '500',
  },
  activeTab: {
    color: Colors.white,
  },
  contentContainer: {
    flex: 1,
    //padding: getFontSize(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.5),
  },
});
