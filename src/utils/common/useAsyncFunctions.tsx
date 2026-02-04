import {AsyncTypes} from '@/types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setExplore = async () => {
  await setAsyncExplorer();
};

export const setAsyncToday = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.TODAY, 'false');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncToday = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.TODAY);
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncToday = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.TODAY);
  } catch (e) {
    console.log(e);
  }
};

export const setAsyncExplorer = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.EXPLORE, 'false');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncExplorer = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.EXPLORE);
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncExplorer = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.EXPLORE);
  } catch (e) {
    console.log(e);
  }
};

// See All walkthrough functions
export const setAsyncSeeAll = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.SEE_ALL, 'false');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncSeeAll = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.SEE_ALL);
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncSeeAll = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.SEE_ALL);
  } catch (e) {
    console.log(e);
  }
};

// Explore Info walkthrough functions
export const setAsyncExploreInfo = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.EXPLORE_INFO, 'false');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncExploreInfo = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.EXPLORE_INFO);
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncExploreInfo = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.EXPLORE_INFO);
  } catch (e) {
    console.log(e);
  }
};

// In Progress Challenge walkthrough functions
export const setAsyncInProgress = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.IN_PROGRESS, 'false');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncInProgress = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.IN_PROGRESS);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeAsyncInProgress = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.IN_PROGRESS);
  } catch (e) {
    console.log(e);
  }
};

// Subscription Customer Info
export const setAsyncSubscriptionCustomerInfo = async (e: any) => {
  try {
    await AsyncStorage.setItem(
      AsyncTypes.SUBSCRIPTION_CUSTOMER_INFO,
      JSON.stringify(e),
    );
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncSubscriptionCustomerInfo = async () => {
  try {
    const e = await AsyncStorage.getItem(AsyncTypes.SUBSCRIPTION_CUSTOMER_INFO);
    return e ? JSON.parse(e) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncSubscriptionCustomerInfo = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.SUBSCRIPTION_CUSTOMER_INFO);
  } catch (e) {
    console.log(e);
  }
};

// Subscribe Challenge by info

export const setAsyncSubscribeChallengeInfo = async (e: any) => {
  try {
    await AsyncStorage.setItem(
      AsyncTypes.SUBSCRIBE_CHALLENGE_INFO,
      JSON.stringify(e),
    );
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncSubscribeChallengeInfo = async () => {
  try {
    const e = await AsyncStorage.getItem(AsyncTypes.SUBSCRIBE_CHALLENGE_INFO);
    return e ? JSON.parse(e) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeAsyncSubscribeChallengeInfo = async () => {
  try {
    await AsyncStorage.removeItem(AsyncTypes.SUBSCRIBE_CHALLENGE_INFO);
  } catch (e) {
    console.log(e);
  }
};

export const setAsyncActionCompulsoryNotice = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.COMPULSORY_ACTION_NOTICE, 'true');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncActionCompulsoryNotice = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.COMPULSORY_ACTION_NOTICE);
  } catch (e) {
    console.log(e);
  }
};
export const setAsyncActionCompulsoryHow = async () => {
  try {
    await AsyncStorage.setItem(AsyncTypes.COMPULSORY_ACTION_HOW, 'true');
  } catch (e) {
    console.log(e);
  }
};

export const getAsyncActionCompulsoryHow = async () => {
  try {
    return await AsyncStorage.getItem(AsyncTypes.COMPULSORY_ACTION_HOW);
  } catch (e) {
    console.log(e);
  }
};
