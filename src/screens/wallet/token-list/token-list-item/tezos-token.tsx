import React, { FC } from 'react';

import { delegationApy } from '../../../../config/general';
import { useNetworkInfo } from '../../../../hooks/use-network-info.hook';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { useSelectedAccountTezosTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { TokenListItem } from './token-list-item';

export const TezosToken: FC = () => {
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const { navigate } = useNavigation();
  const { isDcpNode } = useNetworkInfo();

  return (
    <TokenListItem
      token={tezosToken}
      apy={isDcpNode ? undefined : delegationApy}
      onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
    />
  );
};
