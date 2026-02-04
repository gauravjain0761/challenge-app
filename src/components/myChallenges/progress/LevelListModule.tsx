import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {captureRef} from 'react-native-view-shot';

import {GetChallengeProgressResponse} from '@/validation/schemas';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {ChallengeType, MIX_PANEL_EVENTS} from '@/types/enums';

import GradientText from '@/components/GradientText';
import IconComponent from '@/components/IconComponent';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';

interface Props {
  item: GetChallengeProgressResponse;
  isCompleted?: boolean;
}

interface RenderItemProps {
  isCustom?: boolean;
  title: string;
  count: string;
}

export const RenderItem = memo(
  ({isCustom = false, title, count}: RenderItemProps) => {
    return (
      <View
        style={[
          styles.itemContainer,
          {borderColor: isCustom ? Colors.orange : Colors._7f7d7c},
        ]}>
        {isCustom ? (
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
        ) : (
          <GradientText
            colors={['#D1D1D6', '#1A1A1A']}
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
        )}
        {/* show day1 in Day 1 */}
        <Text
          style={[
            styles.itemName,
            {textTransform: isCustom ? 'uppercase' : 'capitalize'},
          ]}>
          {title.includes('day')
            ? title.split('day').map((word, index) => {
                return (
                  <Text key={index} style={{textTransform: 'capitalize'}}>
                    {index === 0 ? `Day ${word}` : word}
                  </Text>
                );
              })
            : title}
        </Text>
        <GradientText
          colors={['#999999', Colors.white]}
          text={count}
          style={{
            ...styles.itemCount,
            textTransform: isCustom ? 'uppercase' : 'capitalize',
          }}
          gradientStyle={{width: getFontSize(14)}}
        />
      </View>
    );
  },
);

