import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {router, useNavigation} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useLoginMutation,
  useRegisterDeviceMutation,
} from '@/api/authApi';
import {
  errorToast,
  generateNonce,
  mixPanelIdentifyUser,
} from '@/utils/common/commonFunction';
import GradientContainer from '@/components/GradientContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFormValidation} from '@/validation/hooks/useFormValidation';
import {
  AppleRequest,
  LoginRequest,
  loginRequestSchema,
  User,
} from '@/validation/schemas';
import ValidatedInput from '@/components/ValidatedInput';
import IconComponent from '@/components/IconComponent';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import CustomCheckBox from '@/components/CustomCheckBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncTypes} from '@/types/enums';
import * as Google from 'expo-auth-session/providers/google';
import {
  EXPO_ANDROID_CLIENT_ID,
  EXPO_GOOGLE_CLIENT_ID,
  EXPO_IOS_CLIENT_ID,
  PRIVACY_URL,
  TERMS_URL,
} from '@/utils/constants/api';
import Loader from '@/components/Loader';
import {OneSignal} from 'react-native-onesignal';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {
  removeAsyncSubscriptionCustomerInfo,
  getAsyncSubscribeChallengeInfo,
} from '@/utils/common/useAsyncFunctions';
import {usePostAuthIntegration} from '@/hooks/usePostAuthIntegration';
import {setAutoJoinState} from '@/features/authSlice';

WebBrowser.maybeCompleteAuthSession();

