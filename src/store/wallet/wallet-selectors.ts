import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { emptyWalletAccount } from '../../interfaces/wallet-account.interface';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { WalletRootState, WalletState } from './wallet-state';

export const useHdAccountsListSelector = () =>
  useSelector<WalletRootState, WalletState['hdAccounts']>(({ wallet }) => wallet.hdAccounts);

export const useIsAuthorisedSelector = () => useHdAccountsListSelector().length > 0;

export const useSelectedAccountSelector = () => {
  const { hdAccounts, selectedAccountPublicKeyHash } = useSelector<WalletRootState, WalletState>(
    ({ wallet }) => wallet
  );

  // TODO: OPTIMIZE SELECTED ACCOUNT SELECTOR ASAP
  return useMemo(
    () => hdAccounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ?? emptyWalletAccount,
    [hdAccounts, selectedAccountPublicKeyHash]
  );
};

export const useTokensMetadataSelector = () =>
  useSelector<WalletRootState, WalletState['tokensMetadata']>(({ wallet }) => wallet.tokensMetadata);

export const useTokensListSelector = (): TokenInterface[] => {
  const selectedAccountTokensList = useSelectedAccountSelector().tokensList;
  const tokensMetadata = useTokensMetadataSelector();

  const [tokensList, setTokensList] = useState<TokenInterface[]>([]);

  useEffect(
    () =>
      setTokensList(
        selectedAccountTokensList.map(({ slug, balance, isVisible }) => ({
          balance,
          isVisible,
          ...(tokensMetadata[slug] ?? emptyTokenMetadata)
        }))
      ),
    [selectedAccountTokensList, tokensMetadata]
  );

  return tokensList;
};

export const useVisibleTokensListSelector = () => {
  const tokensList = useTokensListSelector();

  return useMemo(() => tokensList.filter(({ isVisible }) => isVisible), [tokensList]);
};

export const useTezosBalanceSelector = () => useSelectedAccountSelector().tezosBalance.data;

export const useTezosAssetSelector = () => {
  const balance = useTezosBalanceSelector();

  return {
    ...emptyToken,
    ...TEZ_TOKEN_METADATA,
    balance
  };
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);

export const useEstimationsSelector = () =>
  useSelector<WalletRootState, WalletState['estimations']>(({ wallet }) => wallet.estimations);
