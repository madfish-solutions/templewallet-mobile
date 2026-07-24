import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useHideBalance } from 'src/hooks/hide-balance/hide-balance.hook';

import { SafeTouchableOpacity } from '../safe-touchable-opacity';
import { TruncatedText } from '../truncated-text';

interface Props {
  wrapperStyle?: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  interactive?: boolean;
  testID?: string;
}

const hideSymbol = '•••••••';

export const HideBalance: FCWithChildren<Props> = ({
  wrapperStyle,
  textStyle,
  children,
  interactive = false,
  testID
}) => {
  const { isBalanceHidden, toggleHideBalance } = useHideBalance();

  return (
    <SafeTouchableOpacity onPress={interactive ? toggleHideBalance : undefined} style={wrapperStyle} testID={testID}>
      <TruncatedText style={textStyle}>{isBalanceHidden ? hideSymbol : children}</TruncatedText>
    </SafeTouchableOpacity>
  );
};
