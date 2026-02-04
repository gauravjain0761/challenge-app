import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  UserChallengesListResponseType,
  ChallengeData,
} from '@/validation/schemas';
import ChallengeItemView from '@/components/myChallenges/ChallengeItemView';
import {getFontSize} from '@/utils/responsiveFn/index';
import {Colors} from '@/constants/Colors';
import EmptyChallenge from './EmptyChallenge';

interface InProgressSectionProps {
  myChallenges: UserChallengesListResponseType;
  isOpen: boolean;
  toggleSection: () => void;
  loadMore: () => void;
  isFetching: boolean;
  onLayout?: (e: any) => void;
  onPress?: () => void;
}

const InProgressSection: React.FC<InProgressSectionProps> = ({
  myChallenges,
  isOpen,
  toggleSection,
  loadMore,
  isFetching,
  onLayout,
  onPress,
}) => {
  const inProgress = myChallenges?.data?.inProgress ?? [];
  const inProgressCount = myChallenges?.data?.counts?.inProgressCount ?? 0;
  const hasMore = myChallenges?.pagination?.inProgress?.hasMore ?? false;

  // if (inProgress.length === 0) {
  //   return null;
  // }

  const renderSectionHeader = () => (
    <TouchableOpacity style={styles.headerContainer} onPress={toggleSection}>
      <Text style={styles.headerTitle}>Live</Text>
      <Text style={styles.count}>({inProgressCount})</Text>
      <Ionicons
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={24}
        color="white"
      />
    </TouchableOpacity>
  );

  const renderChallenges = ({item}: {item: ChallengeData}) => (
    <ChallengeItemView item={item} onPress={onPress} isType="Live" />
  );

  const renderFooter = () => {
    // Only show loader if we're fetching AND there are more items to load
    if (!isFetching || !hasMore || inProgress.length === inProgressCount)
      return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Colors.orange} size="small" />
      </View>
    );
  };

  return (
    <View onLayout={onLayout} style={styles.section}>
      {renderSectionHeader()}

      {isOpen && (
        <FlatList
          data={inProgress}
          horizontal
          renderItem={renderChallenges}
          keyExtractor={item => `${item._id}-progress`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<EmptyChallenge isType="Live" />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: getFontSize(1),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(1.2),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
  },
  count: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: getFontSize(1.8),
    marginRight: getFontSize(1),
    marginLeft: getFontSize(0.3),
  },
  challengeList: {
    paddingHorizontal: getFontSize(2),
  },
  loaderContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getFontSize(1),
  },
});

export default memo(InProgressSection);
