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

  return selectedAccountTokensList.map(({ slug, balance, isShown }) => ({
    balance,
    isShown,
    ...(tokensMetadata[slug] ?? emptyTokenMetadataInterface)
  }));
};
export const useTezosBalanceSelector = () => useSelectedAccountSelector().tezosBalance.data;
