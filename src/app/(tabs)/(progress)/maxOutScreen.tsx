import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {useGetProgressMaxOutQuery} from '@/api/progressChallengesApi';
import {ITEMS_PER_PAGE} from '@/utils/constants/api';
import {MaxOutChallengeSchema} from '@/validation/schemas';
import MxOutItem from '@/components/progress/MxOutItem';
import {Colors} from '@/constants/Colors';
import {GeneralStyle} from '@/constants/GeneralStyle';
import ActionS from '@/components/skeleton/ActionS';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MaxOutShareModal from '@/components/progress/MaxOutShareModal';
import EmptyState from '@/components/myChallenges/EmptyState';
import {router} from 'expo-router';
import {
  CategoryFilter,
  ChallengeMode,
  ExploreChallengeUserType,
} from '@/types/enums';

const MaxOutScreen = () => {
  const [limit, setLimit] = useState<number>(ITEMS_PER_PAGE);

  const {data, isLoading, isFetching} = useGetProgressMaxOutQuery({
    limit: limit,
  });

  const [selectedItem, setSelectedItem] =
    useState<MaxOutChallengeSchema | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const [maxOutData, setMaxOutData] = useState<MaxOutChallengeSchema[]>([]);

  useEffect(() => {
    if (data) {
      setMaxOutData(data.data || []);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!data || isFetching) return;

    setLimit(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const renderItem = ({item}: {item: MaxOutChallengeSchema}) => {
    return (
      <MxOutItem
        image={item.actionImage}
        name={item.actionName}
        count={item.bestCount}
        unit={item.unit}
        onShare={() => {
          setSelectedItem(item);
          setIsVisible(true);
        }}
      />
    );
  };

  const renderFooter = () => {
    // Only show loader if we're fetching AND there are more items to load
    if (!isLoading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Colors.orange} size="small" />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={GeneralStyle.flex}>
      {isLoading && <ActionS isTrue={false} />}
      <View style={styles.container}>
        <FlatList
          data={maxOutData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.containerStyle}
          // onEndReached={loadMore}
          // onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <EmptyState
                  style={{
                    marginTop: 0,
                  }}
                  onPressAdd={() => {
                    router.push({
                      pathname: '/seeAll',
                      params: {
                        mode: ChallengeMode.PERSONAL,
                        category: CategoryFilter.ALL,
                        type: ExploreChallengeUserType?.MAXOUT,
                      },
                    });
                  }}
                  description={
                    'Join the maxout challenge\n to see things you do'
                  }
                  btnTitle="Join challenge"
                />
              </View>
            ) : (
              <></>
            )
          }
        />
        <MaxOutShareModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          selectedItem={selectedItem}
          image={selectedItem?.actionImage}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default MaxOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: getFontSize(1),
  },
  containerStyle: {
    flex: 1,
    paddingBottom: getFontSize(15),
  },
  loaderContainer: {
    width: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: getFontSize(1),
  },
});
