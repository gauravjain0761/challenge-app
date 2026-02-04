import {Mixpanel} from 'mixpanel-react-native';

let mixpanel: Mixpanel | null = null;

/**
 * Initialize Mixpanel once
 *
 * Example:
 * ```ts
 * import { initMixpanel } from './mixpanelClient';
 *
 * await initMixpanel('YOUR_MIXPANEL_PROJECT_TOKEN');
 * ```
 *
 * This should be called once at app startup (e.g., in App.tsx).
 *
 * @param token Mixpanel Project Token
 * @returns Initialized Mixpanel instance
 */
export const initMixpanel = async (): Promise<Mixpanel> => {
  if (!mixpanel) {
    console.log(
      'EXPO_MIX_PANEL_TOKEN',
      process.env?.EXPO_PUBLIC_MIX_PANEL_TOKEN,
    );

    const trackAutomaticEvents = true;
    mixpanel = new Mixpanel(
      process.env.EXPO_PUBLIC_MIX_PANEL_TOKEN,
      trackAutomaticEvents,
    );
    // mixpanel = new Mixpanel(token);
    await mixpanel.init();
    mixpanel.setLoggingEnabled(true); // optional: enable for debugging
    console.log('✅ Mixpanel initialized');
  }
  return mixpanel;
};

/**
 * Get the Mixpanel instance safely
 *
 * Example:
 * ```ts
 * import { getMixpanel } from './mixpanelClient';
 *
 * const mixpanel = getMixpanel();
 * mixpanel?.track('Custom Event');
 * ```
 *
 * @returns Mixpanel instance or null if not initialized
 */
export const getMixpanel = (): Mixpanel | null => {
  if (!mixpanel) {
    console.warn('⚠️ Mixpanel not initialized yet!');
  }
  return mixpanel;
};

/**
 * Track an event
 *
 * Example:
 * ```ts
 * import { trackEvent } from './mixpanelClient';
 *
 * trackEvent('Button Clicked', { screen: 'Home', color: 'blue' });
 * trackEvent('Video Played', { videoId: 'intro_001', duration: 30 });
 * ```
 *
 * @param eventName Event name
 * @param properties Optional event properties
 */
export const trackEvent = (
  eventName: string,
  properties: Record<string, any> = {},
): void => {
  const instance = getMixpanel();
  if (!instance) return;
  console.log('TrackEvent', eventName);

  instance.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Identify a user and set profile properties
 *
 * Example:
 * ```ts
 * import { identifyUser } from './mixpanelClient';
 *
 * identifyUser('user_123', {
 *   $name: 'John Doe',
 *   $email: 'john@example.com',
 *   plan: 'Pro',
 * });
 * ```
 *
 * @param userId Unique user ID
 * @param traits Optional user traits (Mixpanel People properties)
 */
export const identifyUser = (
  userId: string,
  traits: Record<string, any> = {},
): void => {
  const instance = getMixpanel();
  console.log('identifyUser', traits);

  if (instance) {
    instance.identify(userId);
    instance.getPeople().set(traits);
    instance.getPeople().setOnce('name', traits?.name);
    instance.getPeople().setOnce('email', traits?.email);
  }
};

/**
 * Reset Mixpanel data (use when user logs out)
 *
 * Example:
 * ```ts
 * import { resetMixpanel } from './mixpanelClient';
 *
 * resetMixpanel();
 * ```
 */
export const resetMixpanel = (): void => {
  const instance = getMixpanel();
  if (instance) {
    instance.reset();
    console.log('🔁 Mixpanel reset');
  }
};
