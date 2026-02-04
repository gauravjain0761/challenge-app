import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Slot, usePathname, Link, useLocalSearchParams} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import HeaderSection from '@/components/myChallenges/HeaderSection';
import {useNavigation} from '@react-navigation/native';

// Memoized Tab Button
const TabButton = React.memo(
  ({
    label,
    isActive,
    href,
  }: {
    label: string;
    isActive: boolean;
    href: string;
  }) => {
    return (
      <Link href={href as any} asChild>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={[styles.tabText, isActive && styles.activeTab]}>
            {label}
          </Text>
        </TouchableOpacity>
      </Link>
    );
  },
);

// Navigation Component
const TabNavigation = React.memo(
  ({
    challengeId,
    encodedItem,
    isTab,
  }: {
    challengeId: string;
    encodedItem: any;
    isTab?: boolean;
  }) => {
    const pathname = usePathname();

    const tabs = useMemo(
      () => [
        {
          label: 'Progress',
          href: `/(modals)/(myChallenges)/(pastChallenges)/${challengeId}/progress`,
        },
        {
          label: 'Actions',
          href: `/(modals)/(myChallenges)/(pastChallenges)/${challengeId}/actions`,
        },
        {
          label: 'Info',
          href: `/(modals)/(myChallenges)/(pastChallenges)/${challengeId}/info`,
        },
      ],
      [challengeId],
    );

    return (
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => {
            return (
              <TabButton
                key={index.toString()}
                label={tab.label}
                href={tab.href}
                isActive={pathname.endsWith(
                  tab.href.split('/').pop() as string,
                )}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

export default function MyChallengeLayout() {
  const params = useLocalSearchParams<{
    id: string;
    challengeItem: string;
  }>();

  const navigation = useNavigation();

  const challengeId = params?.id as string;

  const challengeItem = useMemo(() => {
    try {
      return params.challengeItem
        ? JSON.parse(params.challengeItem as string)
        : {};
    } catch (e) {
      console.error('Error parsing challengeItem:', e);
      return {};
    }
  }, [params.challengeItem]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderSection
        image={challengeItem?.challengeImage || challengeItem.image}
        title={challengeItem?.challengeName || challengeItem.name}
        onBack={handleBack}
      />
      <View style={styles.innerContainer}>
        <TabNavigation challengeId={challengeId} encodedItem={params} />

        <View style={styles.contentContainer}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: getFontSize(25),
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    bottom: getFontSize(15),
    left: getFontSize(1.5),
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: getFontSize(2),
    left: getFontSize(1.5),
  },
  title: {
    fontSize: getFontSize(3),
    color: Colors.white,
    fontWeight: '600',
  },
  participants: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
  },
  innerContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.background,
    paddingVertical: getFontSize(1),
    height: getFontSize(5),
    marginLeft: getFontSize(1.5),
    marginTop: getFontSize(1),
    marginBottom: getFontSize(1),
  },
  tabButton: {
    marginRight: getFontSize(4),
  },
  tabText: {
    fontSize: getFontSize(2),
    color: Colors.inactiveTabColor,
    fontWeight: '500',
  },
  activeTab: {
    color: Colors.white,
  },
  contentContainer: {
    flex: 2,
    padding: getFontSize(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.5),
  },
});
