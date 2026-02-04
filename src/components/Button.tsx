import {Colors} from '@/constants/Colors';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {getFontSize} from '@/utils/responsiveFn';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactElement; // Optional prop for left icon component (e.g., Icon, AntIcon)
  disabled?: boolean;
  type?: 'fill' | 'outline';
  isLoading?: boolean;
  onLayout?: (e: any) => void;
  containerStyle?: ViewStyle;
  colors?: string[];
};

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  leftIcon,
  disabled,
  type = 'fill',
  isLoading = false,
  onLayout,
  containerStyle,
  colors,
}: ButtonProps) =>
  type === 'fill' ? (
    <LinearGradient
      onLayout={onLayout}
      colors={colors ?? ['#C05600', '#893E00']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        ...styles.fillButton,
        ...style,
      }}>
      <TouchableOpacity
        style={[styles.button, containerStyle, {opacity: disabled ? 0.6 : 1}]}
        activeOpacity={0.7}
        disabled={isLoading || disabled}
        onPress={onPress}>
        {isLoading ? (
          <ActivityIndicator size={'large'} color={Colors.white} />
        ) : (
          <>
            {leftIcon}
            <Text style={[GeneralStyle.buttonText, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </LinearGradient>
  ) : (
    <TouchableOpacity
      style={[GeneralStyle.button, {opacity: disabled ? 0.6 : 1}, style]}
      disabled={disabled}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={Colors.white} />
      ) : (
        <>
          {leftIcon}
          <Text style={[GeneralStyle.buttonText, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );

export default Button;

const styles = StyleSheet.create({
  fillButton: {
    width: '90%',
    height: getFontSize(6.5),
    borderRadius: getFontSize(1),
    marginVertical: getFontSize(1.5),
    alignSelf: 'center',
  },
  button: {
    height: getFontSize(6.5),
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
});