const LogIn = () => {
  const navigation = useNavigation();
  const {} = useAppSelector(state => state.auth);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: EXPO_IOS_CLIENT_ID,
    androidClientId: EXPO_ANDROID_CLIENT_ID,
    webClientId: EXPO_GOOGLE_CLIENT_ID,
  });
  const dispatch = useAppDispatch();

  // RTK Query login mutation
  const [login, {isLoading}] = useLoginMutation();
  const [registerDevice] = useRegisterDeviceMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [appleLogin] = useAppleLoginMutation();

  // Post-auth integration hook
  const {handlePostAuthIntegration} = usePostAuthIntegration();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const {control, handleSubmit, registerRef, focusNextInput, setValue} =
    useFormValidation({
      schema: loginRequestSchema,
      defaultValues: {
        email: __DEV__ ? '000t@gmail.com' : '',
        password: __DEV__ ? 'Test1234' : '',
      },
    });

  useEffect(() => {
    (async () => {
      const credentials = await AsyncStorage.getItem(AsyncTypes.CREDENTIALS);

      if (credentials) {
        const {email, password} = JSON.parse(credentials);
        setValue('email', email);
        setValue('password', password);
        setRememberMe(true);
      }
    })();
  }, []);

  const handleBranchLink = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const raw = await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK);
    if (raw) {
      const {screen, params} = JSON.parse(raw);
      router.replace({pathname: screen, params});
      await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK);
      return;
    }
  };

  const onSubmit = async (data: LoginRequest) => {
    try {
      // Remove revenueCatCustomerId from login payload
      const loginPayload = {
        email: data.email,
        password: data.password,
      };
      const hasPendingInvite =
        (await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK)) ||
        undefined;

      const loginResponse = await login(loginPayload).unwrap();
      // dispatch(setAutoJoinState(true));
      saveCredentials(data.email, data.password);
      await onRegisterDevice(loginResponse.user, false);

      // Post-auth RC integration
      await handlePostAuthIntegration(loginResponse.user, hasPendingInvite);

      await removeAsyncSubscriptionCustomerInfo();
      await handleBranchLink();
      await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');

      // Mixpanel User Register Event
      mixPanelIdentifyUser(loginResponse.user);
    } catch (error: any) {
      console.log('login error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
      dispatch(setAutoJoinState(false));
    }
  };
  const onRegisterDevice = async (user: User, socialLogin: boolean = false) => {
    try {
      const playerId = await OneSignal.User.pushSubscription.getIdAsync();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const obj = {
        platform: Platform.OS,
        playerId: playerId as string,
        // timeZone: timezone,
      };

      await registerDevice(obj).unwrap();

      await OneSignal.login(user.id);
      if (socialLogin) {
        await OneSignal.User.addEmail(user.email);
        await OneSignal.User.addTag('first_name', user.name);
        // Trigger journey
        await OneSignal.User.addTag('welcome_email_event', 'true');
      }
    } catch (error: any) {
      console.log('registerDevice error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  const saveCredentials = async (email: string, password: string) => {
    try {
      const credentials = {email, password};
      if (rememberMe === false) {
        await AsyncStorage.removeItem(AsyncTypes.CREDENTIALS);
      } else {
        await AsyncStorage.setItem(
          AsyncTypes.CREDENTIALS,
          JSON.stringify(credentials),
        );
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const {authentication} = response;
      handleGoogleLogin(authentication?.idToken as string);
    } else if (response?.type === 'cancel') {
      setLoading(false);
    } else if (response?.type === 'error') {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const hasPendingInvite =
        (await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK)) ||
        undefined;
      dispatch(setAutoJoinState(true));
      // Remove revenueCatCustomerId from Google login payload
      const googlePayload = {
        idToken: idToken as string,
      };

      const googleResponse = await googleLogin(googlePayload).unwrap();
      await onRegisterDevice(googleResponse.user, true);

      // Post-auth RC integration
      await handlePostAuthIntegration(googleResponse.user, hasPendingInvite);

      await handleBranchLink();
      await removeAsyncSubscriptionCustomerInfo();
      await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');
      setLoading(false);

      // Mixpanel User Register Event
      mixPanelIdentifyUser(googleResponse.user);
    } catch (error) {
      console.log('Google login error-->', error);
      setLoading(false);
      dispatch(setAutoJoinState(false));
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    const nonce = await generateNonce();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
    );

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      console.log('Apple credential', credential);

      let obj: AppleRequest = {
        identityToken: '',
        user: '',
      };
      if (credential.identityToken) {
        obj.identityToken = credential.identityToken;
      }
      if (credential.fullName?.givenName) {
        obj.fullName = {
          ...obj.fullName,
          givenName: credential.fullName.givenName,
        };
      }
      if (credential.fullName?.familyName) {
        obj.fullName = {
          ...obj.fullName,
          familyName: credential.fullName.familyName,
        };
      }
      if (credential.email !== null) {
        obj.email = credential.email;
      }
      if (credential.user) {
        obj.user = credential.user;
      }
      console.log('Apple credential', obj);

      const hasPendingInvite =
        (await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK)) ||
        undefined;
      dispatch(setAutoJoinState(true));

      const appleResponse = await appleLogin(obj).unwrap();
      await onRegisterDevice(appleResponse.user, true);

      // Post-auth RC integration
      await handlePostAuthIntegration(appleResponse.user, hasPendingInvite);

      await removeAsyncSubscriptionCustomerInfo();
      await handleBranchLink();
      await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');
      setLoading(false);

      // Mixpanel User Register Event
      mixPanelIdentifyUser(appleResponse.user);
    } catch (e: any) {
      console.log('Apple login error-->', e?.message);
      Alert.alert('Error', e?.message);
      setLoading(false);
      dispatch(setAutoJoinState(false));
    }
  };

  const onPress = async () => {
    const completed = await AsyncStorage.getItem(
      AsyncTypes.ONBOARDING_COMPLETED,
    );
    const branchLink = await AsyncStorage.getItem(
      AsyncTypes.PENDING_BRANCH_LINK,
    );
    if (completed !== null) {
      navigation.navigate('signUp' as never);
    } else if (branchLink !== null) {
      navigation.navigate('signUp' as never);
      await AsyncStorage.setItem(AsyncTypes.ONBOARDING_COMPLETED, 'true');
    } else {
      router.dismissAll();
      router.dismissTo('/(auth)/(onBoardingFlow)');
    }
  };

  return (
    <GradientContainer isLoading={isLoading}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.container}>
        <View style={styles.logoContainer}>
          <FastImage
            source={Images.Men_Tools_Logo} // Replace with your video path
            style={{width: getFontSize(18), height: getFontSize(8)}}
            resizeMode="contain"
          />
        </View>
        <ValidatedInput
          name="email"
          control={control}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          registerRef={registerRef}
          nextField="password"
          focusNextInput={focusNextInput}
          textContentType="username"
          autoComplete="email"
        />
        <ValidatedInput
          name="password"
          control={control}
          placeholder="Password"
          textContentType="password"
          autoComplete="password"
          placeholderTextColor="#aaa"
          secureTextEntry={showPassword}
          eyeIcon={showPassword ? 'eye' : 'eye-off'}
          onPressEyeIcon={() => setShowPassword(!showPassword)}
          registerRef={registerRef}
          onSubmitEditing={() => handleSubmit(onSubmit)()}
        />
        <CustomCheckBox
          title="Remember me"
          isSelected={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Button
          title={isLoading ? 'Logging in...' : 'LogIn'}
          // textStyle={{color: Colors.black}}
          style={{
            width: '100%',
          }}
          onPress={() => handleSubmit(onSubmit)()}
          // disabled={isLoading}
        />
        <Text
          onPress={() => navigation.navigate('forgotPassword' as never)}
          style={styles.forgotPassword}>
          Forgot Password
        </Text>
        <Text style={styles.termsText}>
          By signing up, you agree to our{' '}
          <Text
            onPress={() => {
              router.push({
                pathname: '/(modals)/(profile)/webScreen',
                params: {
                  title: 'Terms of Services',
                  url: TERMS_URL,
                },
              });
            }}
            style={styles.link}>
            Terms of Services
          </Text>{' '}
          and{' '}
          <Text
            onPress={() => {
              router.push({
                pathname: '/(modals)/(profile)/webScreen',
                params: {
                  title: 'Privacy policy',
                  url: PRIVACY_URL,
                },
              });
            }}
            style={styles.link}>
            Privacy policy
          </Text>
        </Text>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            setLoading(true);
            promptAsync({showInRecents: true});
          }}
          disabled={isLoading}>
          <IconComponent name="google" size={25} color="#fff" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAppleLogin}
            disabled={isLoading}>
            <IconComponent
              type="MaterialIcons"
              name="apple"
              size={35}
              color="#fff"
            />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}
        <Button
          title="Create account"
          type="outline"
          style={{width: '100%'}}
          onPress={onPress}
          disabled={isLoading}
        />
      </KeyboardAwareScrollView>
      {loading && <Loader />}
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:
      Platform.OS === 'android'
        ? getFontSize(13)
        : isIphoneX()
        ? getFontSize(5)
        : getFontSize(3.5),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: getFontSize(7),
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlight: {
    color: '#ff7300',
  },

  termsText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: getFontSize(2),
    marginBottom: getFontSize(4),
    marginTop: getFontSize(4.5),
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  link: {
    color: Colors.white,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getFontSize(4.5),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: Colors.white,
    marginHorizontal: 10,
    fontSize: getFontSize(2),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: getFontSize(6.5),
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.1),
    borderColor: '#fff',
    marginBottom: 15,
  },
  socialButtonText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginLeft: getFontSize(1),
  },
  footerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    color: Colors.white,
    fontSize: getFontSize(2.1),
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginTop: getFontSize(0.8),
  },
});

export default LogIn;
