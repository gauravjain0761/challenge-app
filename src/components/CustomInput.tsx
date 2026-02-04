import {
  InputAccessoryViewProps,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {ForwardedRef, forwardRef} from 'react';
import {Colors} from '../constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from './IconComponent';

type Props = Omit<TextInputProps, 'onBlur'> & {
  label?: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  multiline?: boolean;
  textAlignVertical?: 'auto' | 'center' | 'top' | 'bottom' | undefined;
  inputStyle?: TextStyle;
  placeholderTextColor?: any;
  maxLength?: number;
  rightIcon?: any;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFormBlur?: () => void;
  eyeIcon?: any;
  onPressEyeIcon?: () => void;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  props?: InputAccessoryViewProps;
  mainContainer?: ViewStyle;
  required?: boolean;
} & TextInputProps;

const CustomInput = forwardRef<TextInput, Props>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      containerStyle,
      keyboardType = 'default',
      secureTextEntry = false,
      multiline = false,
      textAlignVertical = 'auto',
      inputStyle,
      placeholderTextColor = '#aaa',
      maxLength,
      rightIcon,
      error,
      autoCapitalize,
      onBlur: onNativeBlur,
      onFormBlur,
      eyeIcon,
      onPressEyeIcon = () => {},
      onSubmitEditing: onNativeSubmit,
      mainContainer,
      required,
      ...props
    }: Props,
    ref: ForwardedRef<TextInput>,
  ) => {
    return (
      <View style={{...styles.inputContainer, ...mainContainer}}>
        {label && (
          <Text style={styles.label}>
            {label}{' '}
            {required && (
              <Text
                style={{
                  color: Colors.red,
                  fontSize: getFontSize(2.5),
                }}>
                *
              </Text>
            )}
          </Text>
        )}
        <View
          style={[
            styles.container,
            containerStyle,
            error ? styles.inputError : null,
          ]}>
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            onBlur={e => {
              // first the native TextInput blur
              onNativeBlur?.(e);
              // then the form’s blur
              onFormBlur?.();
            }}
            {...props}
          />
          {rightIcon && rightIcon}
          {eyeIcon && (
            <IconComponent
              name={eyeIcon}
              size={25}
              color={Colors._4b4b4b}
              onPress={onPressEyeIcon}
              type="Feather"
            />
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: getFontSize(2),
  },
  container: {
    height: getFontSize(6.5),
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1.5),
    paddingHorizontal: getFontSize(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: getFontSize(6.5),
    color: Colors.white,
    fontSize: getFontSize(2),
    paddingRight: getFontSize(1),
  },
  errorText: {
    color: 'red',
    fontSize: getFontSize(1.8),
    marginTop: 5,
    marginLeft: 5,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  label: {
    fontSize: getFontSize(2),
    fontWeight: '500',
    color: Colors.white,
    marginBottom: 5,
  },
});
