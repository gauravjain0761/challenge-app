import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientContainer from '@/components/GradientContainer';
import {Colors} from '@/constants/Colors';
import {router, useNavigation} from 'expo-router';
import {getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import {useForgotPasswordMutation} from '@/api/authApi';
import {errorToast} from '@/utils/common/commonFunction';
import ValidatedInput from '@/components/ValidatedInput';
import {useFormValidation} from '@/validation/hooks';
import {
  ForgotPasswordRequest,
  forgotPasswordRequestSchema,
} from '@/validation/schemas';
import IconComponent from '@/components/IconComponent';

const forgotPassword = () => {
  const navigation = useNavigation();

  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();

  const {control, handleSubmit, registerRef, focusNextInput} =
    useFormValidation({
      schema: forgotPasswordRequestSchema,
      defaultValues: {
        email: __DEV__ ? 'test@yopmail.com' : '',
      },
    });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      const result = await forgotPassword(data).unwrap();

      if (result) {
        navigation.navigate('verifyOtp' as never);
        router.setParams({email: data.email});
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
        <Text style={styles.heading}>Forgot your password</Text>
        <Text style={styles.dec}>
          Please enter your email address to get the{'\n'}code for reset
          password.
        </Text>

        <ValidatedInput
          name="email"
          control={control}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          registerRef={registerRef}
          focusNextInput={focusNextInput}
          onSubmitEditing={() => handleSubmit(onSubmit)()}
        />

        <Button
          title={'Send'}
          style={{
            width: '100%',
          }}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </GradientContainer>
  );
};

export default forgotPassword;

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
