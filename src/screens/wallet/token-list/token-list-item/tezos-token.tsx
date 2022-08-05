import React, { FC } from 'react';

import { delegationApy } from '../../../../config/general';
import { useGasToken } from '../../../../hooks/use-gas-token.hook';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { useSelectedAccountTezosTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { TokenListItem } from './token-list-item';

export const TezosToken: FC = () => {
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const { navigate } = useNavigation();
  const { isDcpNode } = useGasToken();

  return (
    <TokenListItem
      token={tezosToken}
      apy={isDcpNode ? undefined : delegationApy}
      onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
    />
  );
};
