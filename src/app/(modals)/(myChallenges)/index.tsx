import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {
  getCategoryDisplayName,
  getFontSize,
} from '../../../utils/responsiveFn/index';
import {Colors} from '../../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {useGetMyChallengesQuery} from '@/api/challengeParticipationApi';
import {CategoryFilter} from '@/types/enums';
import {UserChallengesListResponseType} from '@/validation/schemas';
import MyChallengeS from '@/components/skeleton/MyChallengeS';
import {FilterButton} from '@/components/FilterButton';
import {GeneralStyle} from '@/constants/GeneralStyle';
import InProgressSection from '@/components/myChallenges/sections/InProgress';
import ScheduledSection from '@/components/myChallenges/sections/Scheduled';
import PastChallengesSection from '@/components/myChallenges/sections/Past';
import EmptyState from '@/components/myChallenges/EmptyState';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '@/hooks/reduxHooks';

const FILTERS = Object.values(CategoryFilter);

interface SectionState {
  inProgress: boolean;
  scheduled: boolean;
  past: boolean;
}

const MyChallenges: React.FC<{onPressAdd: () => void}> = ({onPressAdd}) => {
  const [params, setParams] = useState({
    category: CategoryFilter.ALL,
    inProgressOffset: 0,
    inProgressLimit: 10,
    scheduledOffset: 0,
    scheduledLimit: 10,
    pastOffset: 0,
    pastLimit: 10,
  });
  const {user} = useAppSelector(state => state.auth);

  const {
    data: getMyChallenges,
    isLoading,
    isFetching,
    refetch: refetch,
  } = useGetMyChallengesQuery(params, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const myChallenges: UserChallengesListResponseType | null =
    getMyChallenges ?? null;

  useFocusEffect(
    useCallback(() => {
      setParams(p => ({
        ...p,
        inProgressOffset: 0,
        scheduledOffset: 0,
        pastOffset: 0,
      }));
    }, []),
  );

  const cacheRef = useRef<
    Partial<Record<CategoryFilter, UserChallengesListResponseType>>
  >({});

  const [sections, setSections] = useState<SectionState>({
    inProgress: true,
    scheduled: true,
    past: true,
  });

  const toggleSection = useCallback((section: keyof SectionState): void => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleFilterChange = useCallback((filter: CategoryFilter) => {
    setParams(prev => ({
      ...prev,
      category: filter,
      inProgressOffset: 0,
      scheduledOffset: 0,
      pastOffset: 0,
    }));
  }, []);

  const loadMoreInProgress = useCallback(() => {
    if (!myChallenges || isFetching) return;

    const {hasMore, total} = myChallenges.pagination.inProgress;
    const currentCount = myChallenges.data.inProgress?.length || 0;

    if (!hasMore || currentCount >= total) return;

    setParams(prev => ({
      ...prev,
      inProgressOffset: prev.inProgressOffset + prev.inProgressLimit,
    }));
  }, [myChallenges, isFetching]);

  const loadMoreScheduled = useCallback(() => {
    if (!myChallenges || isFetching) return;

    const {hasMore, total} = myChallenges.pagination.scheduled;
    const currentCount = myChallenges.data.scheduled?.length || 0;

    if (!hasMore || currentCount >= total) return;

    setParams(prev => ({
      ...prev,
      scheduledOffset: prev.scheduledOffset + prev.scheduledLimit,
    }));
  }, [myChallenges, isFetching]);

  const loadMorePast = useCallback(() => {
    if (!myChallenges || isFetching) return;

    const {hasMore, total} = myChallenges.pagination.past;
    const currentCount = myChallenges.data.past?.length || 0;

    if (!hasMore || currentCount >= total) return;

    setParams(prev => ({
      ...prev,
      pastOffset: prev.pastOffset + prev.pastLimit,
    }));
  }, [myChallenges, isFetching]);

  if (isLoading && !myChallenges) {
    return <MyChallengeS />;
  }

  const renderEmptyState = () => {
    const inProgress = myChallenges?.data?.inProgress ?? [];
    const scheduled = myChallenges?.data?.scheduled ?? [];
    const past = myChallenges?.data?.past ?? [];

    if (
      inProgress.length === 0 &&
      scheduled.length === 0 &&
      past.length === 0
    ) {
      return <EmptyState onPressAdd={onPressAdd} />;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#000', Colors.orangeOpacity]}
        style={{flex: 1}}>
        {/* Category Filters */}
        <View>
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({item}: {item: CategoryFilter}) => (
              <FilterButton
                title={getCategoryDisplayName(item)}
                isSelected={params.category === item}
                onPress={() => handleFilterChange(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              GeneralStyle.filterContainer,
              {paddingLeft: getFontSize(2)},
              {marginBottom: getFontSize(0)},
            ]}
          />
        </View>

        {/* Empty State */}
        {/* {renderEmptyState()} */}

        {/* Challenge Sections */}
        {/* {myChallenges && ( */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: getFontSize(5),
          }}>
          <InProgressSection
            myChallenges={myChallenges as UserChallengesListResponseType}
            isOpen={sections.inProgress}
            toggleSection={() => toggleSection('inProgress')}
            loadMore={loadMoreInProgress}
            isFetching={isFetching}
          />

          <ScheduledSection
            myChallenges={myChallenges as UserChallengesListResponseType}
            isOpen={sections.scheduled}
            toggleSection={() => toggleSection('scheduled')}
            loadMore={loadMoreScheduled}
            isFetching={isFetching}
            hasPast={
              (myChallenges && myChallenges?.data?.past?.length > 0) || false
            }
          />

          <PastChallengesSection
            myChallenges={myChallenges as UserChallengesListResponseType}
            isOpen={sections.past}
            toggleSection={() => toggleSection('past')}
            loadMore={loadMorePast}
            isFetching={isFetching}
          />
        </ScrollView>
        {/* )} */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});

export default memo(MyChallenges);
