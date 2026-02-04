import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Images} from '@/assets/images';
import GradientText from '../GradientText';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ReviewList from './ReviewList';
import {SUBSCRIPTION_PLAN} from '@/types/enums';
import {router} from 'expo-router';
import {PRIVACY_URL, TERMS_URL} from '@/utils/constants/api';
import IconComponent from '../IconComponent';
import TrialToggle from './TrialToggle';

const SubscriptionView = ({
  onSelection = () => {},
  offerings,
  selectedPlan,
  isLoading = false,
  onRestore,
  isHellChallenge,
}: {
  onSelection?: (pkg: string) => void;
  offerings: any;
  selectedPlan: string;
  isLoading?: boolean;
  onRestore?: () => Promise<void>;
  isHellChallenge?: boolean;
}) => {
  console.log('offerings', JSON.stringify(offerings));

  const sevenDaysPlan =
    (offerings?.premium_challenges_7days?.weekly as any) || null;
  const monthlyPlan = (offerings?.premium_challenges?.monthly as any) || null;
  const yearlyPlan =
    (offerings?.premium_challenges_yearly?.annual as any) || null;

  const handleSelection = (pkg: string) => {
    onSelection(pkg);
  };

  const StartView = ({title}: {title: string}) => {
    return (
      <View style={styles.starVContainer}>
        <FastImage
          source={Images.star}
          defaultSource={Images.star}
          style={styles.starImage}
          tintColor={isHellChallenge ? Colors._FE0D0D : undefined}
        />
        <Text style={styles.titleText}>{title}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      style={styles.imageBackground}
      resizeMode="stretch"
      source={Images.subscription_bg}>
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <IconComponent
          name={'close'}
          size={getFontSize(3)}
          color={Colors.white}
          type={'AntDesign'}
          style={{
            alignSelf: 'flex-end',
            paddingHorizontal: getFontSize(2),
          }}
          onPress={() => router.back()}
        />
        <GradientText
          colors={
            isHellChallenge
              ? [Colors._FE0D0D, '#D1D1D6']
              : ['#EF6C00', '#D1D1D6']
          }
          text={'GO PRO FOR FREE'}
          style={styles.headingText}
          gradientStyle={{
            height: getFontSize(3),
          }}
        />
        {/* <Text style={styles.decText}>
          Join thousands of men who have successfully challenged themselves to
          improve their lives everyday.
        </Text> */}
        {/* <Text style={styles.unlimitedText}>Unlimited Access Experience</Text> */}
        <View style={styles.starContainer}>
          <StartView title="Unlock Unlimited Challenges" />
          <StartView title="Challenge your Friends" />
          <StartView title="Compete on a global leaderboard" />
          <StartView title="Record progress & build habits" />
          <StartView title="Cancel or change plan anytime" />
        </View>

        <TrialToggle isHellChallenge={isHellChallenge} />

        {!isLoading && (
          <View>
            {/* 7 Days Plan */}

            <View style={styles.planContainer}>
              <TouchableOpacity
                onPress={() => handleSelection(SUBSCRIPTION_PLAN.PREMIUM_7DAYS)}
                style={[
                  styles.singlePlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_7DAYS &&
                    styles.monthlyPlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_7DAYS &&
                    isHellChallenge && {borderColor: Colors._FE0D0D},
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.singlePriceText,
                      isHellChallenge && {color: Colors._FE0D0D},
                    ]}>
                    {sevenDaysPlan?.product?.priceString || 'N/A'}/ 7 Days{' '}
                  </Text>
                  <Text style={styles.singleText}>
                    {/* billed per 7 days until cancelled */}
                    No Payment Now | Billed after trial Every 7 days until
                    cancelled
                  </Text>
                </View>
                <GradientText
                  text={'WEEKLY'}
                  colors={['#555555', '#BBBBBB']}
                  style={styles.headingText}
                  height={getFontSize(4)}
                  containerStyle={{
                    width: '40%',
                  }}
                />
              </TouchableOpacity>
            </View>

            {/*  Monthly Plan */}

            <View style={styles.planContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleSelection(SUBSCRIPTION_PLAN.PREMIUM_MONTHLY)
                }
                style={[
                  styles.singlePlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_MONTHLY &&
                    styles.monthlyPlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_MONTHLY &&
                    isHellChallenge && {borderColor: Colors._FE0D0D},
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.singlePriceText,
                      isHellChallenge && {color: Colors._FE0D0D},
                    ]}>
                    {monthlyPlan?.product?.priceString || 'N/A'}/mo.
                  </Text>
                  <Text style={styles.singleText}>
                    No Payment Now | Billed after trial Every month until
                    cancelled
                  </Text>
                </View>
                <GradientText
                  text={'MONTHLY'}
                  colors={['#555555', '#BBBBBB']}
                  style={styles.headingText}
                  height={getFontSize(4)}
                  containerStyle={{
                    width: '40%',
                  }}
                />
              </TouchableOpacity>
              <View style={styles.mostPopular}>
                <Text style={styles.mostPopularText}>Most Popular</Text>
              </View>
            </View>

            {/*  Yearly Plan */}
            <View style={styles.planContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleSelection(SUBSCRIPTION_PLAN.PREMIUM_YEARLY)
                }
                style={[
                  styles.yearPlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_YEARLY &&
                    styles.monthlyPlan,
                  selectedPlan === SUBSCRIPTION_PLAN.PREMIUM_YEARLY &&
                    isHellChallenge && {borderColor: Colors._FE0D0D},
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.priceText,
                      isHellChallenge && {color: Colors._FE0D0D},
                    ]}>
                    {yearlyPlan?.product?.priceString || 'N/A'}/yr.
                  </Text>

                  <Text
                    style={[styles.singleText, {marginTop: getFontSize(0.5)}]}>
                    No Payment Now | Billed after trial Every month until
                    cancelled
                  </Text>
                </View>

                <LinearGradient
                  colors={[Colors._999999, '#303030']}
                  style={styles.bestValueView}>
                  <View style={{padding: getFontSize(2)}}>
                    <Text
                      style={[
                        styles.bestValueText,
                        {fontSize: getFontSize(1.4)},
                      ]}>
                      *BEST VALUE*
                    </Text>
                    <Text
                      style={[
                        styles.bestValueText,
                        {fontSize: getFontSize(1.9)},
                      ]}>
                      Save 30%
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.decText}>
          Cancel anytime and we will always{'\n'}remind you before the trail
          ends
        </Text>

        {/* ReviewList */}
        <ReviewList isHellChallenge={isHellChallenge} />

        <Text style={styles.changeText}>Change plan or cancel anytime</Text>
        <View style={styles.row}>
          <Text
            onPress={() => {
              router.push({
                pathname: '/(modals)/(profile)/webScreen',
                params: {
                  title: 'Privacy policy',
                  url: PRIVACY_URL,
                },
              });
            }}
            style={styles.privacyText}>
            Privacy Policy
          </Text>
          <Text style={styles.privacyText}>|</Text>
          <Text
            onPress={() => {
              router.push({
                pathname: '/(modals)/(profile)/webScreen',
                params: {
                  title: 'Terms of use',
                  url: TERMS_URL,
                },
              });
            }}
            style={styles.privacyText}>
            Terms of use
          </Text>
        </View>

        <TouchableOpacity onPress={onRestore} disabled={isLoading}>
          <Text style={styles.privacyText}>Restore Purchase</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default SubscriptionView;

const styles = StyleSheet.create({
  imageBackground: {
    //padding: getFontSize(2),
    paddingBottom: getFontSize(2),
    paddingTop: getFontSize(2),
    borderRadius: getFontSize(2),
    // marginTop: getFontSize(2),
    width: SCREEN_WIDTH,
    flex: 1,
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(2.8),
    fontWeight: '700',
    textAlign: 'center',
  },
  decText: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    textAlign: 'center',
    marginTop: getFontSize(2),
    color: Colors.white,
    opacity: 0.6,
    paddingHorizontal: getFontSize(2),
  },

  mostPopular: {
    position: 'absolute',
    top: -13,
    left: 40,
    backgroundColor: Colors._F8A45E,
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(0.8),
    borderRadius: getFontSize(2),
  },
  mostPopularText: {
    fontSize: getFontSize(1.5),
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.black,
  },
  unlimitedText: {
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: getFontSize(3),
    color: Colors.white,
  },
  starContainer: {
    marginTop: getFontSize(3),
    alignSelf: 'center',
    gap: getFontSize(2),
  },
  starVContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  starImage: {
    height: getFontSize(2),
    width: getFontSize(2),
  },
  titleText: {
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    color: Colors.white,
  },
  yearPlan: {
    padding: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: getFontSize(2),
  },
  yearText: {
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.6,
  },
  priceText: {
    fontSize: getFontSize(4),
    fontWeight: '600',
    color: Colors._C05600,
    // marginBottom: getFontSize(1),
    marginTop: getFontSize(0.5),
  },
  yearPriceText: {
    fontSize: getFontSize(2),
    fontWeight: '600',
    color: Colors.white,
  },
  bestValueView: {
    borderRadius: getFontSize(0.5),
  },
  bestValueText: {
    fontSize: getFontSize(1.6),
    fontWeight: '500',
    color: Colors.white,
    // padding: getFontSize(2),
    // paddingVertical: getFontSize(2.5),
    textAlign: 'center',
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: getFontSize(2),
    // marginVertical: getFontSize(2),
    marginTop: getFontSize(3),
    paddingHorizontal: getFontSize(2),
  },
  singlePlan: {
    borderWidth: 1,
    padding: getFontSize(2),
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(2),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // gap: getFontSize(0.5),
  },
  monthlyPlan: {
    borderWidth: 1,
    padding: getFontSize(2),
    borderColor: Colors.orange,
    borderRadius: getFontSize(2),
    backgroundColor: Colors.orangeOpacity2,
    flex: 1,
  },

  singleText: {
    fontSize: getFontSize(1.7),
    fontWeight: '400',
    color: Colors.white,
  },
  singlePriceText: {
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    color: Colors._C05600,
    marginBottom: getFontSize(0.5),
  },
  changeText: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    marginTop: getFontSize(3),
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
    justifyContent: 'center',
  },
  privacyText: {
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    color: Colors.white,
    marginTop: getFontSize(1),
    textAlign: 'center',
    opacity: 0.6,
    textDecorationLine: 'underline',
  },

  unlimitedView: {
    backgroundColor: Colors.whiteOpacity_10,
    borderRadius: getFontSize(2),
  },
  unlimitedAccessText: {
    fontSize: getFontSize(1.6),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: getFontSize(1),
  },
});
