import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { walletAccountStateToWalletAccount } from '../../utils/wallet-account-state.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useHdAccountsListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(({ wallet }) =>
    wallet.hdAccounts.map(walletAccountStateToWalletAccount)
  );

export const useIsAuthorisedSelector = () => useHdAccountsListSelector().length > 0;

const useSelectedAccountStateSelector = (): WalletAccountStateInterface => {
  const { hdAccounts, selectedAccountPublicKeyHash } = useSelector<WalletRootState, WalletState>(
    ({ wallet }) => wallet
  );

  // TODO: OPTIMIZE SELECTED ACCOUNT SELECTOR ASAP
  return useMemo(
    () => ({
      ...initialWalletAccountState,
      ...hdAccounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash)
    }),
    [hdAccounts, selectedAccountPublicKeyHash]
  );
};

export const useSelectedAccountSelector = (): WalletAccountInterface =>
  walletAccountStateToWalletAccount(useSelectedAccountStateSelector());

export const useActivityGroupsSelector = () => {
  const pendingActivityGroups = useSelectedAccountStateSelector().pendingActivities;
  const appliedActivityGroups = useSelectedAccountStateSelector().activityGroups.data;

  return useMemo(
    () => [...pendingActivityGroups, ...appliedActivityGroups],
    [pendingActivityGroups, appliedActivityGroups]
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

export const useTezosTokenSelector = (): TokenInterface => {
  const balance = useSelectedAccountSelector().tezosBalance.data;

  return {
    ...emptyToken,
    ...TEZ_TOKEN_METADATA,
    balance
  };
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);
