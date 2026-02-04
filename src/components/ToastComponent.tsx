import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import IconComponent from '@/components/IconComponent';
import Toast from 'react-native-toast-message';
interface ToastProps {
  type: 'error' | 'success';
  text1: string;
  lineAnim?: any;
}

const ToastComponent: React.FC<ToastProps> = ({type, text1, lineAnim}) => {
  return (
    <SafeAreaView>
      <View style={styles.toastStyle}>
        {type === 'success' && (
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 0.9, y: 0.8}}
            colors={[Colors.containerBGColor, Colors.greenOpacity]}>
            <View style={styles.row}>
              <IconComponent
                type="AntDesign"
                name="checkcircle"
                color={Colors.green}
                size={getFontSize(2.5)}
              />
              <Text style={styles.textStyleToast}>{text1}</Text>

              <IconComponent
                type="Feather"
                name="x"
                color={Colors.white}
                size={getFontSize(3)}
                onPress={() => {
                  Toast.hide();
                }}
              />
            </View>

            <Animated.View
              style={{
                height: 4,
                backgroundColor: Colors.green,
                width: lineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'], // Animate from 0% to 100%
                }),
              }}
            />
          </LinearGradient>
        )}

        {type === 'error' && (
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 0.9, y: 0.8}}
            colors={[Colors.containerBGColor, Colors.orangeOpacity]}>
            <View style={styles.row}>
              <IconComponent
                type="AntDesign"
                name="closecircle"
                color={Colors.red}
                size={getFontSize(2.5)}
              />
              <Text style={styles.textStyleToast}>{text1}</Text>
              <IconComponent
                type="Feather"
                name="x"
                color={Colors.white}
                size={getFontSize(3)}
                onPress={() => {
                  Toast.hide();
                }}
              />
            </View>

            <Animated.View
              style={{
                height: 4,
                backgroundColor: Colors.red,
                width: lineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'], // Animate from 0% to 100%
                }),
              }}
            />
          </LinearGradient>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: Colors._25201a,
    width: SCREEN_WIDTH - 50,
    borderRadius: getFontSize(1.5),
    overflow: 'hidden',
    zIndex: 999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 30,
    paddingRight: 10,
    paddingVertical: getFontSize(2),
  },
  textStyleToastSuccess: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToast: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
    textAlign: 'left',
    paddingRight: getFontSize(1),
    flex: 1,
  },
});

export default ToastComponent;
