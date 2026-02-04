import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback, useMemo} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {ExploreChallengeUserType} from '@/types/enums';
import {setAsyncSeeAll} from '@/utils/common/useAsyncFunctions';
import IconComponent from '@/components/IconComponent';

interface SeeAllStepOneProps {
  next: () => void;
  selectedType: ExploreChallengeUserType;
  filterOptions: {label: string; value: ExploreChallengeUserType}[];
  setSelectedType: (type: ExploreChallengeUserType) => void;
}

const SeeAllStepOne = (props: SeeAllStepOneProps) => {
  const {next, selectedType, filterOptions, setSelectedType} = props;
  const [stepIndex, setStepIndex] = useState<number>(0);

  console.log('filterOptions', filterOptions);

  const overlayLeftMap = useMemo(() => {
    if (!filterOptions) return {};

    // Desired visual order (same as before)
    const order: ExploreChallengeUserType[] = [
      ExploreChallengeUserType.ALL,
      ExploreChallengeUserType.MULTIPLE,
      ExploreChallengeUserType.SINGLE,
      ExploreChallengeUserType.MAXOUT,
    ];

    // Filter only available types
    const availableTypes = order.filter(type =>
      filterOptions.some(t => t.value === type),
    );

    // Base spacing step — adjust if needed
    const baseSpacing = getFontSize(4);

    // Dynamically calculate left offset based on index
    const map: Record<string, number> = {};

    availableTypes.forEach((type, index) => {
      let spacing = baseSpacing * (index + 1);

      // Optionally, handle specific type adjustments
      if (type === ExploreChallengeUserType.SINGLE) {
        spacing = getFontSize(
          selectedType === ExploreChallengeUserType.SINGLE ? 5 : 10,
        );
      }

      map[type] = spacing;
    });

    return map;
  }, [filterOptions, selectedType]);

  const overlayStyle = {
    top: isIphoneX() ? getFontSize(20) : getFontSize(16), // Fixed position since we don't have mask
    left: overlayLeftMap[selectedType?.toLowerCase()] ?? getFontSize(4), // Default left position
  };
  // const handleNextStep = useCallback(() => {}, [next]);

  const handlePreviousStep = useCallback(() => {
    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      setStepIndex(prevIndex);
      setSelectedType(filterOptions[prevIndex].value);
    }
  }, [stepIndex, filterOptions, setSelectedType]);

  const handleNextStep = useCallback(() => {
    if (stepIndex < filterOptions.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setSelectedType(filterOptions[nextIndex].value);
    } else {
      // Optional: close walkthrough or call `next()` callback
      setSelectedType(filterOptions[0].value);
      next?.();
    }
  }, [stepIndex, filterOptions, setSelectedType, next]);

  const close = async () => {
    // Skip all See All walkthrough steps
    await setAsyncSeeAll();
    console.log('🎯 Skip All executed, AsyncStorage set to false');
    // Since we don't have a stop function in custom walkthrough, we'll just complete it
    next();
  };

  const getDec = () => {
    if (selectedType === ExploreChallengeUserType.ALL) {
      return 'See All Challenges';
    } else if (selectedType === ExploreChallengeUserType.MAXOUT) {
      return 'MaxOut action = Every day you push as hard as you can. No limits, just you taking action to find your MaxOut';
    } else if (selectedType === ExploreChallengeUserType.MULTIPLE) {
      return "Multi action = 7 Different Actions for 7 Day's. A true Challenge.";
    } else if (selectedType === ExploreChallengeUserType.SINGLE) {
      return 'Single action = 1 Action everyday for 7 days. It is harder than it sounds.';
    }
  };
  return (
    <ImageBackground
      source={
        stepIndex === 1 || stepIndex === 2
          ? Images.speechBubble_icons_2
          : Images.speechBubble_icons
      }
      resizeMode="stretch"
      imageStyle={{
        transform: [{rotateY: stepIndex > 1 ? '0deg' : '180deg'}],
      }}
      style={[styles.overlay, overlayStyle]} // ✅ Merge dynamic style
    >
      <View style={styles.mainContainer}>
        {selectedType == ExploreChallengeUserType.ALL && (
          <IconComponent
            name="close"
            size={getFontSize(3)}
            onPress={close}
            color={Colors.white}
            style={styles.close}
          />
        )}
        <Text style={GeneralStyle.overlayText}>{getDec()}</Text>
        <View style={GeneralStyle.btnRow}>
          {/* {selectedType == ExploreChallengeUserType.ALL && (
            <Button
              title="Skip All"
              type="outline"
              onPress={onSkipAll}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
            />
          )} */}
          {stepIndex > 0 && (
            <Button
              title="Previous"
              type="outline"
              onPress={handlePreviousStep}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
            />
          )}
          <Button
            title="Next"
            onPress={handleNextStep}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default SeeAllStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(32),
    height: getFontSize(22),
    position: 'absolute',
    top: getFontSize(8),
    left: getFontSize(4),
    zIndex: 9999,
  },
  mainContainer: {
    paddingHorizontal: getFontSize(2),
    paddingTop: getFontSize(6),
    justifyContent: 'center',
    flex: 1,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.orange,
    marginRight: getFontSize(0.5),
  },
  skipButtonText: {
    color: Colors.orange,
  },
  close: {
    right: getFontSize(2),
    alignSelf: 'flex-end',
    marginBottom: getFontSize(1),
    position: 'absolute',
    top: getFontSize(5),
  },
});
