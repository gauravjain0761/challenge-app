import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Button,
} from 'react-native';
import {FilterButton} from '@/components/FilterButton';
import {
  capitalizeFirstLetter,
  getCategoryDisplayName,
  getFontSize,
} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useLocalSearchParams, useRouter} from 'expo-router';
import LinearGradient from 'react-native-linear-gradient';
import ChallengeItem from '@/components/ChallengeItem';
import {useGetChallengesQuery} from '@/api/exploreApi';
import {GeneralStyle} from '@/constants/GeneralStyle';
import ExploreS from '@/components/skeleton/ExploreS';
import {CategoryFilter, ChallengeMode} from '@/types/enums';
import {ChallengeInfo} from '@/types';
import {ChallengeListItem} from '@/validation/schemas/explore.schema';
import IconComponent from '@/components/IconComponent';
import {Images} from '@/assets/images';
import {useWalkthroughStep} from 'react-native-interactive-walkthrough';
import ExploreStepTwo from '@/components/WalkThroughSteps/explore/ExploreStepTwo';
import ExploreStepThree from '@/components/WalkThroughSteps/explore/ExploreStepThree';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import ExploreStepFour from '@/components/WalkThroughSteps/explore/ExploreStepFour';
import {setAsyncExplorer} from '@/utils/common/useAsyncFunctions';
import FastImage from 'react-native-fast-image';
import index from '@/app/(auth)/(onBoardingFlow)';
import ChallengeExplainModal from '@/components/InfoModals/ChallengeExplainModal';
import {setPersonalizedCategories} from '@/features/authSlice';

const FILTERS = Object.values(CategoryFilter);

const MODE = [
  capitalizeFirstLetter(ChallengeMode.PERSONAL),
  capitalizeFirstLetter(ChallengeMode.GROUP),
];

interface ChallengesData {
  group?: ChallengeListItem[];
  personal?: ChallengeListItem[];
  [key: string]: ChallengeListItem[] | undefined; // Add index signature
}

