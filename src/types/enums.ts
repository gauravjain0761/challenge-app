export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  TIMER = 'timer',
  JOURNAL = 'journal',
  BREATHWORK = 'breathwork',
}

export enum CategoryFilter {
  ALL = 'all',
  MIND = 'mindset',
  FITNESS = 'fitness',
  NUTRITION = 'nutrition',
  MONEY = 'money',
  RELATIONSHIPS = 'relationships',
  PRODUCTIVITY = 'productivity',
  DISCIPLINE = 'discipline',
  AI = 'ai',
}

export const progressCategories = [
  {category: CategoryFilter.DISCIPLINE},
  {category: CategoryFilter.FITNESS},
  {category: CategoryFilter.MIND},
  {category: CategoryFilter.NUTRITION},
  {category: CategoryFilter.AI},
  {category: CategoryFilter.RELATIONSHIPS},
  {category: CategoryFilter.MONEY},
  {category: CategoryFilter.PRODUCTIVITY},
];

export enum JournalQuestionType {
  TEXT = 'text',
  CHOICE = 'choice',
  RATING = 'rating',
}

export enum ActionType {
  SINGLE = 'single_asset',
  MULTIPLE = 'multiple_assets',
  NO_ASSET = 'no_asset',
}

export enum ContentSection {
  WHAT = 'what',
  WHY = 'why',
  HOW = 'how',
}

// Challenge enums
export enum ChallengeType {
  SINGLE = 'single_action',
  SINGLE_VARIANT = 'single_variation_action',
  SINGLE_MAXOUT = 'single_maxout_action',
  SINGLE_MAXOUT_VARIANT = 'single_maxout_variation_action',
  MULTIPLE = 'multiple_actions',
  MULTIPLE_VARIANT = 'multiple_variation_actions',
  MULTIPLE_MAXOUT = 'multiple_maxout_actions',
  MULTIPLE_MAXOUT_VARIANT = 'multiple_maxout_variantion_actions',
}

export enum ChallengeTypeTow {
  SINGLE = 'single_action',
  SINGLE_VARIANT = 'single_action_variation',
  SINGLE_MAXOUT = 'single_action_maxout',
  SINGLE_MAXOUT_VARIANT = 'single_action_maxout_variation',
  MULTIPLE = 'multiple_actions',
  MULTIPLE_VARIANT = 'multiple_actions_variation',
  MULTIPLE_MAXOUT = 'multiple_actions_maxout',
  MULTIPLE_MAXOUT_VARIANT = 'multiple_actions_maxout_variation',
}

export enum ChallengeVariantType {
  SINGLE_VARIANT = 'single_action_mix',
  MULTIPLE_VARIANT = 'multiple_actions_mix',
  SINGLE_MAXOUT_VARIANT = 'single_action_maxout_mix',
  MULTIPLE_MAXOUT_VARIANT = 'multiple_actions_maxout_mix',
}

export const singleTypes = [
  ChallengeType.SINGLE,
  ChallengeType.SINGLE_VARIANT,
  ChallengeType.SINGLE_MAXOUT,
  ChallengeType.SINGLE_MAXOUT_VARIANT,
];

export const multipleTypes = [
  ChallengeType.MULTIPLE,
  ChallengeType.MULTIPLE_VARIANT,
  ChallengeType.MULTIPLE_MAXOUT,
  ChallengeType.MULTIPLE_MAXOUT_VARIANT,
];

export const maxoutTypes = [
  ChallengeType.SINGLE_MAXOUT,
  ChallengeType.SINGLE_MAXOUT_VARIANT,
  ChallengeType.MULTIPLE_MAXOUT,
  ChallengeType.MULTIPLE_MAXOUT_VARIANT,
];

export const variationTypes = [
  ChallengeType.SINGLE_VARIANT,
  ChallengeType.MULTIPLE_VARIANT,
  ChallengeType.SINGLE_MAXOUT_VARIANT,
  ChallengeType.MULTIPLE_MAXOUT_VARIANT,
];

export enum ChallengeMode {
  GROUP = 'group',
  PERSONAL = 'personal',
  WORLDWIDE = 'worldwide',
}

export enum ChallengeAccessType {
  PREMIUM = 'premium',
  FREE = 'free',
}

export enum PublicationStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

// Explore Challenge user type
export enum ExploreChallengeUserType {
  ALL = 'all',
  SINGLE = 'single_action',
  MULTIPLE = 'multi_action',
  MAXOUT = 'maxout',
  VARIANT = 'mix',
}

