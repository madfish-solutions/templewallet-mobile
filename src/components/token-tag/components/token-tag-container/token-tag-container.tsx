import React from 'react';
import { View } from 'react-native';

import { useApyStyles } from 'src/components/token-screen-content-container/apy.styles';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { useTokenTagContainerStyles } from './token-tag-container.styles';

interface DelegateTagContainerProps {
  token: TokenInterface;
  scam?: boolean;
}

export const TokenTagContainer: FCWithChildren<DelegateTagContainerProps> = ({ token, scam, children }) => {
  const styles = useTokenTagContainerStyles();
  const apyStyles = useApyStyles();

  const tokenSlug = getTokenSlug(token);

  return children !== false ? (
    <View style={[styles.apyContainer, scam && styles.scam, apyStyles[tokenSlug]]}>{children}</View>
  ) : null;
};
