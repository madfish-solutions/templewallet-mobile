import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTokenMetadata } from '../../hooks/use-token-metadata.hook';
import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { walletAccountStateToWalletAccount } from '../../utils/wallet-account-state.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useHdAccountsListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(({ wallet }) =>
    wallet.hdAccounts.map(walletAccountStateToWalletAccount)
  );

export const useIsAuthorisedSelector = () => {
  const hdAccounts = useHdAccountsListSelector();

  return useMemo(() => hdAccounts.length > 0, [hdAccounts.length]);
};

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

export const useSelectedAccountSelector = (): WalletAccountInterface => {
  const selectedAccountState = useSelectedAccountStateSelector();

  return useMemo(() => walletAccountStateToWalletAccount(selectedAccountState), [selectedAccountState]);
};

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
  const { getTokenMetadata } = useTokenMetadata();

  const [tokensList, setTokensList] = useState<TokenInterface[]>([]);

  useEffect(
    () =>
      setTokensList(
        selectedAccountTokensList.map(({ slug, balance, isVisible }) => ({
          balance,
          isVisible,
          ...getTokenMetadata(slug)
        }))
      ),
    [selectedAccountTokensList, getTokenMetadata]
  );

  return tokensList;
};

export const useVisibleTokensListSelector = () => {
  const tokensList = useTokensListSelector();

  return useMemo(() => tokensList.filter(({ isVisible }) => isVisible), [tokensList]);
};

export const useTezosTokenSelector = (): TokenInterface => {
  const balance = useSelectedAccountSelector().tezosBalance.data;

  return useMemo(
    () => ({
      ...emptyToken,
      ...TEZ_TOKEN_METADATA,
      balance
    }),
    [balance]
  );
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);