export enum ExploreChallengeLabel {
  ALL = 'All',
  MULTIPLE = 'Multi-Action',
  SINGLE = 'Single-Action',
  MAXOUT = 'Maxout',
  VARIANT = 'Mix',
}

export enum ChallengeStatus {
  ACTIVE = 'active',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  FAILED = 'failed',
  LEFT = 'left',
  PENDING = 'pending',
}

export enum ActionStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  PENDING = 'pending',
}

export enum DayStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  PENDING = 'pending',
}

export enum FriendStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  LEFT = 'left',
}

export enum ChallengeLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
  MASTER = 'Master',
  BEAST = 'Beast',
  LEGEND = 'Legend',
}

export const DEFAULT_MULTIPLE_LEVELS = [
  {
    name: 'Beginner',
    goal: {value: 1, unit: 'Daily Action', frequency: 'daily'},
  },
  {
    name: 'Intermediate',
    goal: {value: 2, unit: 'Daily Actions', frequency: 'daily'},
  },
  {
    name: 'Advanced',
    goal: {value: 3, unit: 'Daily Actions', frequency: 'daily'},
  },
  {
    name: 'Expert',
    goal: {value: 4, unit: 'Daily Actions', frequency: 'daily'},
  },
  {
    name: 'Master',
    goal: {value: 5, unit: 'Daily Actions', frequency: 'daily'},
  },
  {
    name: 'Beast',
    goal: {value: 6, unit: 'Daily Actions', frequency: 'daily'},
  },
  {
    name: 'Legend',
    goal: {value: 7, unit: 'Daily Actions', frequency: 'daily'},
  },
];

export const UnitsOptions = {
  TIME: 'time',
  TIMES: 'times',
  MINUTES: 'minutes',
  HOURS: 'hours',
  MILES: 'miles',
  KILOMETERS: 'kilometers',
  KILOGRAMS: 'kilograms',
  GRAMS: 'grams',
  LITERS: 'liters',
  CUPS: 'cups',
  KCALS: 'kcals',
  JOULES: 'joules',
  STEPS: 'steps',
  REPS: 'reps',
  AM: 'am',
  PM: 'pm',
} as const;

export enum BreathWorkPhase {
  INHALE = 'inhale',
  HOLD = 'hold',
  EXHALE = 'exhale',
}

export enum Tabs {
  Metrics = 'Metrics',
  MaxOut = 'MaxOut',
  Leaderboard = 'Leaderboard',
}

export const ProgressTabs = ['Metrics', 'MaxOut', 'Leaderboard'];

export interface ProfileListProps {
  _id: number;
  title: string;
  list: {
    _id: number;
    title: string;
    isArrow: boolean;
    isIcon?: boolean;
  }[];
}

export const enum ProfileListTypes {
  Settings = 'Settings',
  Challenges = 'Challenges',
  App = 'App',
  Profile_Settings = 'Profile settings',
  Notifications = 'Notifications',
  Manage_Challenges = 'Manage Challenges',
  Friends = 'Friends',
  Friend_Request = 'Friends Request',
  // Share_App = 'Share app',
  Leave_Review = 'Leave review on App Store',
  Help = 'Help and Support',
  Feedback_Roadmap = 'Feedback and Roadmap',
  Privacy = 'Privacy and Policy',
  Terms = 'Terms and Conditions',
  Logout = 'Logout',
  Close_Account = 'Close account',
  Account = 'Account',
  Security_Settings = 'Security Settings',
  Face_ID = 'Enable Face ID',
  Passcode = 'Add passcode',
  Signin_methods = 'Sign-in methods',
  Sign_in = 'Sign-in',
  MANAGE_SUBSCRIPTION = 'Manage Subscription',
}

