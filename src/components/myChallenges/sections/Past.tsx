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
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn/index';
import {Colors} from '@/constants/Colors';
import {router} from 'expo-router';
import ChallengeItemView from '../ChallengeItemView';
import EmptyChallenge from './EmptyChallenge';

interface PastChallengesSectionProps {
  myChallenges: UserChallengesListResponseType;
  isOpen: boolean;
  toggleSection: () => void;
  loadMore: () => void;
  isFetching: boolean;
}

const PastChallengesSection: React.FC<PastChallengesSectionProps> = ({
  myChallenges,
  isOpen,
  toggleSection,
  loadMore,
  isFetching,
}) => {
  const past = myChallenges?.data?.past ?? [];
  const pastCount = myChallenges?.data?.counts?.pastCount ?? 0;
  const hasMore = myChallenges?.pagination?.past?.hasMore ?? false;

  // if (pastCount === 0) {
  //   return null;
  // }

  const renderSectionHeader = () => (
    <TouchableOpacity style={styles.headerContainer} onPress={toggleSection}>
      <Text style={styles.headerTitle}>Past</Text>
      <Text style={styles.count}>({pastCount})</Text>
      <Ionicons
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={24}
        color="white"
      />
    </TouchableOpacity>
  );

  const onPressPast = (item: ChallengeData) => {
    router.push({
      pathname: '/(modals)/(myChallenges)/(pastChallenges)/[id]',
      params: {
        id: item._id,
        challengeItem: JSON.stringify(item),
      },
    });
  };

  const renderPastChallenge = ({item}: {item: ChallengeData}) => (
    // <TouchableOpacity
    //   onPress={() => onPressPast(item)}
    //   style={styles.challengeContainer}>
    //   <FastImage
    //     source={{uri: item.challengeImage}}
    //     style={styles.challengeImage}
    //     resizeMode="cover"
    //   />
    //   <View style={styles.challengeInfo}>
    //     <Text style={styles.challengeTitle}>{item.challengeName}</Text>
    //     <Text style={styles.challengeStatus}>{item.status}</Text>
    //   </View>
    // </TouchableOpacity>
    <ChallengeItemView
      item={item}
      onPress={() => onPressPast(item)}
      isProgressShown={false}
      isType="Past"
    />
  );

  const renderFooter = () => {
    // Only show loader if we're fetching AND there are more items to load
    if (!isFetching || !hasMore || past.length === pastCount) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Colors.orange} size="small" />
      </View>
    );
  };

  return (
    <>
      {renderSectionHeader()}

      {isOpen && (
        <View style={styles.section}>
          <FlatList
            data={past}
            renderItem={renderPastChallenge}
            keyExtractor={item => `${item._id}-past`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.challengeList,
              paddingBottom: getFontSize(15),
            }}
            horizontal
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<EmptyChallenge isType="Past" />}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(1.5),
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
  challengeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.containerBGColor,
    padding: getFontSize(1),
    marginBottom: getFontSize(1),
    borderRadius: getFontSize(2),
    borderWidth: getFontSize(0.1),
    borderColor: Colors.borderColor,
    zIndex: 1,
  },
  challengeImage: {
    width: getFontSize(6),
    height: getFontSize(6),
    borderRadius: getFontSize(0.5),
    backgroundColor: Colors.containerBGColor,
  },
  challengeInfo: {
    marginLeft: getFontSize(1.5),
    justifyContent: 'center',
  },
  challengeTitle: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
  },
  challengeStatus: {
    color: 'rgba(98, 98, 98, 0.9)',
    fontSize: getFontSize(1.5),
    marginTop: getFontSize(0.5),
  },
  loaderContainer: {
    padding: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(PastChallengesSection);
