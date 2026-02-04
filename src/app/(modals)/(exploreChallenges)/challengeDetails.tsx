import React, {useMemo, useCallback, memo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '@/constants/Colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {router, useLocalSearchParams} from 'expo-router';
import {getFontSize} from '@/utils/responsiveFn';
import LinearGradient from 'react-native-linear-gradient';
import Button from '@/components/Button';
import InfoTab from '@/components/InfoTab';
import FriendsTab from '@/components/FriendsTab';
// import {useTimer} from '@/hooks/useTimer';
import ActionsPreviewTab from '@/components/ActionPreviewTab';
import IconComponent from '@/components/IconComponent';
import {useGetChallengeInfoQuery} from '@/api/exploreApi';
import {
  ChallengeListItem,
  GetChallengeInfoResponse,
} from '@/validation/schemas';
import {ChallengeInfo} from '@/types';

// Memoized Header Section
interface HeaderSectionProps {
  image: any;
  title: string;
  participants?: number;
  onBack: () => void;
}

const HeaderSection = React.memo(
  ({image, title, participants, onBack}: HeaderSectionProps) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.headerImage} />
        <LinearGradient
          colors={['transparent', 'rgba(7, 7, 7, 0.77)']}
          style={styles.gradientOverlay}
        />

        <IconComponent
          name="left"
          size={getFontSize(3)}
          color={Colors.white}
          style={styles.backButton}
          onPress={onBack}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.row}>
            <IconComponent
              name="groups"
              type="MaterialIcons"
              size={getFontSize(3)}
              color={Colors.white}
            />
            <Text style={styles.participants}>{participants}</Text>
          </View>
        </View>
      </View>
    );
  },
);

