import React, { FC } from 'react';

import { delegationApy } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TokenListItem } from './token-list-item';

export const TezosToken: FC = () => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const [, isBakerSelected] = useSelectedBakerSelector();
  const { navigate } = useNavigation();
  const { isTezosNode } = useNetworkInfo();

  return (
    <TokenListItem
      token={tezosToken}
      apy={isTezosNode && isBakerSelected ? delegationApy : undefined}
      onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
    />
  );
};
