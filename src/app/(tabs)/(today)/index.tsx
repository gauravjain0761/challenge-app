import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {FilterButton} from '@/components/FilterButton';
import {
  getCategoryDisplayName,
  getFontSize,
  onScroll,
  SCREEN_WIDTH,
} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useRouter} from 'expo-router';
import LinearGradient from 'react-native-linear-gradient';
import {Header} from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useGetTodayChallengeQuery} from '@/api/progressChallengesApi';
import {CategoryFilter, AsyncTypes, MIX_PANEL_EVENTS} from '@/types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalCalendar from '@/components/CalendarStrip';
import {useIsFocused} from '@react-navigation/native';
import TodayStepOne from '@/components/WalkThroughSteps/today/TodayStepOne';
import {useAppSelector} from '@/hooks/reduxHooks';
import {getAsyncToday, setAsyncToday} from '@/utils/common/useAsyncFunctions';
import {useCustomWalkthrough} from '@/hooks/useCustomWalkthrough';
import TypeOfChallengesInfoModal from '@/components/InfoModals/TypeOfChallengesInfoModal';
import TodayChallengesView from '@/components/Today/TodayChallengesView';
import TodayChallengeS from '@/components/skeleton/TodayChallengeS';
import WalkthroughBackdrop from '@/components/WalkThrough/WalkthroughBackdrop';
import {Images} from '@/assets/images';
import {trackEvent} from '@/hooks/useMixpanelClient';

const FILTERS = Object.values(CategoryFilter);

export default function Today() {
  const router = useRouter();
  const {isGuestUser, user} = useAppSelector(state => state.auth);
  const [infoVisible, setInfoVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>(
    CategoryFilter.ALL,
  );
  const isFocused = useIsFocused();
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const {
    data,
    isLoading,
    refetch: refetchTodayChallenges,
  } = useGetTodayChallengeQuery(
    {
      category: selectedFilter,
      date: activeDate.toISOString().split('T')[0] as string,
    },
    {
      skip: !isFocused,
      refetchOnMountOrArgChange: true,
    },
  );

  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    if (isFocused) {
      refetchTodayChallenges();
    }
  }, [isFocused]);

  const {
    currentStep: layoutCurrentStep,
    isActive: layoutIsActive,
    steps: todayStepOne,
    currentStepLayout,
  } = useCustomWalkthrough({
    screenName: 'Today',
    totalSteps: 1,
    getAsyncFunction: async () => {
      const result = await getAsyncToday();
      return result ?? null;
    },
    setAsyncFunction: setAsyncToday,
    autoStart: true,
    delay: 100,
  });

  const [todayStep1] = todayStepOne;

  useEffect(() => {
    // removeAsyncToday();
    const asyncToday = getAsyncToday();

    if (asyncToday === null && todayStep1.isVisible) {
      console.log('🎯 Starting Today walkthrough - first time user');
      todayStep1.start();
    }
  }, [todayStep1.isVisible]);

  useEffect(() => {
    if (isGuestUser) {
      const checkPaywallShown = async () => {
        const paywallShown = await AsyncStorage.getItem(
          AsyncTypes.GUEST_PAYWALL_SHOWN,
        );

        if (!paywallShown) {
          // Set flag immediately so it doesn't show again
          await AsyncStorage.setItem(AsyncTypes.GUEST_PAYWALL_SHOWN, 'true');

          const time = setTimeout(() => {
            router.push('../../(modals)/(profile)/subscription');
          }, 100);
          return () => clearTimeout(time);
        }
      };

      checkPaywallShown();
    }
  }, []);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Header title="Today's Challenge" />
        <View style={styles.header}>
          <LinearGradient
            colors={['#000', '#000', Colors.orangeOpacity]} // Adjust gradient colors
            style={{flex: 1}}>
            <View style={styles.header}>
              <View style={styles.filterContainer}>
                <FlatList
                  horizontal
                  data={FILTERS}
                  keyExtractor={item => item}
                  renderItem={({
                    item,
                    index,
                  }: {
                    item: CategoryFilter;
                    index: number;
                  }) => (
                    <FilterButton
                      key={index.toString()}
                      title={getCategoryDisplayName(item)}
                      isSelected={selectedFilter === item}
                      onPress={() => setSelectedFilter(item)}
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={GeneralStyle.filterContainer}
                />
              </View>

              {isLoading && <TodayChallengeS />}

              <View style={{flex: 1}}>
                <ScrollView
                  onScroll={e => onScroll(e, setShowFade)}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 50,
                  }}>
                  <TodayChallengesView
                    data={data?.personal || []}
                    title="Personal"
                    isType="Personal"
                    isInfoShown={true}
                    onPressInfo={() => setInfoVisible(true)}
                    category={selectedFilter}
                  />
                  <TodayChallengesView
                    data={data?.group || []}
                    title="Group"
                    isType="Group"
                    category={selectedFilter}
                  />
                  <TodayChallengesView
                    data={data?.worldwide || []}
                    title="Worldwide"
                    isType="Worldwide"
                    category={selectedFilter}
                  />

                  {!isGuestUser && (
                    <>
                      <Text style={styles.feedback}>
                        Feedbacks & Suggestions
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          trackEvent(MIX_PANEL_EVENTS.feedback_and_roadmap, {
                            user_id: user?.id,
                          });
                          router.push(
                            '/(modals)/(profile)/feedbackFeaturebase',
                          );
                        }}>
                        <ImageBackground
                          source={Images.banner_image}
                          resizeMode="cover"
                          style={styles.bannerImage}>
                          <Text style={styles.challengeTitle}>
                            {'We are currently in Beta, HELP!'}
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </LinearGradient>

          {showFade && (
            <LinearGradient
              colors={['transparent', Colors.orangeOpacity]}
              style={GeneralStyle.gradientBottom}
              pointerEvents="none"
            />
          )}
        </View>

        {/* Walkthrough Backdrop */}
        <WalkthroughBackdrop
          isVisible={layoutIsActive}
          highlightedArea={currentStepLayout}
          backdropColor="rgba(0, 0, 0, 0.85)"
        />

        {todayStep1?.isVisible && (
          <TodayStepOne next={todayStep1.next} onLayout={todayStep1.onLayout} />
        )}

        {/* Calendar Strip at the bottom */}
        <View style={styles.calendarContainer}>
          <HorizontalCalendar
            onDateSelected={(date: any) => setActiveDate(date)}
            selectedDate={activeDate}
          />
        </View>
      </View>

      {infoVisible && (
        <TypeOfChallengesInfoModal
          visible={infoVisible}
          onClose={() => setInfoVisible(false)}
        />
      )}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flex: 1,
  },
  filterContainer: {
    marginTop: getFontSize(1),
    marginLeft: getFontSize(2),
  },

  calendarContainer: {
    backgroundColor: Colors.orangeOpacity,
    flex: 0.3,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  feedback: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    marginLeft: getFontSize(2),
    marginTop: getFontSize(2),
  },

  bannerImage: {
    width: SCREEN_WIDTH * 0.92,
    height: getFontSize(21.4),
    marginHorizontal: getFontSize(2),
    borderRadius: getFontSize(2),
    overflow: 'hidden',
    paddingBottom: getFontSize(0.5),
    marginTop: getFontSize(2),
  },

  challengeTitle: {
    color: 'white',
    fontSize: getFontSize(2.5),
    fontWeight: '500',
    position: 'absolute',
    bottom: getFontSize(2),
    left: getFontSize(2),
  },
});
