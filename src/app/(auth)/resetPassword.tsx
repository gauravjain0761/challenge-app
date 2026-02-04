import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import {Colors} from '@/constants/Colors';
import {useLocalSearchParams, useNavigation, useRouter} from 'expo-router';
import {getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import {errorToast} from '@/utils/common/commonFunction';
import {useResetPasswordMutation} from '@/api/authApi';
import {ResetPasswordBody, resetPasswordBodySchema} from '@/validation/schemas';
import {useFormValidation} from '@/validation/hooks';
import ValidatedInput from '@/components/ValidatedInput';
import IconComponent from '@/components/IconComponent';

const resetPassword = () => {
  const {token}: any = useLocalSearchParams();

  const navigation = useNavigation();
  const router = useRouter();
  const [resetPassword, {isLoading}] = useResetPasswordMutation();

  const {control, handleSubmit, registerRef, focusNextInput} =
    useFormValidation({
      schema: resetPasswordBodySchema,
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
    });

  const [showPassword, setShowPassword] = useState(true);
  const [showCPassword, setShowCPassword] = useState(true);

  const onSubmit = async (data: ResetPasswordBody) => {
    try {
      const result = await resetPassword({
        body: data,
        query: {token},
      }).unwrap();

      if (result) {
        router.replace('logIn' as never);
      }
    } catch (error: any) {
      console.log('register error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  return (
    <GradientContainer isLoading={isLoading}>
      <IconComponent
        name="left"
        size={24}
        color={Colors.white}
        onPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.heading}>Reset your password</Text>
        <Text style={styles.dec}>Please enter your new password</Text>

        <ValidatedInput
          name="password"
          control={control}
          placeholder="Password"
          secureTextEntry={showPassword}
          eyeIcon={showPassword ? 'eye' : 'eye-off'}
          onPressEyeIcon={() => setShowPassword(!showPassword)}
          registerRef={registerRef}
          nextField="confirmPassword"
          focusNextInput={focusNextInput}
        />
        <ValidatedInput
          name="confirmPassword"
          control={control}
          placeholder="Confirm password"
          secureTextEntry={showCPassword}
          eyeIcon={showCPassword ? 'eye' : 'eye-off'}
          onPressEyeIcon={() => setShowCPassword(!showCPassword)}
          registerRef={registerRef}
          onSubmitEditing={() => handleSubmit(onSubmit)()}
        />

        <Button
          title={'Reset Password'}
          style={{
            marginTop: getFontSize(4),
            width: '100%',
          }}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </GradientContainer>
  );
};

export default resetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getFontSize(1),
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(3.4),
    marginTop: getFontSize(5),
    fontWeight: '500',
  },
  dec: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginTop: getFontSize(2),
    marginBottom: getFontSize(4),
    opacity: 0.6,
  },
});
