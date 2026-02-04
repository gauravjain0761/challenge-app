import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Slot, usePathname, Link, useLocalSearchParams} from 'expo-router';
import {Colors} from '@/constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {getFontSize} from '@/utils/responsiveFn';
import HeaderSection from '@/components/myChallenges/HeaderSection';
import {useNavigation} from '@react-navigation/native';
import ScheduleStepOne from '@/components/WalkThroughSteps/scheduleChallenge/ScheduleStepOne';
import {setIsExploreInfoParams} from '@/features/authSlice';
import {useAppDispatch} from '@/hooks/reduxHooks';

// Memoized Tab Button
const TabButton = React.memo(
  ({
    label,
    isActive,
    href,
  }: {
    label: string;
    isActive: boolean;
    href: string;
  }) => {
    return (
      <Link href={href as any} asChild>
        <TouchableOpacity style={styles.tabButton}>
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
    encodedItem,
    onLayout,
    challengeName,
  }: {
    challengeId: string;
    encodedItem: any;
    onLayout?: (e: any) => void;
    challengeName?: string;
  }) => {
    const pathname = usePathname();
    const tabs = useMemo(
      () => [
        {
          label: 'Info',
          href: `/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/info`,
        },
        {
          label: 'Actions',
          //href: `/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/actions`,
          href: `/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/actions${
            challengeName
              ? `?challengeName=${encodeURIComponent(challengeName)}`
              : ''
          }`,
        },
        {
          label: 'Friends',
          href: `/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/friends`,
        },
        {
          label: 'Goal',
          href: `/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/levels`,
        },
      ],
      [challengeId, challengeName],
    );

    return (
      <View onLayout={onLayout} style={styles.tabContainer}>
        {tabs.map(tab => {
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
            />
          );
        })}
      </View>
    );
  },
);

export default function MyChallengeLayout() {
  const params = useLocalSearchParams<{
    id: string;
    challengeItem: string;
  }>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const challengeId = params?.id as string;

  useEffect(() => {
    dispatch(setIsExploreInfoParams(params));
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

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderSection
        image={challengeItem?.challengeImage}
        title={challengeItem?.challengeName}
        onBack={handleBack}
      />
      <View
        //onLayout={step12.onLayout}
        style={styles.innerContainer}>
        {/* Custom Tab Navigation */}
        <TabNavigation
          challengeId={challengeId}
          encodedItem={params.challengeItem}
          challengeName={challengeItem?.challengeName}
        />

        {/* Content Area - Child routes rendered here */}
        <View style={styles.contentContainer}>
          <Slot />
        </View>
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
    flex: 2,
    padding: getFontSize(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.5),
  },
});
