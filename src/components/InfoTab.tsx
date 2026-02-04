import React, {useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {Colors} from '@/constants/Colors';
import {formatDate, getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import DurationsModal from './DurationsModal';
import ReminderModal from './ReminderModal';
import LevelModal from './LevelModal';
import IconComponent from './IconComponent';
import {GetChallengeInfoResponse} from '@/validation/schemas';
import {GeneralStyle} from '@/constants/GeneralStyle';

interface Rule {
  duration?: string;
  actions?: string;
  type?: string;
  time?: string;
  timeOfDay?: string;
  mode?: string;
}

interface InfoProps {
  // description: string;
  // rules: Rule[];
  // levels?: any[];
}

interface WhatWhyHow {
  what: {
    details: string;
    files: object;
  };
  why: {
    details: string;
    files: object;
  };
  how: {
    details: string;
    files: object;
  };
}

interface InfoTabProps {
  data: GetChallengeInfoResponse;
  whatWhyHow: WhatWhyHow;
  myChallenge?: boolean;
}

interface ButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

// Memoized helper functions
const getIconNameForRule = (rule: Rule): string => {
  if (rule.duration) return 'reload';
  if (rule.actions) return 'clock-outline';
  if (rule.time) return 'calendar';
  if (rule.timeOfDay) return 'white-balance-sunny';
  if (rule.mode) return rule.mode === 'Personal' ? 'account' : 'account-group';
  return 'information';
};

const getRuleText = (rule: Rule): string => {
  return (
    rule.duration ||
    rule.actions ||
    rule.time ||
    rule.timeOfDay ||
    rule.mode ||
    ''
  );
};

// Memoized Components
const RuleItem = memo(({rule}: {rule: Rule}) =>
  getRuleText(rule) ? (
    <View style={styles.ruleItem}>
      <IconComponent
        type="MaterialCommunityIcons"
        name={getIconNameForRule(rule)}
        size={getFontSize(2.2)}
        color={Colors.white}
      />
      <Text style={styles.ruleText}>
        {rule.mode ? getRuleText(rule) + ' Challenge' : getRuleText(rule)}
      </Text>
    </View>
  ) : null,
);

const WhatWhyHowCard = memo(
  ({title, content}: {title: string; content: string}) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{content}</Text>
    </View>
  ),
);

const CustomButton = memo(({icon, title, subtitle, onPress}: ButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.buttonContent}>
      <View style={styles.buttonLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>{title}</Text>
          <Text style={styles.buttonSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <IconComponent
        name="right"
        size={getFontSize(2.5)}
        color={Colors.white}
      />
    </View>
  </TouchableOpacity>
));

const CompeteFriends = memo(() => {
  const imageSource =
    require('../assets/images/bellyBreathing.png') as ImageSourcePropType;

  return (
    <View style={styles.competeContainer}>
      <View style={styles.avatarsContainer}>
        {[8, 4, 2].map((count, index) => (
          <View key={index} style={styles.avatarWrapper}>
            <Image source={imageSource} style={styles.avatar} />
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.competeTitle}>Compete with friends</Text>
      <Text style={styles.competeSubtext}>
        Challenge your friends, compete and build good habits together!
      </Text>
      <Button
        title="Invite friends"
        style={styles.inviteButton}
        textStyle={styles.inviteButtonText}
        leftIcon={
          <IconComponent
            name="addusergroup"
            size={getFontSize(3)}
            color={Colors.white}
          />
        }
      />
    </View>
  );
});

const InfoTab: React.FC<InfoTabProps> = ({data, whatWhyHow, myChallenge}) => {
  // Combined state for better performance
  console.log('myChallenge', whatWhyHow);
  const [state, setState] = useState({
    isRulesOpen: true,
    isWhatWhyHowOpen: true,
    durationsVisible: false,
    reminderVisible: false,
    levelVisible: false,
    selectedDuration: 7,
    selectedDate: new Date().toISOString(),
    selectedLevel: 'Select your level',
  });

  // Memoized state update function
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({...prev, ...updates}));
  }, []);

  // Memoized section toggle function
  const toggleSection = useCallback((section: 'rules' | 'whatWhyHow') => {
    setState(prev => ({
      ...prev,
      [section === 'rules' ? 'isRulesOpen' : 'isWhatWhyHowOpen']:
        !prev[section === 'rules' ? 'isRulesOpen' : 'isWhatWhyHowOpen'],
    }));
  }, []);

  // Memoized render functions
  const renderButtons = useCallback(
    () => (
      <>
        <CustomButton
          icon={
            <IconComponent
              name="chess-pawn"
              size={getFontSize(2.5)}
              color={Colors.white}
              type="MaterialCommunityIcons"
            />
          }
          title="Goal"
          subtitle={state.selectedLevel}
          onPress={() => updateState({levelVisible: true})}
          // levels={data?.levels}
        />
        <CustomButton
          icon={
            <IconComponent
              name="arrowright"
              size={getFontSize(3)}
              color={Colors.white}
              type="AntDesign"
            />
          }
          title="Start Date"
          subtitle={`${formatDate(state.selectedDate)} (${
            state.selectedDuration
          } ${state.selectedDuration > 1 ? 'days' : 'day'})`}
          onPress={() => updateState({durationsVisible: true})}
        />
        {/* <CustomButton
          icon={
            <IconComponent
              name="notifications-active"
              size={getFontSize(2.5)}
              color={Colors.white}
              type="MaterialIcons"
            />
          }
          title="Reminder"
          subtitle="Set a reminder"
          onPress={() => updateState({reminderVisible: true})}
        /> */}
      </>
    ),
    [
      state.selectedLevel,
      state.selectedDate,
      state.selectedDuration,
      updateState,
    ],
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}>
      <Text style={styles.description}>{data.description}</Text>

      <TouchableOpacity
        onPress={() => toggleSection('rules')}
        style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Basic rules</Text>
        <IconComponent
          name={state.isRulesOpen ? 'up' : 'down'}
          size={getFontSize(2)}
          color={Colors.orange}
          type="AntDesign"
        />
      </TouchableOpacity>

      {state.isRulesOpen && (
        <View style={styles.rulesContainer}>
          {data.rules?.map((rule: any, index: any) => (
            <RuleItem key={index} rule={rule} />
          ))}
        </View>
      )}

      {data.rules?.some(rule => rule.mode === 'Personal') ? (
        renderButtons()
      ) : (
        <CustomButton
          icon={
            <IconComponent
              type="MaterialCommunityIcons"
              name="chess-pawn"
              size={getFontSize(2.5)}
              color={Colors.white}
            />
          }
          title="Goal"
          subtitle={state.selectedLevel}
          onPress={() => updateState({levelVisible: true})}
          // levels={data?.levels}
        />
      )}

      <DurationsModal
        visible={state.durationsVisible}
        onClose={() => updateState({durationsVisible: false})}
        selectedDuration={state.selectedDuration}
        onSelectDuration={duration => updateState({selectedDuration: duration})}
        selectedDate={state.selectedDate}
        onSelectDate={date => updateState({selectedDate: date})}
      />

      <ReminderModal
        visible={state.reminderVisible}
        onClose={() => updateState({reminderVisible: false})}
      />

      <LevelModal
        visible={state.levelVisible}
        onClose={() => updateState({levelVisible: false})}
        selectedSkip={state.selectedLevel}
        onSelectSkip={skip => updateState({selectedLevel: skip})}
        levels={data?.levels}
      />

      <TouchableOpacity
        onPress={() => toggleSection('whatWhyHow')}
        style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What Why How</Text>
        <IconComponent
          type="AntDesign"
          name={state.isWhatWhyHowOpen ? 'up' : 'down'}
          size={getFontSize(2)}
          color={Colors.orange}
        />
      </TouchableOpacity>

      {state.isWhatWhyHowOpen && (
        <View style={GeneralStyle.whatWhyHowContainer}>
          <WhatWhyHowCard
            title="WHAT"
            content={whatWhyHow?.what?.details || ''}
          />
          <WhatWhyHowCard
            title="WHY"
            content={whatWhyHow?.why?.details || ''}
          />
          <WhatWhyHowCard
            title="HOW"
            content={whatWhyHow?.how?.details || ''}
          />
        </View>
      )}
      <CompeteFriends />
      {myChallenge && (
        <Button
          title={'Leave this Challenge'}
          textStyle={{
            color: Colors.white,
          }}
          style={styles.joinButton}
          onPress={() => console.log('Join pressed')}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    marginBottom: getFontSize(2),
    lineHeight: getFontSize(2.4),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getFontSize(1.5),
  },
  sectionTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '600',
    marginRight: getFontSize(1),
  },
  rulesContainer: {
    marginTop: getFontSize(1),
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getFontSize(2),
  },
  ruleText: {
    fontSize: getFontSize(1.7),
    color: Colors.white,
    marginLeft: getFontSize(1.5),
  },
  button: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    height: getFontSize(8),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    height: getFontSize(5),
    width: getFontSize(5),
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    marginLeft: getFontSize(1),
  },
  buttonTitle: {
    color: 'rgba(255, 255, 255, 0.60)',
    fontSize: getFontSize(1.8),
  },
  buttonSubtitle: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    marginTop: getFontSize(0.3),
  },
  whatWhyHowContainer: {
    marginTop: getFontSize(1),
  },
  card: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
  },
  cardTitle: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '500',
    marginBottom: getFontSize(0.5),
  },
  cardContent: {
    fontSize: getFontSize(1.6),
    color: 'rgba(255, 255, 255, 0.5)',
  },
  competeContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    alignItems: 'center',
    marginTop: getFontSize(2),
    borderColor: Colors.borderColor,
    borderWidth: getFontSize(0.08),
  },
  avatarsContainer: {
    flexDirection: 'row',
    marginBottom: getFontSize(2),
  },
  avatarWrapper: {
    marginHorizontal: getFontSize(0.5),
    position: 'relative',
  },
  avatar: {
    width: getFontSize(5),
    height: getFontSize(5),
    borderRadius: getFontSize(2.5),
  },
  countBadge: {
    position: 'absolute',
    bottom: -5,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: getFontSize(1),
    paddingHorizontal: getFontSize(0.5),
  },
  countText: {
    color: Colors.orange,
    fontSize: getFontSize(1.8),
  },
  competeTitle: {
    fontSize: getFontSize(2.1),
    color: Colors.white,
    fontWeight: '600',
    marginBottom: getFontSize(1),
  },
  competeSubtext: {
    fontSize: getFontSize(1.6),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: getFontSize(2),
  },
  inviteButton: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingHorizontal: getFontSize(2),
  },
  inviteButtonText: {
    color: Colors.white,
    marginLeft: getFontSize(1),
  },
  joinButton: {
    width: '99%',
    backgroundColor: 'transparent',
    borderColor: Colors.red,
  },
});

export default memo(InfoTab);
