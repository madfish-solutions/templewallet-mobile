import React, { FC } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleProp, ViewStyle } from 'react-native';

import { isIOS } from '../../config/system';
import { conditionalStyle } from '../../utils/conditional-style';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props {
  isFullScreenMode?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, style, contentContainerStyle, children }) => {
  const styles = useScreenContainerStyles();

  return (
    <KeyboardAvoidingView style={[styles.scrollView, style]} {...(isIOS && { behavior: 'padding' })}>
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
