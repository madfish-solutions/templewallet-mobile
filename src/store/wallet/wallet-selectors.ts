import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { AccountTypeEnum } from '../../enums/account-type.enum';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { walletAccountStateToWalletAccount } from '../../utils/wallet-account-state.utils';
import { getTezosToken } from '../../utils/wallet.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useAccountsListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(({ wallet }) =>
    wallet.accounts.map(walletAccountStateToWalletAccount)
  );

export const useHdAccountListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(({ wallet }) => {
    return wallet.accounts.filter(account => account.type === AccountTypeEnum.HD_ACCOUNT);
  });

export const useImportedAccountListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(({ wallet }) => {
    return wallet.accounts.filter(account => account.type === AccountTypeEnum.IMPORTED_ACCOUNT);
  });

export const useIsAuthorisedSelector = () => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.length > 0, [accounts.length]);
};

const useSelectedAccountStateSelector = (): WalletAccountStateInterface => {
  const { accounts, selectedAccountPublicKeyHash } = useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

  // TODO: OPTIMIZE SELECTED ACCOUNT SELECTOR ASAP
  return useMemo(
    () => ({
      ...initialWalletAccountState,
      ...accounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash)
    }),
    [accounts, selectedAccountPublicKeyHash]
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
  const getTokenMetadata = useTokenMetadataGetter();

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

  return useMemo(() => getTezosToken(balance), [balance]);
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);
