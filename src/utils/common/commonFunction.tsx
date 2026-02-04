import Toast from 'react-native-toast-message';
import {MIX_PANEL_EVENTS, UnitsOptions} from '@/types/enums';
import * as Crypto from 'expo-crypto';
import moment from 'moment';
import {getFontSize} from '../responsiveFn';
import {identifyUser, trackEvent} from '@/hooks/useMixpanelClient';
import {Platform} from 'react-native';
import {User} from '@/validation/schemas';

export const successToast = (message: string) => {
  Toast.show({type: 'success', text1: message});
};

export const errorToast = (message: string) => {
  Toast.show({type: 'error', text1: message});
};

export const emailCheck = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/;
  return reg.test(string);
};

export const mobileNumberCheck = (mobileNo: string) => {
  let reg = /^\d*$/;
  return reg.test(mobileNo);
};

export const convertUnits = (value: string) => {
  if (value === UnitsOptions.MINUTES) return 'Mins';
  else if (value === UnitsOptions.KILOGRAMS) return 'Kg';
  else if (value === UnitsOptions.KILOMETERS) return 'Km';
  else return value;
};

export const formatToHMS = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hDisplay = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';
  const mDisplay = `${mins.toString().padStart(2, '0')}:`;
  const sDisplay = `${secs.toString().padStart(2, '0')}`;

  return `${hDisplay}${mDisplay}${sDisplay}`;
};

export const formatDay = (input: string) => {
  return input ? input.replace(/([a-zA-Z])(\d+)/, '$1 $2') : '';
};

export const generateNonce = async (length = 32) => {
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const randomBytes = await Crypto.getRandomBytesAsync(length);
  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length];
  }
  return result;
};

export function getShortTimeAgo(createdAt: string) {
  const now = moment();
  const date = moment(createdAt);

  const seconds = now.diff(date, 'seconds');
  const minutes = now.diff(date, 'minutes');
  const hours = now.diff(date, 'hours');
  const days = now.diff(date, 'days');
  const weeks = now.diff(date, 'weeks');
  const months = now.diff(date, 'months');
  const years = now.diff(date, 'years');

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 4) {
    return `${weeks}w ago`;
  } else if (months < 12) {
    return `${months}m ago`;
  } else {
    return `${years}y ago`;
  }
}

export const FSize = {
  // font sizes
  f1: getFontSize(0.1),
  f2: getFontSize(0.2),
  f3: getFontSize(0.3),
  f4: getFontSize(0.5),
  f5: getFontSize(0.6),
  f6: getFontSize(0.7),
  f7: getFontSize(0.9),
  f8: getFontSize(1),
  f9: getFontSize(1.2),
  f10: getFontSize(1.3),
  f11: getFontSize(1.4),
  f12: getFontSize(1.5),
  f13: getFontSize(1.6),
  f14: getFontSize(1.8),
  f15: getFontSize(1.9),
  f16: getFontSize(2),
  f17: getFontSize(2.2),
  f18: getFontSize(2.3),
  f19: getFontSize(2.4),
  f20: getFontSize(2.6),
  f21: getFontSize(2.7),
  f22: getFontSize(2.8),
  f23: getFontSize(2.9),
  f24: getFontSize(3),
  f25: getFontSize(3.2),
  f26: getFontSize(3.3),
  f27: getFontSize(3.4),
  f28: getFontSize(3.5),
  f29: getFontSize(3.7),
  f30: getFontSize(3.8),
  f31: getFontSize(3.9),
  f32: getFontSize(4.1),
  f33: getFontSize(4.2),
  f34: getFontSize(4.3),
  f35: getFontSize(4.5),
  f36: getFontSize(4.6),
  f37: getFontSize(4.7),
  f38: getFontSize(4.8),
  f39: getFontSize(4.9),
  f40: getFontSize(5.1),
  f41: getFontSize(5.2),
  f42: getFontSize(5.4),
  f43: getFontSize(5.5),
  f44: getFontSize(5.6),
  f45: getFontSize(5.7),
  f46: getFontSize(5.8),
  f47: getFontSize(6),
  f48: getFontSize(6.1),
  f49: getFontSize(6.2),
  f50: getFontSize(6.3),
  f51: getFontSize(6.4),
  f52: getFontSize(6.5),
  f53: getFontSize(6.6),
  f54: getFontSize(6.7),
  f55: getFontSize(6.8),
  f56: getFontSize(6.9),
  f57: getFontSize(7),
};

export const mixPanelIdentifyUser = async (user: User) => {
  identifyUser(user.id, {
    name: user.name,
    email: user.email,
  });

  trackEvent(MIX_PANEL_EVENTS.user_registered, {
    signup_method: user.provider,
    user_id: user.id,
    device_type: Platform.OS,
  });
};
