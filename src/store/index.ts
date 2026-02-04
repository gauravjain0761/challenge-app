import {
  configureStore,
  combineReducers,
  AnyAction,
  Middleware,
} from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {setupListeners} from '@reduxjs/toolkit/query';

// Persisted reducer from your slice
import {persistedAuthReducer} from '@/features/authSlice';
import loaderReducer from '@/features/loaderSlice';

// RTK Query API slice
import {authApi} from '@/api/authApi';

// Custom middleware
import {loadingMiddleware} from './middleware/loadingMiddleware';
import {exploreApi} from '@/api/exploreApi';
import {challengeParticipationApi} from '@/api/challengeParticipationApi';
import {scheduleChallengeApi} from '@/api/scheduledChallengesApi';
import {progressChallengesApi} from '@/api/progressChallengesApi';
import {friendApi} from '@/api/friendApi';
import {notificationApi} from '@/api/notificationApi';
import {profileApi} from '@/api/profileApi';
import {pastChallengeApi} from '@/api/pastChallengeApi';
import {subscriptionApi} from '@/api/subscriptionApi';

// 1) Root‐reducer, with a reset action handler
const appReducer = combineReducers({
  auth: persistedAuthReducer, // ← use the persisted reducer here
  loader: loaderReducer,
  [authApi.reducerPath]: authApi.reducer, // RTK Query for cached data all HTTP requests
  [exploreApi.reducerPath]: exploreApi.reducer, // RTK Query for cached data all HTTP requests
  [challengeParticipationApi.reducerPath]: challengeParticipationApi.reducer, // RTK Query for cached data all HTTP requests
  [scheduleChallengeApi.reducerPath]: scheduleChallengeApi.reducer, // RTK Query for cached data all HTTP requests
  [progressChallengesApi.reducerPath]: progressChallengesApi.reducer, // RTK Query for cached data all HTTP requests
  [friendApi.reducerPath]: friendApi.reducer, // RTK Query for cached data all HTTP requests
  [notificationApi.reducerPath]: notificationApi.reducer, // RTK Query for cached data all HTTP requests
  [profileApi.reducerPath]: profileApi.reducer, // RTK Query for cached data all HTTP requests
  [pastChallengeApi.reducerPath]: pastChallengeApi.reducer, // RTK Query for cached data all HTTP requests
  [subscriptionApi.reducerPath]: subscriptionApi.reducer, // RTK Query for cached data all HTTP requests
  // Add other reducers here
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};

// 2) Analytics middleware (tight types)
const analyticsMiddleware: Middleware =
  ({getState}: {getState: () => any}) =>
  (next: any) =>
  (action: any) => {
    if (
      action.type === 'auth/setToken' ||
      action.type === 'auth/clearToken' ||
      action.type.endsWith('/fulfilled') ||
      action.type.endsWith('/rejected')
    ) {
      if (__DEV__) console.log('[ANALYTICS]', action.type);
    }
    return next(action);
  };

// 3) Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: {warnAfter: 300}, // dev-only
    })
      .concat(authApi.middleware) // RTK Query
      .concat(exploreApi.middleware) // RTK Query
      .concat(challengeParticipationApi.middleware) // RTK Query
      .concat(scheduleChallengeApi.middleware) // RTK Query
      .concat(progressChallengesApi.middleware) // RTK Query
      .concat(friendApi.middleware) // RTK Query
      .concat(notificationApi.middleware) // RTK Query
      .concat(profileApi.middleware) // RTK Query
      .concat(pastChallengeApi.middleware) // RTK Query
      .concat(subscriptionApi.middleware) // RTK Query
      .concat(loadingMiddleware) // your loader counter
      .concat(analyticsMiddleware), // logging
  devTools: __DEV__,
});

// setStoreInstance(store);

// 4) Persistor & listeners
export const persistor = persistStore(store);
setupListeners(store.dispatch);

// 5) Types & reset helper
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const resetStore = async () => {
  await persistor.flush(); // flush pending writes
  await persistor.purge(); // remove data from storage
  store.dispatch({type: 'RESET_STORE'});
  persistor.persist(); // ✅ restart persistence
};
