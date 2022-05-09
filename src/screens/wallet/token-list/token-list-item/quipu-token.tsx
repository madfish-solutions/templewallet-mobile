import React, { FC } from 'react';

import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { TokenInterface } from '../../../../token/interfaces/token.interface';
import { TokenListItem } from './token-list-item';
import { useQuipuApy } from './use-quipu-apy';

interface Props {
  token: TokenInterface;
}

export const QuipuToken: FC<Props> = ({ token }) => {
  const { navigate } = useNavigation();
  const { apy } = useQuipuApy();

  return <TokenListItem apy={apy} token={token} onPress={() => navigate(ScreensEnum.TokenScreen, { token })} />;
};
