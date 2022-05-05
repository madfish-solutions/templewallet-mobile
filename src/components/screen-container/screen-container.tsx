import React, { FC } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleProp, ViewStyle, StatusBar } from 'react-native';

import { isAndroid } from '../../config/system';
import { useHeaderHeight } from '../../hooks/use-header-height.hook';
import { TestIdProps } from '../../interfaces/test-id.props';
import { conditionalStyle } from '../../utils/conditional-style';
import { setTestID } from '../../utils/test-id.utils';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props extends TestIdProps {
  keyboardBehavior?: 'height' | 'padding' | 'position';
  isFullScreenMode?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: FC<Props> = ({
  keyboardBehavior = isAndroid ? 'height' : 'padding',
  isFullScreenMode = false,
  style,
  contentContainerStyle,
  children,
  testID
}) => {
  const styles = useScreenContainerStyles();
  const headerHeight = useHeaderHeight();
  const statusBarHeight = isAndroid ? StatusBar.currentHeight : 0;
  const keyboardVerticalOffset = headerHeight + (statusBarHeight ?? 0);

  return (
    <KeyboardAvoidingView
      style={[styles.scrollView, style]}
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={keyboardBehavior}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          conditionalStyle(isFullScreenMode, styles.fullScreenMode),
          contentContainerStyle
        ]}
        keyboardShouldPersistTaps="handled"
        {...setTestID(testID)}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
