import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useLocalSearchParams} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {Header} from '@/components/Header';
import {FilterButton} from '@/components/FilterButton';
import ChallengeItem from '@/components/ChallengeItem';
import {getCategoryDisplayName, getFontSize} from '@/utils/responsiveFn';
import {
  CategoryFilter,
  ChallengeMode,
  ExploreChallengeUserType,
} from '@/types/enums';
import {
  useGetChallengeTypesQuery,
  useGetAllChallengesQuery,
} from '@/api/exploreApi';
import {ITEMS_PER_PAGE} from '@/utils/constants/api';
import {GeneralStyle} from '@/constants/GeneralStyle';
import SeeAllS from '@/components/skeleton/SeeAllS';
import SeeAllStepOne from '@/components/WalkThroughSteps/seeAll/SeeAllStepOne';
import SeeAllStepTwo from '@/components/WalkThroughSteps/seeAll/SeeAllStepTwo';
import {getAsyncSeeAll, setAsyncSeeAll} from '@/utils/common/useAsyncFunctions';
import {useCustomWalkthrough} from '@/hooks/useCustomWalkthrough';
import WalkthroughBackdrop from '@/components/WalkThrough/WalkthroughBackdrop';

const SeeAll: React.FC = () => {
  const params = useLocalSearchParams();
  const modeParam = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const mode = (
    modeParam ?? ChallengeMode.PERSONAL
  ).toLowerCase() as ChallengeMode;
  const listRef = React.useRef<FlatList<any>>(null);

  const category = (categoryParam ?? CategoryFilter.ALL).toLowerCase();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Custom walkthrough implementation
  const {currentStep, isActive, steps, currentStepLayout} =
    useCustomWalkthrough({
      screenName: 'SeeAll',
      totalSteps: 2,
      getAsyncFunction: async () => {
        const result = await getAsyncSeeAll();
        return result ?? null;
      },
      setAsyncFunction: setAsyncSeeAll,
      autoStart: true,
      delay: 100,
    });

  const {
    data: typesData,
    isLoading: isTypesLoading,
    error: typesError,
  } = useGetChallengeTypesQuery({mode: mode as ChallengeMode, category});

  const [selectedType, setSelectedType] = useState<ExploreChallengeUserType>(
    ExploreChallengeUserType.ALL,
  );

  useEffect(() => {
    if (typesData) {
      const defaultType = typesData.filter(
        i => i.value === (params?.type as ExploreChallengeUserType),
      );

      if (defaultType.length > 0) {
        setSelectedType(params?.type as ExploreChallengeUserType);
      }
    }
  }, [typesData]);

  const {
    data: challengesData,
    isLoading: isChallengesLoading,
    error: challengesError,
    isFetching,
  } = useGetAllChallengesQuery(
    {
      mode: mode as ChallengeMode,
      category,
      type: selectedType,
      limit: ITEMS_PER_PAGE,
      page,
    },
    {
      skip: isTypesLoading || !selectedType,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const filterOptions = useMemo(() => {
    const base = [{label: 'All', value: ExploreChallengeUserType.ALL}];
    if (!typesData) return base;

    const order = [
      ExploreChallengeUserType.MULTIPLE,
      ExploreChallengeUserType.SINGLE,
      ExploreChallengeUserType.MAXOUT,
      ExploreChallengeUserType.VARIANT,
    ];

    const others = typesData
      .filter(opt => opt.value !== ExploreChallengeUserType.ALL)
      .sort((a: any, b: any) => order.indexOf(a.value) - order.indexOf(b.value))
      .map(opt => ({
        label: opt.label,
        value: opt.value as ExploreChallengeUserType,
      }));

    return [...base, ...others];
  }, [typesData]);

  const handleFilterChange = useCallback(
    (newType: ExploreChallengeUserType) => {
      if (newType !== selectedType) {
        // Clear state in the correct order to prevent race conditions
        setIsLoadingMore(false);
        setPage(1);
        setItems([]); // clear old items immediately
        setSelectedType(newType);

        // Scroll to top so user doesn't see old scrolled position
        listRef.current?.scrollToOffset({animated: false, offset: 0});
      }
    },
    [selectedType],
  );

  // Extract steps for easy access
  const [step1, step2] = steps;

  // Reset pagination when type changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setIsLoadingMore(false);
  }, [selectedType]);

  useEffect(() => {
    if (challengesData?.challenges) {
      if (page === 1) {
        // Always replace items for page 1 to ensure clean slate
        setItems(challengesData.challenges);
      } else {
        // For subsequent pages, only append if we have existing items
        // This prevents appending to an empty array from a stale query
        setItems(prev => {
          if (prev.length === 0) {
            // If prev is empty, we're likely in a race condition
            // Just set the new data instead of appending
            return challengesData.challenges;
          }
          const existingIds = new Set(prev.map(item => item._id));
          const newItems = challengesData.challenges.filter(
            item => !existingIds.has(item._id),
          );
          return [...prev, ...newItems];
        });
      }
      setIsLoadingMore(false);
    }
  }, [challengesData, page]);

  const loadMore = useCallback(() => {
    const hasMorePages =
      challengesData?.pagination && page < challengesData.pagination.pages;
    const canLoadMore = !isChallengesLoading && !isLoadingMore && hasMorePages;

    if (canLoadMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [challengesData?.pagination, page, isChallengesLoading, isLoadingMore]);

  // Memoized render functions for better performance
  const renderChallengeItem = useCallback(
    ({item}: {item: any}) => (
      <ChallengeItem
        item={item}
        exploreChallenge
        onPress={async () => {
          const asyncSeeAll = await getAsyncSeeAll();
          if (asyncSeeAll === null && currentStep === 2) {
            // Complete walkthrough when user selects a challenge on step 2
            step2.next();
            await setAsyncSeeAll();
          }
        }}
      />
    ),
    [currentStep, step2],
  );

  const renderFilterItem = useCallback(
    ({item}: {item: {label: string; value: ExploreChallengeUserType}}) => (
      <FilterButton
        title={item.label.replace(' ', '-') as any}
        isSelected={selectedType === item.value}
        disabled={currentStep === 1}
        onPress={() => {
          if (currentStep === 1) return;
          handleFilterChange(item.value);
        }}
      />
    ),
    [selectedType, handleFilterChange, currentStep],
  );

  const renderLoadingFooter = useCallback(() => {
    if (isFetching && page > 1) {
      return (
        <View>
          <ActivityIndicator color={Colors.orange} size="small" />
        </View>
      );
    }
    return null;
  }, [isFetching, page]);

  const showSkeleton =
    (page === 1 && (isChallengesLoading || isFetching)) ||
    (items.length === 0 && (isChallengesLoading || isFetching));

  if (typesError || challengesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Something went wrong. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`${getCategoryDisplayName(
          category as CategoryFilter,
        )} ${modeParam}`}
        icon={true}
      />
      <LinearGradient
        colors={['#000', '#000', Colors.orangeOpacity]}
        style={{flex: 1}}>
        <View onLayout={step2.onLayout} style={styles.tab}>
          {/* Filter Section */}
          <View onLayout={step1.onLayout}>
            <FlatList
              data={filterOptions}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.value}
              renderItem={renderFilterItem}
              contentContainerStyle={GeneralStyle.filterContainer}
            />
          </View>

          {/* Content Section */}
          {showSkeleton && <SeeAllS />}

          <View style={GeneralStyle.center}>
            <FlatList
              ref={listRef}
              data={items}
              keyExtractor={item => item._id}
              renderItem={renderChallengeItem}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              // removeClippedSubviews
              // maxToRenderPerBatch={10}
              // windowSize={10}
              // initialNumToRender={6}
              ListFooterComponent={renderLoadingFooter}
              extraData={selectedType}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Walkthrough Backdrop */}
      <WalkthroughBackdrop
        isVisible={isActive}
        highlightedArea={currentStepLayout}
        backdropColor="rgba(0, 0, 0, 0.7)"
      />

      {/* Custom Walkthrough Overlays */}
      {step1?.isVisible && (
        <SeeAllStepOne
          next={step1.next}
          selectedType={selectedType}
          filterOptions={filterOptions}
          setSelectedType={handleFilterChange}
        />
      )}

      {step2?.isVisible && <SeeAllStepTwo next={step2.next} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  tab: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  content: {
    paddingBottom: getFontSize(11),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  errorText: {
    color: Colors.red,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SeeAll;
