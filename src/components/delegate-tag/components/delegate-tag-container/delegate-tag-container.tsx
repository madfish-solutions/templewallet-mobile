import React, { FC } from 'react';
import { View } from 'react-native';

import { TokenInterface } from '../../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { useApyStyles } from '../../../token-screen-content-container/apy.styles';

import { useDelegateTagContainerStyles } from './delegate-tag-container.styles';

interface DelegateTagContainerProps {
  token: TokenInterface;
}

export const DelegateTagContainer: FC<DelegateTagContainerProps> = ({ token, children }) => {
  const styles = useDelegateTagContainerStyles();
  const apyStyles = useApyStyles();

  const tokenSlug = getTokenSlug(token);

  return children !== false ? <View style={[styles.apyContainer, apyStyles[tokenSlug]]}>{children}</View> : null;
};