const ExploreChallenges = ({category}: {category?: CategoryFilter}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {user, personalizedCategories} = useAppSelector(state => state.auth);
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>(
    CategoryFilter.ALL,
  );
  const filterRef = React.useRef<FlatList>(null);

  useEffect(() => {
    if (category) {
      setSelectedFilter(category);
    }
  }, [category]);

  useEffect(() => {
    if (personalizedCategories) {
      const newList = Object.values(CategoryFilter).filter(
        key => personalizedCategories == key,
      );

      const findIndex = Object.values(CategoryFilter).findIndex(
        key => personalizedCategories == key,
      );

      if (newList.length > 0 && findIndex !== -1) {
        setSelectedFilter(personalizedCategories);

        if (filterRef?.current) {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            filterRef?.current?.scrollToIndex({
              index: findIndex ? findIndex : 0,
              animated: true,
              viewPosition: 1,
            });
            //dispatch(setPersonalizedCategories(null as any));
          });
        }
      } else {
        setSelectedFilter(CategoryFilter.ALL);
        dispatch(setPersonalizedCategories(null as any));
      }
    }
  }, [personalizedCategories]);

  const [infoVisible, setInfoVisible] = useState(false);

  const {data, isLoading} = useGetChallengesQuery(
    {
      category: selectedFilter,
      limit: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const getChallengesForMode = (mode: ChallengeMode): ChallengeListItem[] => {
    if (!data) return [];
    const challenges = (data as ChallengesData)[mode.toLowerCase()] || [];
    return challenges.map((challenge: any) => ({
      ...challenge,
      id: challenge._id, // important for FlatList key
      mode: mode.toLowerCase(), // force correct mode ('personal' or 'group')
    }));
  };

  const filteredMODE = useMemo(() => {
    return MODE.reduce<
      {mode: ChallengeMode; challenges: ChallengeListItem[]}[]
    >((acc, mode) => {
      const challengesForMode = getChallengesForMode(mode as ChallengeMode);
      if (challengesForMode.length > 0) {
        acc.push({mode: mode as ChallengeMode, challenges: challengesForMode});
      }
      return acc;
    }, []);
  }, [data]);

  const step2 = useWalkthroughStep({
    number: 2,
    OverlayComponent: ExploreStepTwo,
  });
  const step3 = useWalkthroughStep({
    number: 3,
    OverlayComponent: ExploreStepThree,
  });
  const step4 = useWalkthroughStep({
    number: 4,
    OverlayComponent: ExploreStepFour,
  });

  const renderMode = ({
    item,
    index,
  }: {
    item: {mode: ChallengeMode; challenges: ChallengeInfo[]};
    index: number;
  }) => {
    const {mode, challenges} = item;

    return (
      <View style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <ImageBackground
            onLayout={
              mode.toLocaleLowerCase() === ChallengeMode.PERSONAL
                ? step3.onLayout
                : undefined
            }
            source={Images.badge_bg}
            resizeMode="contain"
            style={styles.badge}>
            <Text style={styles.levelTitle}>
              {mode.toLocaleLowerCase() === ChallengeMode.GROUP
                ? ChallengeMode.WORLDWIDE
                : mode}
            </Text>
          </ImageBackground>
          {index === 0 && (
            <TouchableOpacity onPress={() => setInfoVisible(true)}>
              <FastImage
                source={Images.info_Icon}
                resizeMode="contain"
                style={styles.image}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onLayout={
              mode.toLocaleLowerCase() === ChallengeMode.PERSONAL
                ? step4.onLayout
                : undefined
            }
            style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}
            onPress={async () => {
              // Mark explore walkthrough as completed when user clicks "See All"
              await setAsyncExplorer();
              dispatch(setPersonalizedCategories(null as any));
              step4.stop();

              router.push({
                pathname: '/seeAll',
                params: {
                  mode,
                  category: selectedFilter,
                },
              });

              // if (user?.isFirstTimeUser) {
              //   await setAsyncExplorer();
              //   step4.stop();
              // }
            }}>
            <View style={styles.seeAllContainer}>
              <Text style={styles.seeAllText}>See all</Text>
              <IconComponent
                type="AntDesign"
                name="right"
                size={getFontSize(2)}
                color={Colors.white}
              />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredMODE.length > 1 ? challenges.slice(0, 2) : challenges}
          keyExtractor={challenge => challenge?.id}
          renderItem={({item}) => (
            <ChallengeItem
              item={item as unknown as ChallengeListItem}
              exploreChallenge={true}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeList}
        />
      </View>
    );
  };

  // console.log('filteredMODE', JSON.stringify(filteredMODE, null, 2));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#000', Colors.orangeOpacity]} // Adjust gradient colors
        style={{flex: 1}}>
        <View style={styles.header}>
          <View onLayout={step2.onLayout} style={{}}>
            <FlatList
              horizontal
              data={FILTERS}
              ref={filterRef}
              keyExtractor={item => item}
              renderItem={({item}: {item: CategoryFilter}) => (
                <FilterButton
                  title={getCategoryDisplayName(item)}
                  isSelected={selectedFilter === item}
                  onPress={() => {
                    setSelectedFilter(item);
                  }}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={GeneralStyle.filterContainer}
            />
          </View>
          <View style={GeneralStyle.center}>
            <FlatList
              data={filteredMODE as any}
              keyExtractor={item => item.mode}
              renderItem={renderMode}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              ListEmptyComponent={isLoading ? <ExploreS /> : null}
            />
          </View>
        </View>
        {infoVisible && (
          <ChallengeExplainModal
            visible={infoVisible}
            onClose={() => setInfoVisible(false)}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  content: {
    paddingBottom: getFontSize(11),
  },
  challengeCard: {
    width: getFontSize(38),
    marginRight: getFontSize(2),
    borderRadius: getFontSize(1),
    overflow: 'hidden',
    //backgroundColor: "#1A1A1A",
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative', // Enables absolute positioning for child elements
  },
  challengeImage: {
    width: '100%',
    height: getFontSize(15),
  },
  tag: {
    position: 'absolute',
    top: getFontSize(1),
    left: getFontSize(1),
    backgroundColor: Colors.black,
    paddingHorizontal: getFontSize(1),
    paddingVertical: getFontSize(0.5),
    borderRadius: getFontSize(2),
  },
  liveTag: {
    backgroundColor: Colors.black, // Different background for Live tag
  },
  tagText: {
    color: 'white',
    fontSize: getFontSize(1.5),
    fontWeight: '600',
  },
  infoOverlay: {
    position: 'absolute', // Overlay text on the image
    bottom: 0, // Align text to the bottom of the image
    left: 0,
    right: 0,
    padding: getFontSize(1),
  },
  challengeTitle: {
    color: 'white',
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    marginBottom: getFontSize(0.5),
  },
  challengeParticipants: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    marginBottom: getFontSize(0.5),
    fontWeight: '400',
  },
  challengeTime: {
    color: Colors.orange,
    fontSize: getFontSize(1.5),
    fontWeight: '400',
  },
  levelSection: {
    marginBottom: getFontSize(1),
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getFontSize(1.5),
    gap: 10,
  },
  levelTitle: {
    color: 'white',
    fontSize: getFontSize(1.8),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  seeAllText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
  },
  challengeList: {
    //paddingLeft: getFontSize(2),
  },
  challengeInfo: {
    padding: getFontSize(1),
  },
  badge: {
    padding: getFontSize(1.5),
  },

  overlay: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#000000',
    // padding: 20,
    borderRadius: 10,
  },
  overlayText: {color: '#fff', marginBottom: 10, textAlign: 'center'},
  image: {
    height: getFontSize(3),
    width: getFontSize(3),
  },
});

export default ExploreChallenges;
