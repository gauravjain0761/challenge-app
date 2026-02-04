import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useRegisterDeviceMutation,
  useRegisterMutation,
} from '@/api/authApi';
import {
  errorToast,
  generateNonce,
  mixPanelIdentifyUser,
} from '@/utils/common/commonFunction';
import ValidatedInput from '@/components/ValidatedInput';
import {useFormValidation} from '@/validation/hooks/useFormValidation';
import {
  registerRequestSchema,
  RegisterRequest,
  AppleRequest,
  User,
} from '@/validation/schemas/auth.schema';
import GradientContainer from '@/components/GradientContainer';
import IconComponent from '@/components/IconComponent';
import * as Google from 'expo-auth-session/providers/google';
import {
  EXPO_ANDROID_CLIENT_ID,
  EXPO_GOOGLE_CLIENT_ID,
  EXPO_IOS_CLIENT_ID,
  PRIVACY_URL,
  TERMS_URL,
} from '@/utils/constants/api';
import Loader from '@/components/Loader';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal} from 'react-native-onesignal';
import {AsyncTypes} from '@/types/enums';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {removeAsyncSubscriptionCustomerInfo} from '@/utils/common/useAsyncFunctions';
import {usePostAuthIntegration} from '@/hooks/usePostAuthIntegration';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setAutoJoinState} from '@/features/authSlice';

const Signup = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();

  console.log('params', params);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: EXPO_IOS_CLIENT_ID,
    androidClientId: EXPO_ANDROID_CLIENT_ID,
    webClientId: EXPO_GOOGLE_CLIENT_ID,
  });

  const [register, {isLoading}] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [appleLogin] = useAppleLoginMutation();
  const [registerDevice] = useRegisterDeviceMutation();

  // Post-auth integration hook
  const {handlePostAuthIntegration} = usePostAuthIntegration();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const {control, handleSubmit, registerRef, focusNextInput} =
    useFormValidation({
      schema: registerRequestSchema,
      defaultValues: {
        name: __DEV__ ? 'Test' : '',
        email: __DEV__ ? 't@gmail.com' : '',
        password: __DEV__ ? 'Test1234' : '',
      },
    });

  const handleBranchLink = async () => {
    const raw = await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK);
    if (raw) {
      const {screen, params} = JSON.parse(raw);
      await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK);
      router.replace({pathname: screen, params});
      return;
    }
  };

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const registerPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const hasPendingInvite =
        (await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK)) ||
        undefined;

      const registerResponse = await register(registerPayload).unwrap();
      // dispatch(setAutoJoinState(true));
      await onRegisterDevice(registerResponse.user);

      // Post-auth RC integration
      await handlePostAuthIntegration(registerResponse.user, hasPendingInvite);

      await removeAsyncSubscriptionCustomerInfo();
      handleBranchLink();

      // Mixpanel User Register Event
      mixPanelIdentifyUser(registerResponse.user);
    } catch (error: any) {
      console.log('register error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
      dispatch(setAutoJoinState(false));
    }
  };

  const onRegisterDevice = async (user: User) => {
    try {
      const playerId = await OneSignal.User.pushSubscription.getIdAsync();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const obj = {
        platform: Platform.OS,
        playerId: playerId as string,
        //timeZone: timezone,
      };
      console.log('obj', obj);

      await registerDevice(obj).unwrap();

      await OneSignal.login(user.id);
      await OneSignal.User.addEmail(user.email);
      await OneSignal.User.addTag('first_name', user.name);

      // Trigger journey
      await OneSignal.User.addTag('welcome_email_event', 'true');
    } catch (error: any) {
      console.log('registerDevice error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
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
      console.log('Google Token:', idToken);

      const hasPendingInvite =
        (await AsyncStorage.getItem(AsyncTypes.PENDING_BRANCH_LINK)) ||
        undefined;

      dispatch(setAutoJoinState(true));

      const googleResponse = await googleLogin({
        idToken: idToken as string,
      }).unwrap();
      await onRegisterDevice(googleResponse.user);

      // Post-auth RC integration
      await handlePostAuthIntegration(googleResponse.user, hasPendingInvite);

      handleBranchLink();
      setLoading(false);

      // Mixpanel User Register Event
      mixPanelIdentifyUser(googleResponse.user);
    } catch (error) {
      setLoading(false);
      dispatch(setAutoJoinState(false));
      console.log('Google login error-->', error);
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
      await onRegisterDevice(appleResponse.user);

      // Post-auth RC integration
      await handlePostAuthIntegration(appleResponse.user, hasPendingInvite);

      handleBranchLink();
      setLoading(false);

      // Mixpanel User Register Event
      mixPanelIdentifyUser(appleResponse.user);
    } catch (e: any) {
      console.log('Apple login error-->', e?.message);
      setLoading(false);
      dispatch(setAutoJoinState(false));
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

        <View style={styles.inputContainer}>
          <ValidatedInput
            name="name"
            control={control}
            placeholder="Name"
            registerRef={registerRef}
            nextField="email"
            focusNextInput={focusNextInput}
          />

          <ValidatedInput
            name="email"
            control={control}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            registerRef={registerRef}
            nextField="password"
            focusNextInput={focusNextInput}
          />

          <ValidatedInput
            name="password"
            control={control}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={showPassword}
            eyeIcon={showPassword ? 'eye' : 'eye-off'}
            onPressEyeIcon={() => setShowPassword(!showPassword)}
            registerRef={registerRef}
            onSubmitEditing={() => handleSubmit(onSubmit)()}
          />
        </View>

        <Button
          title="Signup"
          type="fill"
          style={{width: '100%'}}
          onPress={handleSubmit(onSubmit)}
        />

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
          title="Already have an account"
          type="outline"
          style={{width: '100%'}}
          onPress={() => navigation.navigate('logIn' as never)}
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
        ? getFontSize(7)
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
  inputContainer: {
    marginBottom: getFontSize(0.5),
  },
  termsText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: getFontSize(2),
    marginBottom: getFontSize(3),
    marginTop: getFontSize(1.5),
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
    marginBottom: getFontSize(3),
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
});

export default Signup;
