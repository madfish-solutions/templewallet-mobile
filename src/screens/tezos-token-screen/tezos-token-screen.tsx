import React from 'react';

import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { useSelectedAccountSelector, useTezosBalanceSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';

export const TezosTokenScreen = () => {
  const tezosBalance = useTezosBalanceSelector();
  const selectedAccount = useSelectedAccountSelector();

  return (
    <>
      <HeaderCard>
        <TokenEquityValue balance={tezosBalance} symbol={XTZ_TOKEN_METADATA.symbol} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons />
      </HeaderCard>
    </>
  );
};
