import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {captureRef} from 'react-native-view-shot';
import GradientText from '@/components/GradientText';
import IconComponent from '@/components/IconComponent';
import CompeteFriends from '@/components/info/CompeteFriends';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import {router, useLocalSearchParams} from 'expo-router';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import * as Linking from 'expo-linking';
import branch from 'react-native-branch';
import {useInviteFriendMutation} from '@/api/friendApi';
import {setIsCompletionInfoData, setAutoJoinState} from '@/features/authSlice';
import {setAsyncExploreInfo} from '@/utils/common/useAsyncFunctions';
import WhyView from '@/components/ChallengeJoin/WhyView';
import {DEFAULT_MULTIPLE_LEVELS, MIX_PANEL_EVENTS} from '@/types/enums';
import {useAddWhyMutation} from '@/api/progressChallengesApi';
import {errorToast} from '@/utils/common/commonFunction';
import FastImage from 'react-native-fast-image';
import {BlurView} from 'expo-blur';
import {trackEvent} from '@/hooks/useMixpanelClient';

const ChallengeJoin = ({}) => {
  const {isCompletionInfoData, user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [inviteFriend, {isLoading: inviteLoading}] = useInviteFriendMutation();
  const [why, setWhy] = useState<string>('');
  const [whyError, setWhyError] = useState<string>('');
  const params = useLocalSearchParams();

  const [addWhy, {isLoading: whyLoading}] = useAddWhyMutation();

  const captureRefs = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  const [isInfoData, setIsInfoData] = useState<any>(null);

  const goalName = DEFAULT_MULTIPLE_LEVELS.find(
    (_, n) => n === Number(isInfoData?.selectedGoal),
  )?.name as string;

  useEffect(() => {
    if (isCompletionInfoData) {
      console.log('✅ Challenge join data available:', isCompletionInfoData);
      setIsInfoData(isCompletionInfoData);
      dispatch(setIsCompletionInfoData(null));
      dispatch(setAutoJoinState(false));
    } else {
      console.log('⚠️ Challenge join data not yet available');
      dispatch(setAutoJoinState(false));
    }
  }, [isCompletionInfoData]);

  const handleDone = async () => {
    try {
      if (!why) {
        setWhyError('Why is required');
        return;
      }

      const response = await addWhy({
        id: isInfoData?._id,
        data: {why: why},
      }).unwrap();

      if (response?.message) {
        router.dismissAll();
        router.push({
          pathname: '/(modals)/(myChallenges)/(progressChallenges)/[id]',
          params: {
            id: isInfoData?._id,
            challengeItem: JSON.stringify({
              name: isInfoData.challengeName || '',
              image: isInfoData?.image || isInfoData.challengeImage || '',
            }),
          },
        });

        if (user?.isFirstTimeUser) {
          await setAsyncExploreInfo();
        }
      }
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
      console.log('error', error);
    }
  };

  const appUrl = 'https://invite.mentoolschallenges.co/';

  const onPressShare = useCallback(async () => {
    try {
      setLoader(true);
      setIsCapturing(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      if (!captureRefs.current) {
        setLoader(false);
        return;
      }
      const fixedHeight = SCREEN_WIDTH * (16 / 9);
      const viewDimensions = await new Promise<{width: number; height: number}>(
        resolve => {
          captureRefs.current?.measure((x, y, width, height) => {
            resolve({width, height});
          });
        },
      );

      const localUri = await captureRef(captureRefs.current, {
        width: SCREEN_WIDTH,
        height: viewDimensions.height,
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      console.log('Share URI:', localUri);

      await Share.share({
        message: `Challenge ON! #MenTools Join Me ${appUrl}`,
        url: localUri,
      });
    } catch (error) {
      console.error('Error capturing view:', error);
    } finally {
      setIsCapturing(false);
      setLoader(false);
    }
  }, []);

  const onInvite = async () => {
    try {
      const response = await inviteFriend({
        id: isInfoData?._id as string,
      }).unwrap();
      if (response) {
        const challenge = response?.inviteData?.challengeData;

        const token = response?.inviteData?.token;
        const parsed = Linking.parse(response?.inviteData?.links?.universal);
        const {queryParams}: any = parsed;

        const buo = await branch.createBranchUniversalObject(
          `challenge/${queryParams?.invite}`,
          {
            title: `Join "${queryParams.challengeName}" on MenTools!`,
            contentDescription: `You're invited to join the "${queryParams.challengeName}" challenge on MenTools.`,
            canonicalUrl: 'https://invite.mentoolschallenges.co',
            contentImageUrl: queryParams.challengeImage,
            contentMetadata: {
              customMetadata: {
                invite_token: queryParams?.invite,
                challenge_id: queryParams.challengeId,
                challengeName: queryParams?.challengeName,
                challengeImage: queryParams?.challengeImage,
                startDate: challenge?.startDate || '',
                targetEndDate: challenge?.targetEndDate || '',
                selectedLevelIndex: response?.inviteData?.challengeData
                  ?.selectedLevelIndex as any,
                daysToFail: response?.inviteData?.challengeData
                  ?.daysToFail as any,
              },
            },
          },
        );

        trackEvent(MIX_PANEL_EVENTS.challenge_invite_sent, {
          user_id: user?.id,
          challenge_id: queryParams.challengeId,
          challenge_name: queryParams.challengeName,
          invite_method: 'challenge_invite',
        });

        await buo.showShareSheet({});
      }
    } catch (error: any) {
      console.log('onInvite error details:', error);
      errorToast('Failed to share invite. Please try again.');
    }
  };

  const RenderItem = memo(({title, count}: any) => {
    return (
      <View style={[styles.itemContainer]}>
        <GradientText
          colors={['#FF7302', Colors.black]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 0.9}}
          customGradient={
            <IconComponent
              name="fire"
              type="Fontisto"
              size={getFontSize(2)}
              color={Colors._b1b1b5}
            />
          }
          gradientStyle={{width: getFontSize(1.8), height: getFontSize(2)}}
        />
        <Text style={[styles.itemName]}>{title}</Text>
        <GradientText
          colors={['#999999', Colors.white]}
          text={count}
          style={styles.itemCount}
          gradientStyle={{width: getFontSize(20)}}
        />
      </View>
    );
  });

  if (!isInfoData) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.modal}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}>
        <GradientText
          text={`CHALLENGE ON!`}
          colors={[Colors._999999, Colors.white, Colors._999999]}
          start={{x: 0.3, y: 0}}
          end={{x: 0.7, y: 0}}
          style={styles.heading}
          containerStyle={{
            marginBottom: getFontSize(3),
          }}
        />

        <WhyView
          onChangeText={t => {
            setWhyError('');
            setWhy(t);
          }}
          error={whyError}
        />

        <GradientText
          text={`Share the pain...`}
          colors={[Colors._999999, Colors.white, Colors._999999]}
          start={{x: 0.25, y: 0}}
          end={{x: 0, y: 0}}
          style={{...styles.headingText1, textAlign: 'left'}}
          containerStyle={{
            marginVertical: getFontSize(3),
          }}
        />

        <CompeteFriends
          onPress={onInvite}
          containerStyle={styles.containerStyle}
        />
        <GradientText
          text={`Add more pressure...`}
          colors={[Colors._999999, Colors.white, Colors._999999]}
          start={{x: 0.25, y: 0}}
          end={{x: 0, y: 0}}
          style={{...styles.headingText1, textAlign: 'left'}}
          containerStyle={{
            marginVertical: getFontSize(3),
          }}
        />

        <View
          ref={captureRefs}
          collapsable={false}
          style={[isCapturing && styles.captureContainer]}>
          <View
            style={[
              styles.innerContainer,
              isCapturing && styles.captureInnerContainer,
            ]}>
            {isCapturing && (
              <BlurView
                style={StyleSheet.absoluteFillObject}
                intensity={10}
                tint="dark"
              />
            )}
            {isCapturing && (
              <View style={styles.logoContainer}>
                <FastImage
                  source={Images.Men_Tools_Logo}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            )}
            <View style={{width: '90%', alignSelf: 'center'}}>
              <GradientText
                text={isInfoData?.challengeName ?? ''}
                style={styles.headingText}
                height={
                  isInfoData?.challengeName &&
                  isInfoData?.challengeName?.length > 20
                    ? getFontSize(7.5)
                    : getFontSize(6)
                }
              />
            </View>

            <View style={styles.unitView}>
              <RenderItem
                isCustom
                title={'GOAL'}
                count={goalName ?? 'INTERMEDIATE'}
              />
            </View>
            {!isCapturing && (
              <View style={styles.shareSection}>
                <Button
                  title="Share"
                  type="fill"
                  style={styles.buttonStyle}
                  onPress={onPressShare}
                />
                <Text style={styles.shareText}>If you dare</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Button title="Done" onPress={handleDone} />
      </View>
      {(inviteLoading || loader || whyLoading) && <Loader />}
    </SafeAreaView>
  );
};

export default ChallengeJoin;

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    padding: getFontSize(1),
  },
  containerStyle: {
    marginTop: 0,
  },
  modal: {
    backgroundColor: Colors.black,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: getFontSize(2),
  },
  heading: {
    fontSize: getFontSize(5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  headingText1: {
    fontSize: getFontSize(3),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: getFontSize(2),
  },

  innerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: 'hidden',
    borderRadius: getFontSize(1),
    paddingBottom: getFontSize(4),
    backgroundColor: Colors._1A1A1A,
  },
  logoContainer: {
    position: 'absolute',
    top: getFontSize(1),
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    height: getFontSize(3),
    width: getFontSize(12),
    alignSelf: 'center',
  },
  bgImage: {
    height: getFontSize(32),
    width: '100%',
    justifyContent: 'center',
  },

  headingText: {
    textAlign: 'center',
    fontSize: getFontSize(3),
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.white,
    lineHeight: getFontSize(4),
    paddingTop: getFontSize(2),
  },

  shareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(2),
    paddingTop: getFontSize(2),
  },
  buttonStyle: {
    width: getFontSize(11),
    height: getFontSize(4),
  },
  shareText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '500',
  },
  itemCount: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  unitView: {
    width: '85%',
    alignSelf: 'center',
    marginTop: getFontSize(4),
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: getFontSize(1.2),
    paddingVertical: getFontSize(2),
    borderRadius: getFontSize(1),
    borderColor: Colors.shareModalBgColor,
    gap: getFontSize(1.5),
  },
  contentContainerStyle: {
    paddingVertical: getFontSize(0.5),
    gap: getFontSize(0.7),
    paddingHorizontal: getFontSize(0.2),
  },
  itemName: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 1,
  },
  captureContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (16 / 9),
    backgroundColor: Colors._1A1A1A,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 0,
  },
  captureInnerContainer: {
    height: '80%',
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getFontSize(0.5),
    borderColor: Colors.orange,
  },
});
