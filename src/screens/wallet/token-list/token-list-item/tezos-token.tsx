import React, { memo, useCallback } from 'react';

import { delegationApy } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TokenListItem } from './token-list-item';

export const TezosToken = memo(() => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const currentBaker = useSelectedBakerSelector();
  const { navigate } = useNavigation();
  const { isTezosNode } = useNetworkInfo();

  const onPress = useCallback(() => navigate(ScreensEnum.TezosTokenScreen), [navigate]);

  return (
    <TokenListItem token={tezosToken} apy={isTezosNode && currentBaker ? delegationApy : undefined} onPress={onPress} />
  );
});