// Memoized Tab Button
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton = React.memo(({label, isActive, onPress}: TabButtonProps) => {
  console.log('Tab Button');
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Text style={[styles.tabText, isActive && styles.activeTab]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// Timer Component
interface TimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const Timer = memo(
  ({timeLeft}: TimerProps) => {
    // Memoize the time display logic
    const timeDisplays = useMemo(
      () => [
        {value: timeLeft.days, unit: 'd'},
        {value: timeLeft.hours, unit: 'h'},
        {value: timeLeft.minutes, unit: 'm'},
        {value: timeLeft.seconds, unit: 's'},
      ],
      [timeLeft],
    );

    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerContent}>
          <Text style={styles.timerTitle}>Challenge not Started</Text>
          <Text style={styles.timerSubtitle}>
            Join and get notifications when it starts
          </Text>
          <View style={styles.timeUnitsContainer}>
            {timeDisplays.map(({value, unit}) =>
              value > 0 || (unit === 's' && value >= 0) ? (
                <View key={unit} style={styles.timerContainerView}>
                  <Text style={styles.timerText}>
                    {value}
                    {unit}
                  </Text>
                </View>
              ) : null,
            )}
          </View>
        </View>
      </View>
    );
  },
  (prev, next) => {
    // Custom equality check for better performance
    return (
      prev.timeLeft.days === next.timeLeft.days &&
      prev.timeLeft.hours === next.timeLeft.hours &&
      prev.timeLeft.minutes === next.timeLeft.minutes &&
      prev.timeLeft.seconds === next.timeLeft.seconds
    );
  },
);

type TabType = 'info' | 'actions' | 'friends';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = React.memo(
  ({activeTab, onTabChange}: TabNavigationProps) => {
    console.log('Tab Navigation Render');

    // const tabs: TabType[] = useMemo(() => {
    //   const baseTabs: TabType[] = ["info", "actions", "friends"];
    //   return isJoined ? ["progress", ...baseTabs] : baseTabs;
    // }, [isJoined]);

    const tabs: TabType[] = useMemo(() => ['info', 'actions', 'friends'], []);

    const getTabHandler = useCallback(
      (tab: TabType) => {
        return () => onTabChange(tab);
      },
      [onTabChange],
    );

    return (
      <View style={styles.tabContainer}>
        {tabs.map(tab => {
          const handler = useMemo(
            () => getTabHandler(tab),
            [getTabHandler, tab],
          );

          return (
            <TabButton
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              isActive={activeTab === tab}
              onPress={handler}
            />
          );
        })}
      </View>
    );
  },
);

// Main Component
const ChallengeDetails = () => {
  // const {challenge, challengeId, challengeItem} = useLocalSearchParams();
  const params = useLocalSearchParams();
  const challengeItem = JSON.parse(
    params?.challengeItem as string,
  ) as ChallengeListItem;
  const challengeId = params?.challengeId as string;
  const challenge = params?.challenge as any;

  const {data: challengeInfo, isLoading} = useGetChallengeInfoQuery({
    challengeId: challengeId as string,
  });
  const [challengeDataInfo, setChallengeDataInfo] =
    useState<GetChallengeInfoResponse>({} as GetChallengeInfoResponse);

  useEffect(() => {
    if (challengeInfo) {
      setChallengeDataInfo(challengeInfo);
    }
  }, [challengeInfo]);

  const parsedChallenge = useMemo(() => {
    try {
      return JSON.parse(
        Array.isArray(challenge) ? challenge[0] : challenge || '{}',
      );
    } catch (error) {
      console.error('Error parsing challenge data:', error);
      return {};
    }
  }, [challenge]);

  const goesLiveDate = useMemo(() => {
    if (!parsedChallenge?.goesLiveDate) return undefined;
    return parsedChallenge.goesLiveDate;
  }, [parsedChallenge]);

  // const {timeLeft, isLive, loading} = useTimer(goesLiveDate);
  const [activeTab, setActiveTab] = React.useState<TabType>('info');

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleBack = useCallback(() => router.back(), []);


  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'info':
        return (
          <InfoTab
            data={parsedChallenge.info || {}}
            whatWhyHow={{
              how: challengeDataInfo?.how as any,
              why: challengeDataInfo?.why as any,
              what: challengeDataInfo?.what as any,
            }}
          />
        );
      case 'actions':
        return (
          <ActionsPreviewTab
            data={parsedChallenge?.actions || {}}
            type={parsedChallenge?.type}
          />
        );
      case 'friends':
        return <FriendsTab />;
      default:
        return null;
    }
  }, [activeTab, parsedChallenge, challengeDataInfo]);

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={Colors.orange} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <HeaderSection
        image={challengeItem?.image}
        title={challengeItem?.name}
        // participants={challengeItem?.participants}
        onBack={handleBack}
      />
      <View style={styles.innerContainer}>
        <LinearGradient
          colors={['#000', '#000', Colors.orangeOpacity]}
          style={styles.gradientContainer}>
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          <View style={styles.contentContainer}>{renderTabContent}</View>

          {/* Timer and Join Button */}
          <View style={styles.bottomContainer}>
            {/* {parsedChallenge?.isLive ? null : isLive ? null : (
              <Timer timeLeft={timeLeft} />
            )} */}
            <Button
              title={'Join'}
              style={styles.joinButton}
              onPress={() => console.log('Join pressed')}
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: getFontSize(2),
  },
  liveText: {
    fontSize: getFontSize(2),
    color: Colors.orange,
    fontWeight: '700',
  },
  timerContainer: {
    //flexDirection: "row",
    marginTop: getFontSize(1),
  },
  timerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: getFontSize(2),
    fontWeight: '600',
    color: Colors.white,
    marginBottom: getFontSize(0.7),
  },
  timerSubtitle: {
    fontSize: getFontSize(1.7),
    fontWeight: '400',
    color: Colors.inactiveTabColor,
    marginBottom: getFontSize(0.7),
  },
  timeUnitsContainer: {
    flexDirection: 'row',
  },
  timerText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
  },
  joinButton: {
    width: '93%',
  },
  joinButtonText: {
    color: Colors.black,
  },
  timerContainerView: {
    height: getFontSize(6),
    padding: getFontSize(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getFontSize(1),
    marginRight: getFontSize(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.5),
  },
});

export default memo(ChallengeDetails);