export const profileList: ProfileListProps[] = [
  {
    _id: 1,
    title: ProfileListTypes.Settings,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Profile_Settings,
        isArrow: true,
        isIcon: true,
      },
      {
        _id: 2,
        title: ProfileListTypes.Notifications,
        isArrow: true,
        isIcon: true,
      },
      {
        _id: 3,
        title: ProfileListTypes.MANAGE_SUBSCRIPTION,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
  {
    _id: 2,
    title: ProfileListTypes.Challenges,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Manage_Challenges,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
  {
    _id: 5,
    title: ProfileListTypes.Friends,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Friend_Request,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
  {
    _id: 3,
    title: ProfileListTypes.App,
    list: [
      // {
      //   _id: 1,
      //   title: ProfileListTypes.Share_App,
      //   isArrow: true,
      //   isIcon: true,
      // },
      // {
      //   _id: 2,
      //   title: ProfileListTypes.Leave_Review,
      //   isArrow: true,
      //   isIcon: true,
      // },
      {
        _id: 3,
        title: ProfileListTypes.Feedback_Roadmap,
        isArrow: true,
        isIcon: true,
      },
      {
        _id: 4,
        title: ProfileListTypes.Help,
        isArrow: true,
        isIcon: true,
      },
      {
        _id: 5,
        title: ProfileListTypes.Privacy,
        isArrow: true,
        isIcon: true,
      },
      {
        _id: 6,
        title: ProfileListTypes.Terms,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
  {
    _id: 4,
    title: ProfileListTypes.Account,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Logout,
        isArrow: true,
        isIcon: false,
      },
      {
        _id: 2,
        title: ProfileListTypes.Close_Account,
        isArrow: true,
        isIcon: false,
      },
    ],
  },
];

export interface helpListProps {
  _id: number;
  title: string;
  dec: string;
  url?: string;
}

export const helpList: helpListProps[] = [
  {
    _id: 1,
    title: 'Get Started',
    dec: 'Learn the basics to make the most of Mentools.',
  },
  // {
  //   _id: 2,
  //   title: 'Guides & Tutorials',
  //   dec: 'Step-by-step guides to help you navigate Mentools like a pro.',
  // },
  {
    _id: 3,
    title: 'Subscription & Billing',
    dec: 'Learn about subscription plans, billing issues, and refunds.',
    url: 'https://support.mentoolschallenges.co/collections/9466883-subscriptions-and-payments',
  },
  {
    _id: 4,
    title: 'Technical Issues',
    dec: 'Troubleshoot app errors and get solutions quickly.',
    url: 'https://support.mentoolschallenges.co/collections/3157021-technical-support',
  },
];

export const profileSettingList: ProfileListProps[] = [
  {
    _id: 1,
    title: ProfileListTypes.Security_Settings,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Face_ID,
        isArrow: false,
        isIcon: true,
      },
      {
        _id: 2,
        title: ProfileListTypes.Passcode,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
  {
    _id: 1,
    title: ProfileListTypes.Signin_methods,
    list: [
      {
        _id: 1,
        title: ProfileListTypes.Sign_in,
        isArrow: true,
        isIcon: true,
      },
    ],
  },
];

export enum NotificationType {
  // Friend System
  FRIEND_INVITE = 'friend_invite',
  FRIEND_ACCEPT = 'friend_accept',
  FRIEND_DECLINE = 'friend_decline',
  FRIEND_CHALLENGE_COMPLETE = 'friend_challenge_complete',
  FRIEND_NUDGE = 'friend_nudge',

  // Challenge Progress
  CHALLENGE_STARTED = 'challenge_started',
  CHALLENGE_REMINDER = 'challenge_reminder',
  CHALLENGE_DEADLINE = 'challenge_deadline',
  CHALLENGE_COMPLETED = 'challenge_completed',
  CHALLENGE_DAY_FAILED = 'challenge_day_failed',

  // System
  DAILY_REMINDER = 'daily_reminder',
  WEEKLY_SUMMARY = 'weekly_summary',
  STREAK_REMINDER = 'streak_reminder',

  // Admin

  ADMIN_CHALLENGE_LIVE = 'admin_challenge_live',
}

export enum DevicePlatform {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
}

export enum AsyncTypes {
  EXPLORE = 'EXPLORE',
  TODAY = 'TODAY',
  SEE_ALL = 'SEE_ALL',
  EXPLORE_INFO = 'EXPLORE_INFO',
  IN_PROGRESS = 'IN_PROGRESS',
  FROM_NOTIFICATION = 'FROM_NOTIFICATION',
  ONBOARDING_COMPLETED = 'onboardingCompleted',
  CREDENTIALS = 'credentials',
  PENDING_BRANCH_LINK = 'pendingBranchLink',
  PENDING_BRANCH_LINK_FOR_INFO = 'pendingBranchLinkForInfo',
  HANDLED_BRANCH_ON_COLD_START = 'handledBranchOnColdStart',
  SUBSCRIPTION_CUSTOMER_INFO = 'subscriptionCustomerInfo',
  SUBSCRIBE_CHALLENGE_INFO = 'subscribeChallengeInfo',

  COMPULSORY_ACTION_NOTICE = 'compulsoryActionNotice',
  COMPULSORY_ACTION_HOW = 'compulsoryActionHow',
  GUEST_PAYWALL_SHOWN = 'guestPaywallShown',
}

export enum ONBOARDING_STEPS {
  PERSONALISED_EXPERIENCE = 'Personalised Experience',
  JUST_TAKE_ACTION = 'Just Take Action',
  // UNSURE = 'Unsure?',
}

export enum UNSURE_STEPS {
  PERSONALISED_EXPERIENCE = 'Personalised Experience',
  TAKE_ACTION_NOW = 'Take Action Now',
  LOOK_AROUND = 'Look Around',
}
export enum PERSONAL_EXP_STEPS {
  FITNESS = 'fitness',
  MINDSET = 'mindset',
  MONEY = 'money',
  NUTRITION = 'nutrition',
  RELATIONSHIPS = 'relationships',
  PRODUCTIVITY = 'productivity',
}

export enum AGE {
  AGE1 = '18-25',
  AGE2 = '25-30',
  AGE3 = '30-40',
  AGE4 = '40+',
}

export enum RATE_YOUR_LIFE {
  TOP = 'Top of the world',
  WIN = 'Winning',
  CHILLED = 'Chilled',
  GETTING_BY = 'Getting by',
  NEED_TO_CHANGE = 'Need to change',
  LOST = 'Lost',
}

export enum PERSONAL_EXP_STEPS_2 {
  STEP1 = 'Porn',
  STEP2 = 'Sugar',
  STEP3 = 'Alcohol',
  STEP4 = 'Social Media',
  STEP5 = 'Video Games',
  STEP6 = 'Caffeine',
}

export enum PERSONAL_EXP_STEPS_3 {
  STEP1 = 'I want to do challenges alone',
  STEP2 = 'I want to compete with my friends',
  STEP3 = 'I want to test myself against the best',
}
export enum PERSONAL_EXP_STEPS_5 {
  SELF_RESPECT = 'Self Respect',
  SELF_MASTERY = 'Self Mastery',
  FREEDOM = 'Freedom',
  LEGACY = 'Legacy',
}

export enum SUBSCRIPTION_PLAN {
  ONE_LIFETIME = 'one_lifetime_challenge',
  PREMIUM_MONTHLY = 'premium_challenges',
  PREMIUM_YEARLY = 'premium_challenges_yearly',
  PREMIUM_7DAYS = 'premium_challenges_7days',
}

export enum RATING_TYPE {
  PRE = 'pre',
  POST = 'post',
}

export enum ROLE {
  MEMBER = 'member',
  ADMIN = 'admin',
}

export enum MIX_PANEL_EVENTS {
  user_registered = 'user_registered',
  onboarding_started = 'onboarding_started',
  onboarding_finished = 'onboarding_finished',
  paywall_shown = 'paywall_shown',
  challenge_browsed = 'challenge_browsed',
  challenge_joined = 'challenge_joined',
  progress_viewed = 'progress_viewed',
  action_status = 'action_status',
  goal_hit = 'goal_hit',
  reminder_set = 'reminder_set',
  finish_day = 'finish_day',
  day_feedback = 'day_feedback',
  subscription_started = 'subscription_started',
  manage_subscription = 'manage_subscription',
  feedback_and_roadmap = 'feedback_and_roadmap',
  challenge_shared_image = 'challenge_shared_image',
  challenge_invite_sent = 'challenge_invite_sent',
}

// FITNESS
export enum FITNESS_EXP_STEPS_1 {
  STEP1 = 'Strength',
  STEP2 = 'Endurance',
  STEP3 = 'Cardio',
  STEP4 = 'Speed',
  STEP5 = 'Flexibility',
  STEP6 = 'Power',
}
export enum FITNESS_EXP_STEPS_2 {
  STEP1 = 'Peak Performance',
  STEP2 = 'Thriving',
  STEP3 = 'Balanced',
  STEP4 = 'Maintaining',
  STEP5 = 'Reboot Needed',
  STEP6 = 'Stuck',
}
export enum FITNESS_EXP_STEPS_3 {
  STEP1 = 'Porn',
  STEP2 = 'Sugar',
  STEP3 = 'Alcohol',
  STEP4 = 'Social Media',
  STEP5 = 'Video Games',
  STEP6 = 'Caffeine',
}

// ALCOHOL
export enum ALCOHOL_EXP_STEPS_1 {
  STEP1 = 'Drinking Less',
  STEP2 = 'Quit Alcohol',
  STEP3 = 'After Work Drinks',
  STEP4 = 'Drinking to Sleep',
  STEP5 = 'Heavy Sessions',
  STEP6 = 'Solo Drinking at Home',
}
export enum ALCOHOL_EXP_STEPS_2 {
  STEP1 = 'Tee-Total (Don’t Drink)',
  STEP2 = 'Social Drinker',
  STEP3 = 'Mindful With Drink',
  STEP4 = 'Occasional Binge',
  STEP5 = 'Regular Overdoing It',
  STEP6 = 'Out of Control',
}

// MINDSET
export enum MINDSET_EXP_STEPS_1 {
  STEP1 = 'Focus',
  STEP2 = 'Confidence',
  STEP3 = 'Gratitude',
  STEP4 = 'Motivation',
  STEP5 = 'Calmness',
  STEP6 = 'Self-Belief',
}
export enum MINDSET_EXP_STEPS_2 {
  STEP1 = 'Growth',
  STEP2 = 'Positive',
  STEP3 = 'Resilient',
  STEP4 = 'Fixed',
  STEP5 = 'Struggling',
  STEP6 = 'Weak',
}

// MONY
export enum MONEY_EXP_STEPS_1 {
  STEP1 = 'Saving More',
  STEP2 = 'Reducing Debt',
  STEP3 = 'Managing Expenses',
  STEP4 = 'Budgeting',
  STEP5 = 'Improve Credit Score',
  STEP6 = 'Investing',
}

export enum MONEY_EXP_STEPS_2 {
  STEP1 = 'Financial Freedom',
  STEP2 = 'Secure',
  STEP3 = 'Mindful Spending',
  STEP4 = 'Impulse Purchases',
  STEP5 = 'No Control',
  STEP6 = 'Overspending',
}

export enum MONEY_EXP_STEPS_3 {
  STEP1 = 'Credit Card Debt',
  STEP2 = 'Impulse Buying',
  STEP3 = 'Gambling',
  STEP4 = 'Payday Loans',
  STEP5 = 'Subscriptions',
  STEP6 = 'Interest',
}

// NUTRITION
export enum NUTRITION_EXP_STEPS_1 {
  STEP1 = 'Gut Health',
  STEP2 = 'Sugar Reduction',
  STEP3 = 'Fat Loss',
  STEP4 = 'Energy Levels',
  STEP5 = 'Weight Gain',
  STEP6 = 'Snacking',
}

export enum NUTRITION_EXP_STEPS_2 {
  STEP1 = 'Optimal Choices',
  STEP2 = 'Balanced',
  STEP3 = 'Mindful',
  STEP4 = 'Occasional Snacking',
  STEP5 = 'No balance',
  STEP6 = 'Overindulging',
}

export enum NUTRITION_EXP_STEPS_3 {
  STEP1 = 'Chocolate',
  STEP2 = 'Crisps',
  STEP3 = 'Chips',
  STEP4 = 'Takeaways',
  STEP5 = 'Fizzy Drinks',
  STEP6 = 'Sweets',
}

// RELATIONSHIPS
export enum RELATIONSHIPS_EXP_STEPS_1 {
  STEP1 = 'Communication',
  STEP2 = 'Trust',
  STEP3 = 'Quality Time',
  STEP4 = 'Conflict Resolution',
  STEP5 = 'Intimacy',
  STEP6 = 'Appreciation & Gratitude',
}

export enum RELATIONSHIPS_EXP_STEPS_2 {
  STEP1 = 'Solid Bond',
  STEP2 = 'Good Place',
  STEP3 = 'Mutual Understanding',
  STEP4 = 'Drifting',
  STEP5 = 'On the Rocks',
  STEP6 = 'No Way Back',
}
export enum RELATIONSHIPS_EXP_STEPS_3 {
  STEP1 = 'Arguments',
  STEP2 = 'Kids Not Listening',
  STEP3 = 'Silent Treatment',
  STEP4 = 'Friendship Drift',
  STEP5 = 'Work Tension',
  STEP6 = 'Nagging Missus',
}
