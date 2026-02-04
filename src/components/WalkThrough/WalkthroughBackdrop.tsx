import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Colors} from '@/constants/Colors';

interface WalkthroughBackdropProps {
  isVisible: boolean;
  highlightedArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  backdropColor?: string;
  onBackdropPress?: () => void;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const WalkthroughBackdrop: React.FC<WalkthroughBackdropProps> = ({
  isVisible,
  highlightedArea,
  backdropColor = 'rgba(0, 0, 0, 0.7)',
  onBackdropPress,
}) => {
  if (!isVisible) return null;

  const renderMask = () => {
    if (!highlightedArea) {
      // Full screen backdrop if no highlighted area
      return (
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View
            style={[styles.fullBackdrop, {backgroundColor: backdropColor}]}
          />
        </TouchableWithoutFeedback>
      );
    }

    const {x, y, width, height} = highlightedArea;

    return (
      <>
        {/* Top area */}
        {y > 0 && (
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View
              style={[
                styles.maskPiece,
                {
                  top: 0,
                  left: 0,
                  width: screenWidth,
                  height: y,
                  backgroundColor: backdropColor,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Left area */}
        {x > 0 && (
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View
              style={[
                styles.maskPiece,
                {
                  top: y,
                  left: 0,
                  width: x,
                  height: height,
                  backgroundColor: backdropColor,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Right area */}
        {x + width < screenWidth && (
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View
              style={[
                styles.maskPiece,
                {
                  top: y,
                  left: x + width,
                  width: screenWidth - (x + width),
                  height: height,
                  backgroundColor: backdropColor,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Bottom area */}
        {y + height < screenHeight && (
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View
              style={[
                styles.maskPiece,
                {
                  top: y + height,
                  left: 0,
                  width: screenWidth,
                  height: screenHeight - (y + height),
                  backgroundColor: backdropColor,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Highlighted area border (optional) */}
        {/* <View
          style={[
            styles.highlightBorder,
            {
              top: y - 2,
              left: x - 2,
              width: width + 4,
              height: height + 4,
            },
          ]}
        /> */}
      </>
    );
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {renderMask()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998, // Below overlay but above content
  },
  fullBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  maskPiece: {
    position: 'absolute',
  },
  highlightBorder: {
    position: 'absolute',
    borderWidth: 2,
    // borderColor: Colors.orange,
    borderRadius: 4,
    pointerEvents: 'none',
  },
});

export default WalkthroughBackdrop;
