import React, { RefObject, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isAndroid, isIOS } from 'src/config/system';
import { useHeaderHeight } from 'src/hooks/use-header-height.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { useScreenContainerStyles } from './screen-container.styles';

interface Props extends TestIdProps {
  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
  scrollViewRefreshControl?: ScrollViewProps['refreshControl'];
  isFullScreenMode?: boolean;
  scrollViewRef?: RefObject<ScrollView | null>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
}

export const ScreenContainer: FCWithChildren<Props> = ({
  keyboardBehavior = isAndroid ? 'height' : 'padding',
  scrollViewRefreshControl,
  isFullScreenMode = false,
  scrollViewRef,
  style,
  contentContainerStyle,
  scrollEnabled = true,
  children,
  testID
}) => {
  const [keyboardWasVisible, setKeyboardWasVisible] = useState(Keyboard.isVisible());
  const styles = useScreenContainerStyles();
  const headerHeight = useHeaderHeight();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const keyboardVerticalOffset = headerHeight + (keyboardWasVisible && isAndroid ? -topInset - bottomInset : 0);

  useEffect(() => {
    const showSub = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      setKeyboardWasVisible(true);
    });

    return () => {
      showSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.scrollView, style]}
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={keyboardBehavior}
    >
      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          conditionalStyle(isFullScreenMode, styles.fullScreenMode),
          contentContainerStyle
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={scrollViewRefreshControl}
        ref={scrollViewRef}
        {...setTestID(testID)}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
