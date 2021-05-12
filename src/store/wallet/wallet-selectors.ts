import { useSelector } from 'react-redux';

import { initialAccountSettings } from '../../interfaces/account-settings.interface';
import { emptyAccount } from '../../interfaces/account.interface';
import { emptyTokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { tokenToTokenSlug } from '../../token/utils/token.utils';
import { WalletRootState, WalletState } from './wallet-state';

const useWalletSelector = () => useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

export const useHdAccountsListSelector = () => useWalletSelector().hdAccounts;

export const useIsAuthorisedSelector = () => useHdAccountsListSelector().length > 0;

export const useSelectedAccountSelector = () => {
  const { hdAccounts, selectedAccountPublicKeyHash } = useWalletSelector();

  return (
    hdAccounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ?? {
      ...emptyAccount,
      ...initialAccountSettings
    }
  );
};

export const useTokensListSelector = (): TokenInterface[] => {
  const selectedAccountTokensList = useSelectedAccountSelector().tokensList;
  const tokensMetadataList = useWalletSelector().tokensMetadataList;

  return selectedAccountTokensList.map(({ slug, balance, isShown }) => ({
    balance,
    isShown,
    ...(tokensMetadataList.find(token => tokenToTokenSlug(token) === slug) ?? emptyTokenMetadataInterface)
  }));
};
export const useTezosBalanceSelector = () => useSelectedAccountSelector().tezosBalance.data;
