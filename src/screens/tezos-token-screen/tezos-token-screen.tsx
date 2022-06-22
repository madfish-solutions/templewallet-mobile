import React from 'react';

import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from '../../components/token-screen-content-container/token-screen-content-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useSelectedAccountSelector, useSelectedAccountTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { TezosTokenHistory } from './tezos-token-history/tezos-token-history';
import { TezosTokenInfo } from './tezos-token-info/tezos-token-info';

export const TezosTokenScreen = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();

  usePageAnalytic(ScreensEnum.TezosTokenScreen);

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={tezosToken} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

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
