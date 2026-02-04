import {ChallengeLevel} from '@/types';
import React from 'react';
import {
  StatusBar,
  PixelRatio,
  Dimensions,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {MaterialCommunityIcons as IconType} from '@expo/vector-icons';
import {CategoryFilter} from '@/types/enums';

const {height, width} = Dimensions.get('window');

export const SCREEN_HEIGHT = height;
export const SCREEN_WIDTH = width;
export function isIphoneX() {
  return Platform.OS === 'ios' && DeviceInfo.hasNotch();
}

export function getHeight(h: string | number) {
  const elemHeight = parseFloat(h.toString());
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
}
export function getWidth(w: string | number) {
  const elemWidth = parseFloat(w.toString());
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
}
export function getFontSize(font: number) {
  const deviceHeight = isIphoneX()
    ? height * 0.9
    : Platform.OS === 'android'
    ? height - (StatusBar.currentHeight || 0)
    : height;
  const deviceHeightPercent = (font * deviceHeight) / 100;
  return Math.round(deviceHeightPercent);
}
export const useForceUpdate = () => {
  const [, updateState] = React.useState<undefined>();
  return React.useCallback(() => updateState(undefined), []);
};

// Utility function to get the greeting based on the time of day
export const getTimeBasedGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good Afternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric', // "short" for abbreviated months (e.g., JAN)
    })
    .toUpperCase(); // Convert to uppercase for consistency
};

/**
 * Converts a UTC date string to local timezone while keeping ISO format
 *
 * @param utcDateString - A UTC date string like "2025-04-30T23:00:00.000Z"
 * @returns ISO string in local timezone (e.g., "2025-04-30T19:00:00.000-04:00" for EDT)
 */
export const convertToLocalISOString = (
  utcDateString: string | undefined,
): string | undefined => {
  if (!utcDateString) return undefined;

  try {
    const date = new Date(utcDateString);

    // Get timezone offset in minutes
    const tzOffset = date.getTimezoneOffset();

    // Calculate offset string (e.g., "-04:00")
    const offsetHours = Math.abs(Math.floor(tzOffset / 60));
    const offsetMinutes = Math.abs(tzOffset % 60);
    const offsetSign = tzOffset > 0 ? '-' : '+';
    const offsetString = `${offsetSign}${offsetHours
      .toString()
      .padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

    // Format date in ISO format but with local timezone
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
  } catch (error) {
    console.error('Error converting to local ISO string:', error);
    return undefined;
  }
};

/**
 * Gets today's date in local timezone formatted as YYYY-MM-DD
 * @returns Local date string (e.g., "2025-10-03")
 */
export const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a UTC date string to local date in YYYY-MM-DD format
 * @param utcDateString - A UTC date string from backend
 * @returns Local date string (e.g., "2025-10-03")
 */
export const convertUTCToLocalDate = (utcDateString: string): string => {
  const date = new Date(utcDateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const convertToUTCMidnight = (
  dateString: string | undefined,
): string | undefined => {
  if (!dateString) return undefined;

  try {
    const date = new Date(dateString);

    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    );

    return utcDate.toISOString();
  } catch (error) {
    console.error('Error converting to UTC midnight:', error);
    return undefined;
  }
};

export const levelIcons: Record<
  ChallengeLevel,
  [keyof typeof IconType.glyphMap, string]
> = {
  Beginner: ['chess-pawn', '1'],
  Intermediate: ['chess-knight', '2'],
  Advanced: ['chess-bishop', '3'],
  Expert: ['chess-rook', '4'],
  Master: ['chess-queen', '5'],
  Beast: ['chess-king', '6'],
  Legend: ['chess-king', '7'],
};

export const getCategoryDisplayName = (category: CategoryFilter): string => {
  const displayMap: Record<CategoryFilter, string> = {
    [CategoryFilter.ALL]: 'All',
    [CategoryFilter.MIND]: 'Mindset',
    [CategoryFilter.FITNESS]: 'Fitness',
    [CategoryFilter.NUTRITION]: 'Nutrition',
    [CategoryFilter.MONEY]: 'Money',
    [CategoryFilter.RELATIONSHIPS]: 'Relationships',
    [CategoryFilter.PRODUCTIVITY]: 'Productivity',
    [CategoryFilter.DISCIPLINE]: 'Discipline',
    [CategoryFilter.AI]: 'AI',
  };
  return displayMap[category];
};

export const capitalizeFirstLetter = (str: string): string => {
  return str && str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const onScroll = (
  e: NativeSyntheticEvent<NativeScrollEvent>,
  setShowFade: (showFade: boolean) => void,
) => {
  const {contentOffset, layoutMeasurement, contentSize} = e.nativeEvent;
  if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 1) {
    setShowFade(false);
  } else {
    setShowFade(true);
  }
};
