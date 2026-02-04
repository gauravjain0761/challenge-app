import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  usePendingFriendRequestQuery,
} from '@/api/friendApi';
import {ITEMS_PER_PAGE} from '@/utils/constants/api';
import {PendingFriendList} from '@/validation/schemas';
import FriendListItem from '@/components/profile/FriendListItem';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import {Colors} from '@/constants/Colors';
import Loader from '@/components/Loader';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import FriendS from '@/components/skeleton/FriendS';

const refetchOptions = {
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
};

const FriendsRequest = () => {
  const [page, setPage] = useState(1);
  const [pendingList, setPendingList] = useState<PendingFriendList[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchPending,
  } = usePendingFriendRequestQuery(
    {page, limit: ITEMS_PER_PAGE},
    refetchOptions,
  );

  const [acceptFriendRequest, {isLoading: acceptLoading}] =
    useAcceptFriendRequestMutation();
  const [declineFriendRequest, {isLoading: declineLoading}] =
    useDeclineFriendRequestMutation();

  useEffect(() => {
    if (isFetching === false) {
      setRefreshing(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (data && isSuccess) {
      if (page === 1) {
        setPendingList(data.requests);
      } else {
        setPendingList(prev => [...prev, ...data.requests]);
      }
      setHasMore(data.pagination.pages > page);
      if (refreshing) setRefreshing(false);
    }
  }, [data, isSuccess]);

  const onAccept = async (id: string) => {
    try {
      let obj = {data: {sendDeclineNotification: true}, id};
      const {message} = await acceptFriendRequest(obj).unwrap();
      successToast(message);
      onRefresh();
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');

      console.log('accept error:', error);
    }
  };

  const onDecline = async (id: string) => {
    try {
      let obj = {data: {sendDeclineNotification: false}, id};
      const {message} = await declineFriendRequest(obj).unwrap();
      successToast(message);
      onRefresh();
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');

      console.log('decline error:', error);
    }
  };

  const onEndReached = () => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetchPending(); // Wait for refetch to complete
  };

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <IconComponent
        name="user-group"
        type="FontAwesome6"
        size={getFontSize(5)}
        color={Colors.white}
      />
      <Text style={styles.emptyHeading}>No New Requests</Text>
      <Text style={styles.emptyDescription}>
        When people send you friend requests, They appear here
      </Text>
    </View>
  );

  return (
    <GradientContainer>
      <HeaderBack title="Friend Request" isBackground />
      <View style={styles.container}>
        {isLoading && page === 1 ? (
          <FriendS numberOfArray={3} />
        ) : (
          <FlatList
            data={pendingList}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => (
              <FriendListItem
                item={item}
                index={index}
                onAccept={() => onAccept(item.id)}
                onDecline={() => onDecline(item.id)}
              />
            )}
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyView />}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['orange']} // Android
                tintColor="orange" // iOS
              />
            }
          />
        )}
      </View>
      {(acceptLoading || declineLoading) && <Loader />}
    </GradientContainer>
  );
};

export default FriendsRequest;

const styles = StyleSheet.create({
  container: {flex: 1},
  containerStyle: {
    gap: getFontSize(2),
    marginTop: getFontSize(2),
    flexGrow: 1,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHeading: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '600',
    marginTop: getFontSize(2),
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '400',
    marginTop: getFontSize(1),
    opacity: 0.8,
    textAlign: 'center',
  },
});
