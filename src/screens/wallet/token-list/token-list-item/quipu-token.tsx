import React, { FC } from 'react';

import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { useQuipuApySelector } from '../../../../store/d-apps/d-apps-selectors';
import { TokenInterface } from '../../../../token/interfaces/token.interface';
import { TokenListItem } from './token-list-item';

interface Props {
  token: TokenInterface;
}

export const QuipuToken: FC<Props> = ({ token }) => {
  const { navigate } = useNavigation();
  const quipuApy = useQuipuApySelector();

  return <TokenListItem apy={quipuApy} token={token} onPress={() => navigate(ScreensEnum.TokenScreen, { token })} />;
};