const LevelListModule = ({item, isCompleted}: Props) => {
  const {user} = useAppSelector(state => state.auth);

  const captureRefs = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  const findLevel = useMemo(
    () => item?.levels?.[item?.avgLevel],
    [item?.levels, item?.avgLevel],
  );

  const isLevelBased = useMemo(
    () =>
      item?.challengeType === ChallengeType.SINGLE ||
      item?.challengeType === ChallengeType.SINGLE_MAXOUT,
    [item?.challengeType],
  );

  const isVariant = useMemo(
    () =>
      item?.challengeType === ChallengeType.MULTIPLE_VARIANT ||
      item?.challengeType === ChallengeType.MULTIPLE_MAXOUT_VARIANT,
    [item?.challengeType],
  );

  const tasksForSelectedDay = useMemo(
    () =>
      isLevelBased
        ? item?.dailyCompletion
        : isVariant
        ? item?.dayCompletions
        : item?.actionCompletions,
    [isLevelBased, isVariant, item],
  );

  const {width: screenWidth} = Dimensions.get('window');
  const fixedHeight = screenWidth * (16 / 9);

  const appUrl = 'https://invite.mentoolschallenges.co/';

  const onPressShare = useCallback(async () => {
    try {
      setLoader(true);
      setIsCapturing(true);

      // Small delay to ensure view is properly rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!captureRefs.current) {
        setLoader(false);
        return;
      }

      const localUri = await captureRef(captureRefs.current, {
        width: screenWidth,
        height: fixedHeight,
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      trackEvent(MIX_PANEL_EVENTS.challenge_shared_image, {
        user_id: user?.id,
        challenge_id: item.challengeId,
        challenge_name: item.challengeName,
        share_type: 'InProgressChallenges',
      });

      await Share.share({
        message: `Check out my ${item?.challengeName} progress! #MenTools Join Me ${appUrl}`,
        url: localUri,
      });
    } catch (error) {
      console.error('Error capturing view:', error);
    } finally {
      setIsCapturing(false);
      setLoader(false);
    }
  }, [item?.challengeName]);

  const renderTaskItem = useCallback(
    ({item: nItem, index}: {item: any; index: number}) => {
      const title = nItem.day || nItem?.actionName || '';
      const countValue =
        item?.challengeType === ChallengeType.MULTIPLE_MAXOUT
          ? nItem.completionCount || ''
          : nItem.completionCount || nItem?.completed || '';

      const unit =
        item?.challengeType === ChallengeType.MULTIPLE_MAXOUT
          ? nItem.completionUnit ?? ''
          : item?.challengeType === ChallengeType.MULTIPLE
          ? nItem?.total
          : item?.levels?.[1]?.goal?.unit || '';

      return (
        <RenderItem
          key={index.toString()}
          title={title}
          count={
            item?.challengeType === ChallengeType.MULTIPLE
              ? countValue
                ? ` ${countValue}/${unit} Actions`
                : 'Actions'
              : `${countValue} ${unit}`
          }
        />
      );
    },
    [item?.challengeType, item?.levels],
  );

  return (
    <View style={styles.outerContainer}>
      {loader && <Loader />}

      {/* Capture area - only the content card */}
      <View
        ref={captureRefs}
        style={[
          styles.captureContainer,

          isCompleted && {
            paddingBottom: isCapturing ? getFontSize(5) : getFontSize(5.5),
          },
          isCapturing && {
            height: fixedHeight,
            justifyContent: 'center',
            borderRadius: getFontSize(0),
          },
        ]}
        collapsable={false}>
        {isCompleted && (
          <GradientText
            text={'CHALLENGE COMPLETED'}
            style={styles.headingText}
            containerStyle={{paddingVertical: getFontSize(2)}}
            height={
              item?.challengeShortName &&
              item?.challengeShortName?.length > 25
                ? getFontSize(7.5)
                : item?.challengeName && item?.challengeName?.length > 25
                ? getFontSize(7.5)
                : getFontSize(4.5)
            }
          />
        )}
        <View style={styles.innerContainer}>
          <ImageBackground
            source={
              item?.socialShareImage
                ? {uri: item?.socialShareImage}
                : Images.levelBg
            }
            resizeMode="cover"
            style={styles.bgImage}>
            <FastImage
              source={Images.Men_Tools_Logo}
              style={styles.logo}
              resizeMode="contain"
            />

            <GradientText
              text={
                item?.challengeShortName == ''
                  ? item?.challengeName
                  : item?.challengeShortName
              }
              style={styles.headingText}
              height={
                item?.challengeName && item?.challengeName?.length > 20
                  ? getFontSize(7.5)
                  : getFontSize(5)
              }
            />

            <ScrollView
              contentContainerStyle={styles.contentContainerStyle}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}>
              {(tasksForSelectedDay || []).map((nItem: any, index) => {
                return renderTaskItem({item: nItem, index: index});
              })}

              <RenderItem
                isCustom
                title={isCompleted ? 'FINISH LEVEL' : 'CURRENT LEVEL'}
                count={findLevel?.name ?? ''}
              />
            </ScrollView>
          </ImageBackground>
        </View>
      </View>

      {/* Share button and text - outside capture area */}
      <View style={styles.shareSection}>
        <Button
          title="Share"
          type="fill"
          style={styles.buttonStyle}
          onPress={onPressShare}
        />
        <Text style={styles.shareText}>If you dare</Text>
      </View>
    </View>
  );
};

export default memo(LevelListModule);

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: getFontSize(3),
  },
  captureContainer: {
    paddingHorizontal: getFontSize(4),
    paddingVertical: getFontSize(2),
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: 'hidden',
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: Colors.orange,
    overflow: 'hidden',
    borderRadius: getFontSize(0.5),
  },
  bgImage: {
    // paddingHorizontal: getFontSize(2),
    // paddingVertical: getFontSize(1),
  },
  logo: {
    height: getFontSize(3),
    width: getFontSize(12),
    alignSelf: 'center',
    marginTop: getFontSize(2),
    marginBottom: getFontSize(1.5),
  },
  headingText: {
    textAlign: 'center',
    fontSize: getFontSize(2.8),
    fontWeight: '600',
    textTransform: 'uppercase',
    //marginBottom: getFontSize(0.5),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    borderColor: Colors._7f7d7c,
    gap: getFontSize(1.5),
    backgroundColor: Colors.shareModalBgColor,
  },
  contentContainerStyle: {
    gap: getFontSize(1.2),
    paddingHorizontal: getFontSize(2),
    marginBottom: getFontSize(2),
  },
  itemName: {
    color: Colors.white,
    fontSize: getFontSize(1.7),
    fontWeight: '600',
    textTransform: 'capitalize',
    flex: 1,
  },
  itemCount: {
    color: Colors.white,
    fontSize: getFontSize(1.7),
    fontWeight: '500',
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  shareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(2),
    paddingTop: getFontSize(2),
    paddingBottom: getFontSize(1),
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
});
