import React, { memo, useCallback } from 'react';

import { delegationApy } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TokenListItem } from './token-list-item';

export const TezosToken = memo(() => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const currentBaker = useSelectedBakerSelector();
  const navigateToScreen = useNavigateToScreen();
  const { isTezosNode } = useNetworkInfo();

  const onPress = useCallback(() => navigateToScreen({ screen: ScreensEnum.TezosTokenScreen }), [navigateToScreen]);

  return (
    <TokenListItem token={tezosToken} apy={isTezosNode && currentBaker ? delegationApy : undefined} onPress={onPress} />
  );
});
