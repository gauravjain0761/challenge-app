import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import ChallengeItem from '../ChallengeItem';
import {Images} from '@/assets/images';
import IconComponent from '../IconComponent';
import TodayEmptyChallenge from './TodayEmptyChallenge';
import {ChallengeMode} from '@/types';
import FastImage from 'react-native-fast-image';
import {CategoryFilter} from '@/types/enums';

type Props = {
  title: string;
  data: any[];
  isType?: ChallengeMode;
  isInfoShown?: boolean;
  onPressInfo?: () => void;
  category?: CategoryFilter;
};

const TodayChallengesView = ({
  title,
  data,
  isType,
  isInfoShown,
  onPressInfo,
  category,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderSectionHeader = () => (
    <TouchableOpacity
      style={styles.headerContainer}
      onPress={() => setIsOpen(!isOpen)}>
      <ImageBackground
        source={Images.badge_bg}
        resizeMode="contain"
        style={styles.badge}>
        <Text style={styles.levelTitle}>{title}</Text>
      </ImageBackground>
      <IconComponent
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={Colors.primary}
        type="Entypo"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}>
        {isInfoShown && (
          <TouchableOpacity onPress={onPressInfo}>
            <FastImage
              source={Images.info_Icon}
              resizeMode="contain"
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderChallenge = ({item, index}: {item: any; index: number}) => (
    <ChallengeItem
      key={index.toString()}
      item={item}
      todayChallenge={true}
      isProgressShow={true}
      isShowLockIcon={false}
      containerStyle={{
        width: getFontSize(45),
      }}
    />
  );

  return (
    <View>
      {renderSectionHeader()}

      {isOpen && (
        <View style={styles.section}>
          <FlatList
            data={data ?? []}
            horizontal
            renderItem={renderChallenge}
            keyExtractor={item => `${item._id}-scheduled`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.challengeList}
            ListEmptyComponent={
              <TodayEmptyChallenge isType={isType} category={category} />
            }
          />
        </View>
      )}
    </View>
  );
};

export default TodayChallengesView;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(1.5),
    gap: getFontSize(1),
  },
  badge: {
    height: getFontSize(4),
    width: getFontSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    color: 'white',
    fontSize: getFontSize(1.8),
    fontWeight: '600',
  },

  challengeList: {
    paddingHorizontal: getFontSize(2),
    gap: getFontSize(2),
  },
  section: {
    marginBottom: getFontSize(1),
  },
  image: {
    height: getFontSize(3),
    width: getFontSize(3),
  },
});
