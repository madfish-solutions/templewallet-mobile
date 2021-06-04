import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { emptyTokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { findSelectedAccount } from '../../utils/wallet-account.utils';
import { WalletRootState, WalletState } from './wallet-state';

const useWalletSelector = () => useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

export const useHdAccountsListSelector = () => useWalletSelector().hdAccounts;

export const useIsAuthorisedSelector = () => useHdAccountsListSelector().length > 0;

export const useSelectedAccountSelector = () => {
  const { hdAccounts, selectedAccountPublicKeyHash } = useWalletSelector();

  return findSelectedAccount(hdAccounts, selectedAccountPublicKeyHash);
};

export const useTokensListSelector = (): TokenInterface[] => {
  const selectedAccountTokensList = useSelectedAccountSelector().tokensList;
  const tokensMetadata = useWalletSelector().tokensMetadata;

  const [tokensList, setTokensList] = useState<TokenInterface[]>([]);

  useEffect(
    () =>
      setTokensList(
        selectedAccountTokensList.map(({ slug, balance, isVisible }) => ({
          balance,
          isVisible,
          ...(tokensMetadata[slug] ?? emptyTokenMetadataInterface)
        }))
      ),
    [selectedAccountTokensList, tokensMetadata]
  );

  return tokensList;
};

export const usePendingOperationsSelector = () => {
  const toofta1 = useWalletSelector();

  return toofta1.pendingOperations;
};

export const useCompletedOperationsSelector = () => useWalletSelector().completedOperations;

export const useConfirmationErrorOperationsSelector = () => useWalletSelector().confirmationErrorOperations;

export const useVisibleTokensListSelector = () => {
  const tokensList = useTokensListSelector();

  return useMemo(() => tokensList.filter(({ isVisible }) => isVisible), [tokensList]);
};

export const useTezosBalanceSelector = () => useSelectedAccountSelector().tezosBalance.data;

export const useAddTokenSuggestion = () => useWalletSelector().addTokenSuggestion.data;
