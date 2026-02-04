import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {useGetTodayChallengeQuery} from '@/api/progressChallengesApi';
import {CategoryFilter} from '@/types/enums';
import {TodayChallengeListItems} from '@/validation/schemas';
import ChallengesList from '@/components/profile/ChallengesList';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getFontSize} from '@/utils/responsiveFn';
import {useLeaveParticipationMutation} from '@/api/challengeParticipationApi';
import Loader from '@/components/Loader';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import * as challengeParticipationTypes from '@/validation/schemas/challenge-participation.schema';
import LeaveChallengeModal from '@/components/myChallenges/LeaveChallengeModal';

const ManageChallenges = () => {
  const {
    data,
    isLoading,
    refetch: refetchChallenges,
  } = useGetTodayChallengeQuery(
    {
      category: CategoryFilter.ALL,
      date: new Date().toISOString().split('T')[0] as string,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [leaveParticipation, {isLoading: leaveLoading}] =
    useLeaveParticipationMutation();

  const [challengeList, setChallengeList] = useState<TodayChallengeListItems[]>(
    [],
  );
  const [selectedId, setSelectedId] = useState<string>('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    if (data) {
      const group = data?.group as TodayChallengeListItems[];
      const personal = data?.personal as TodayChallengeListItems[];
      const mergedArray = group?.concat(personal);
      setChallengeList(mergedArray);
    }
  }, [data]);

  const onLeaveChallenge = async () => {
    setShowLeaveModal(false);
    try {
      const response = await leaveParticipation({
        challengeId: selectedId as string,
      }).unwrap();
      if (response) {
        successToast(response.message);
        refetchChallenges();
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const renderItem = ({item}: {item: TodayChallengeListItems}) => {
    return (
      <ChallengesList
        image={(item?.image as string) || ''}
        name={(item?.name as string) || ''}
        level={item?.category}
        onPressDelete={() => {
          setSelectedId(item?._id);
          setShowLeaveModal(true);
        }}
      />
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <GradientContainer>
        <HeaderBack title={'Manage Challenges'} isBackground />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={challengeList}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
        {leaveLoading && <Loader />}

        {/*  Leave Modal */}
        {showLeaveModal && (
          <LeaveChallengeModal
            visible={showLeaveModal}
            onClose={() => setShowLeaveModal(false)}
            onConfirm={() => onLeaveChallenge()}
          />
        )}
      </GradientContainer>
    </GestureHandlerRootView>
  );
};

export default ManageChallenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    marginTop: getFontSize(2),
  },
});
