import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from '../../components/token-screen-content-container/token-screen-content-container';
import { loadActivityGroupsActions } from '../../store/activity/activity-actions';
import { loadSelectedBakerActions } from '../../store/baking/baking-actions';
import { loadTezosBalanceActions } from '../../store/wallet/wallet-actions';
import { useSelectedAccountSelector, useTezosBalanceSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { accountPkh$ } from '../../utils/activity.utils';
import { TezosTokenHistory } from './tezos-token-history/tezos-token-history';
import { TezosTokenInfo } from './tezos-token-info/tezos-token-info';

export const TezosTokenScreen = () => {
  const dispatch = useDispatch();
  const tezosBalance = useTezosBalanceSelector();
  const selectedAccount = useSelectedAccountSelector();

  useEffect(() => {
    dispatch(loadTezosBalanceActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadSelectedBakerActions.submit(selectedAccount.publicKeyHash));
    accountPkh$.next(selectedAccount.publicKeyHash);
  }, []);

  return (
    <>
      <HeaderCard>
        <TokenEquityValue balance={tezosBalance} symbol={TEZ_TOKEN_METADATA.symbol} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons asset={TEZ_TOKEN_METADATA} />
      </HeaderCard>

      <TokenScreenContentContainer historyComponent={<TezosTokenHistory />} infoComponent={<TezosTokenInfo />} />
    </>
  );
};
