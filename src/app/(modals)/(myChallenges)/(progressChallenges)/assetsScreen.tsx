import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {
  useGetProgressActionDetailsQuery,
  useUpdateProgressActionMutation,
} from '@/api/progressChallengesApi';
import {Colors} from '@/constants/Colors';
import HeaderBack from '@/components/HeaderBack';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {get} from 'lodash';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {
  ActionStatus,
  ChallengeType,
  maxoutTypes,
  MIX_PANEL_EVENTS,
} from '@/types/enums';
import Button from '@/components/Button';
import {errorToast} from '@/utils/common/commonFunction';

import AssetItem from '@/components/myChallenges/assets/AssetItem';
import WhatWhyHowModal from '@/components/WhatWhyHowModal';
import MaxOutCounterModal from '@/components/myChallenges/MaxOutCounterModal';
import VideoModal from '@/components/info/VideoModal';
import AssetsS from '@/components/skeleton/AssetsS';
import WhatWhyHow from '@/components/info/WhatWhyHow';
import Loader from '@/components/Loader';
import {useKeyboard} from '@/utils/common/useKeyboard';
import ActionCompulsoryModal from '@/components/ActionCompulsoryModal';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

const AssetsScreen = () => {
  const {
    id,
    actionId,
    unit,
    value,
    index,
    name,
    challengeType,
    selectedDay,
    navType,
    passValue,
    compulsory,
    status,
  } = useLocalSearchParams<{
    id: string;
    actionId: string;
    unit: string;
    value: string;
    index: string;
    name: string;
    challengeType: ChallengeType;
    selectedDay: string;
    navType: string;
    passValue: any;
    compulsory: any;
    status: string;
  }>();

  const {keyboardVisible} = useKeyboard();
  const user = useAppSelector(selectUser);

  const {data: actionDetails, isLoading: isLoadingDetails} =
    useGetProgressActionDetailsQuery({id: actionId});

  const [isLoading, setIsLoading] = useState(true);

  const [updateProgressAction, {isLoading: updateProgressActionLoading}] =
    useUpdateProgressActionMutation();

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assetsData, setAssetsData] = useState<GetInProgressActionAssetsData[]>(
    [],
  );

  const [isMaxOutModalVisible, setIsMaxOutModalVisible] = useState(false);
  const [isWhatWhyHowModalVisible, setIsWhatWhyHowModalVisible] =
    useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isGoBack, setIsGoBack] = useState(false);
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [allAnswers, setAllAnswers] = useState<{
    [assetIndex: number]: {[questionIndex: number]: string};
  }>({});

  useEffect(() => {
    if (isLoadingDetails === false) {
      const time = setTimeout(() => {
        setIsLoading(false);
      }, 200);

      return () => clearTimeout(time);
    }
  }, [isLoadingDetails]);

  useEffect(() => {
    if (actionDetails) {
      const data = get(actionDetails, 'assets', []);

      setAssetsData(data);
    }
  }, [actionDetails]);

  useEffect(() => {
    if (
      navType &&
      maxoutTypes.includes(challengeType) &&
      actionDetails?.assets.length === 0
    ) {
      setIsMaxOutModalVisible(true);
      setIsGoBack(true);
    }

    if (
      navType &&
      compulsory === 'true' &&
      actionDetails?.assets.length === 0
    ) {
      setIsCompulsory(true);
    }
  }, [actionDetails, challengeType, navType]);

  const handleUpdateAction = useCallback(
    async (count?: number) => {
      try {
        let payload = {
          id: id as string,
          day: selectedDay,
          data: {
            actionId,
            status: ActionStatus.COMPLETED,
            completionData: {},
          },
        };

        if (
          challengeType === ChallengeType.SINGLE ||
          challengeType === ChallengeType.SINGLE_VARIANT
        ) {
          payload.data.completionData = {levelIndex: index};
        } else if (
          challengeType === ChallengeType.MULTIPLE ||
          challengeType === ChallengeType.MULTIPLE_VARIANT
        ) {
          payload.data.completionData = {
            completionCount: value,
            completionUnit: unit,
          };
        } else {
          payload.data.completionData = {
            completionCount: count,
            completionUnit: unit,
          };
        }

        const response = await updateProgressAction(payload).unwrap();

        if (response) {
          trackEvent(MIX_PANEL_EVENTS.action_status, {
            challenge_id: response?.challengeId,
            action_status: response?.dayStatus,
            action_id: actionId,
            action_name: name,
            day_number: selectedDay,
            compulsory: compulsory,
            user_id: user?.id,
          });

          router.back();
          router.setParams({refresh: 'true'});
          setIsCompulsory(false);
        }
      } catch (error: any) {
        errorToast(error.data?.message || error.message || 'Please try again');
      }
    },
    [
      id,
      selectedDay,
      actionId,
      challengeType,
      index,
      value,
      unit,
      updateProgressAction,
    ],
  );

  const handleCompletePress = useCallback(() => {
    if (
      challengeType === ChallengeType.MULTIPLE_MAXOUT ||
      challengeType === ChallengeType.SINGLE_MAXOUT ||
      challengeType === ChallengeType.MULTIPLE_MAXOUT_VARIANT
    ) {
      setIsMaxOutModalVisible(true);
    } else {
      if (compulsory === 'true') {
        setIsCompulsory(true);
      } else {
        handleUpdateAction();
      }
    }
  }, [challengeType, handleUpdateAction]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < assetsData.length) {
        flatListRef.current?.scrollToIndex({index, animated: true});
        setCurrentIndex(index);
      }
    },
    [assetsData.length],
  );

  const handleScrollEnd = useCallback((event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / (SCREEN_WIDTH - 20));
    setCurrentIndex(newIndex);
  }, []);

  const handleWhatWhyHowClick = useCallback(() => {
    setIsWhatWhyHowModalVisible(true);
  }, []);

  const handleAnswerChange = (
    assetIndex: number,
    answers: {[questionIndex: number]: string},
  ) => {
    setAllAnswers(prev => ({
      ...prev,
      [assetIndex]: answers,
    }));
  };

  const renderItem = useCallback(
    ({item, index}: {item: GetInProgressActionAssetsData; index: number}) => {
      return (
        <AssetItem
          item={item}
          index={index}
          currentIndex={currentIndex}
          totalItems={assetsData.length}
          onNavigateLeft={() => scrollToIndex(currentIndex - 1)}
          onNavigateRight={() => scrollToIndex(currentIndex + 1)}
          onWhatWhyHowClick={handleWhatWhyHowClick}
          setVideoUrl={setVideoUrl}
          setIsVideoModalVisible={setIsVideoModalVisible}
          onAnswerChange={answers => handleAnswerChange(index, answers)} // 👈 pass it
        />
      );
    },
    [currentIndex, assetsData.length, scrollToIndex, handleWhatWhyHowClick],
  );

  const keyExtractor = useCallback(
    (_: GetInProgressActionAssetsData, index: number) => `asset-${index}`,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderBack title={name as string} />

        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={assetsData}
            scrollEnabled={assetsData.length > 0}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onMomentumScrollEnd={handleScrollEnd}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            style={{
              width: SCREEN_WIDTH,
            }}
            ListEmptyComponent={
              !isLoading ? (
                <ScrollView
                  style={styles.whatWhyHowContainer}
                  showsVerticalScrollIndicator={false}>
                  <WhatWhyHow
                    data={actionDetails as any}
                    isToggled={false}
                    isOpen={true}
                  />
                </ScrollView>
              ) : null
            }
          />
        </View>

        {!keyboardVisible && status === ActionStatus.PENDING && (
          <Button
            title={updateProgressActionLoading ? 'Completing...' : 'Complete'}
            style={{
              ...styles.joinButton,
              opacity: updateProgressActionLoading ? 0.5 : 1,
            }}
            onPress={handleCompletePress}
            disabled={updateProgressActionLoading}
          />
        )}

        {/* Modals */}
        <WhatWhyHowModal
          data={actionDetails}
          visible={isWhatWhyHowModalVisible}
          onClose={() => setIsWhatWhyHowModalVisible(false)}
          assetsData={assetsData}
        />

        <MaxOutCounterModal
          unit={unit as string}
          visible={isMaxOutModalVisible}
          onClose={() => setIsMaxOutModalVisible(false)}
          onSelectDuration={handleUpdateAction}
          isGoBack={isGoBack}
          selectedDuration={passValue}
          id={id}
          selectedDay={selectedDay}
          actionId={actionId}
          navType={navType}
          compulsory={compulsory}
          name={name}
        />

        <VideoModal
          videoUrl={videoUrl}
          visible={isVideoModalVisible}
          onClose={() => setIsVideoModalVisible(false)}
        />

        <ActionCompulsoryModal
          visible={isCompulsory}
          onClose={() => {
            setIsCompulsory(false);
          }}
          onPress={handleUpdateAction}
          isLoading={updateProgressActionLoading}
        />

        {isLoadingDetails && <Loader />}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(AssetsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerContainer: {
    flex: 1,
    paddingHorizontal: getFontSize(2),
  },
  innerContainer: {
    alignSelf: 'center',
    flex: 1,
    marginLeft: 2,
  },
  joinButton: {
    width: '93%',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
  },
  joinButtonText: {
    color: Colors.black,
  },
  whatWhyHowContainer: {
    height: '100%',
    width: SCREEN_WIDTH,
    paddingHorizontal: getFontSize(2),
  },
});
