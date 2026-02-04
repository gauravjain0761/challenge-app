import {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

// Hook to detect keyboard visibility
export const useKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardShow = (event: any) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0); // Reset height when keyboard is hidden
    };

    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        onKeyboardShow(e);
        setKeyboardVisible(true);
      },
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      _e => {
        onKeyboardHide();
        setKeyboardVisible(false);
      },
    );

    // Cleanup listeners on unmount
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return {keyboardHeight, keyboardVisible};
};
