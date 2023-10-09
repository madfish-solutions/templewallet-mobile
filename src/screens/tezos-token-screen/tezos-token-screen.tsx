import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from 'src/components/header-card/header-card';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from 'src/components/token-screen-content-container/token-screen-content-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadBakerRewardsListActions } from 'src/store/baking/baking-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TezosTokenHistory } from './tezos-token-history/tezos-token-history';
import { TezosTokenInfo } from './tezos-token-info/tezos-token-info';

export const TezosTokenScreen = () => {
  const dispatch = useDispatch();
  const accountPkh = useCurrentAccountPkhSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();

  usePageAnalytic(ScreensEnum.TezosTokenScreen);

  useEffect(() => void dispatch(loadBakerRewardsListActions.submit()), []);

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={tezosToken} />

        <PublicKeyHashText publicKeyHash={accountPkh} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons token={tezosToken} />
      </HeaderCard>

      <TokenScreenContentContainer
        historyComponent={<TezosTokenHistory />}
        infoComponent={<TezosTokenInfo />}
        token={tezosToken}
      />
    </>
  );
};
