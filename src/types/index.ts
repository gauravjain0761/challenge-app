import {ImageSourcePropType} from 'react-native';
import {ActionStatus} from './enums';
import {ReactElement} from 'react';

export type TitleFilter =
  | 'ALL'
  | 'Prize'
  | 'Hybrid'
  | 'Mind'
  | 'Body'
  | 'Nutrition'
  | 'Money'
  | 'Business'
  | 'Relationships';
export type Title = string;
export type Icon = Boolean;
export type ChallengeType =
  | 'ALL'
  | 'Single Action'
  | 'Multiple Action'
  | 'Variation Action';

// BreathWork
export type Phase = 'inhale' | 'hold' | 'exhale';

export interface Challenge {
  id: string;
  title: string;
  participants: string;
  challenge?: string;
  mode?: string;
  type?: string;
  image: ImageSourcePropType; // Use ImageSourcePropType for React Native images
  isLive?: boolean;
  goesLiveDate?: string;
  progress?: string;
  category?: string;
  info: object;
  whatWhyHow: object;
  actions?: object;
}

export interface ChallengeCategory {
  category: string;
  challenges: {
    [level: string]: Challenge[]; // Levels like Beginner, Intermediate, etc.
  };
}

export interface ChallengeInfo {
  id: string;
  title: string;
  participants: string;
  mode: string;
  type: string;
  image: any; // Use ImageSourcePropType for React Native images
  isLive?: boolean;
  goesLiveDate?: string;
  category?: string;
  progress?: string;
}
export interface ChallengeCategoryInfo {
  category: string;
  challenges: {
    [level: string]: ChallengeInfo[]; // Levels like Beginner, Intermediate, etc.
  };
}

export type ChallengeLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'
  | 'Master'
  | 'Beast'
  | 'Legend';

export type ChallengeMode = 'Group' | 'Personal' | 'Worldwide';

export interface Task {
  id: string;
  title: string;
  timeOfDay: string;
  duration: string;
  image: ImageSourcePropType;
  isCompleted: boolean;
  isChallenge?: boolean;
  challengeDay?: string;
  category: string;
  type?: string;
  level?: ChallengeLevel;
}

export interface ActionItem {
  status?: string;
  compulsory: boolean;
  quickChallengeId?: string;
  actionId?: string;
  challengeName?: string;
  overrides: {
    goal: {
      value: number;
      unit: string;
      frequency: string;
      _useOverride: boolean;
    };
    timeOfDay: {
      time: string;
      _useOverride: boolean;
    };
  };
  selectedCompletionCount: number | null;
  selectedCompletionUnit: string | null;
  selectedLevelIndex: number | null;
  completedLevelIndex: number | null;
  completionCount: number | null;
  action: {
    _id: string;
    name: string;
    type: string;
    image: string;
    status?: string;
    basicRules: {
      goal: {
        value: number;
        unit: string;
        frequency: string;
      };
      timeOfDay: string;
    };
  };
  bestCount: number | null;
  bestUnit: string;
  quickChallenge?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface LevelsItem {
  name: string;
  goal: {
    value: number;
    unit: string;
    frequency: string;
  };
}

export interface Goal {
  value: number;
  unit: string;
  frequency: string;
}

export interface TaskGroup {
  title: string;
  data: Task[];
}

export interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'pending' | 'completed' | 'failed';
  streak?: number;
  hideStreak?: boolean;
  onPressSave?: () => void;
  onSelectCheck?: (value: boolean) => void;
}

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  isBackShow?: boolean;
  isCloseShow?: boolean;
  rightIcon?: ReactElement;
}

export interface DurationsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDuration: string;
  onSelectDuration: (duration: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  reminderList?: any[];
  onUpdateReminders?: (newReminders: any[]) => void;
  onRemoveReminder?: (reminderTime: string) => void;
  error?: string | null;
  setError?: (error: string | null) => void;
  isSuccess?: boolean;
}

export interface Levels {
  goal: {
    frequency: string;
    unit: string;
    value: number;
  };
  name: string;
}

export interface LevelModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLevel: string;
  onSelectLevel: (option: string) => void;
  levels?: Levels[] | undefined;
  challengeType?: string;
}
export interface FailsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFail: any;
  onSelectFails: (option: any) => void;
}

export interface TimeReminder {
  id: string;
  time: string;
}

export interface LeaderboardUser {
  id: number;
  name: string;
  level: string;
  done: number;
  fails: number;
  skips: number;
  streak: number;
  isFriend?: boolean;
}

export interface ActionPerDay {
  day: number;
  totalAction: number;
  completedAction: number;
}

export interface Files {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

export interface WWHContent {
  details: string;
  files: Files[];
}
export interface WhyContent {
  items: {
    title: string;
    details: string;
    files: Files[];
  }[];
}
export interface HowContent {
  steps: {
    title: string;
    files: Files[];
  }[];
  disclaimer: string;
}

export interface ChallengeInfoResponse {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  type: string;
  mode: string;
  display_type: string;
  basicRules: {
    startDate: string;
    endDate: string;
    daysToFail: number;
    skipAllowance: number;
  };
  what: WWHContent;
  why: WhyContent;
  how: HowContent;
}

export interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  videoUrl: string;
}

export interface UserProfile {
  createdAt: string;
  email: string;
  id: string;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isFirstTimeUser: boolean;
  name: string;
  provider: string;
  role: string;
  updatedAt: string;
}
