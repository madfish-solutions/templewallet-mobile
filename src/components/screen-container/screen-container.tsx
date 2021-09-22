import React, { FC } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleProp, ViewStyle, StatusBar, Platform } from 'react-native';

import { isAndroid } from '../../config/system';
import { useHeaderHeight } from '../../hooks/use-header-height.hook';
import { conditionalStyle } from '../../utils/conditional-style';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props {
  isFullScreenMode?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, style, contentContainerStyle, children }) => {
  const styles = useScreenContainerStyles();
  const headerHeight = useHeaderHeight();
  const statusBarHeight = isAndroid ? StatusBar.currentHeight : 0;
  const keyboardVerticalOffset = headerHeight + (statusBarHeight ?? 0);

  return (
    <KeyboardAvoidingView
      style={[styles.scrollView, style]}
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          conditionalStyle(isFullScreenMode, styles.fullScreenMode),
          contentContainerStyle
        ]}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
