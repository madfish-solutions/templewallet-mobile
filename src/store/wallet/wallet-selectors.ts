import { useSelector } from 'react-redux';

import { WalletRootState, WalletState } from './wallet-state';

export const useWalletSelector = () => useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

export const useIsAuthorisedSelector = () => useWalletSelector().hdAccounts.length > 0;

export const useSelectedAccountSelector = () => useWalletSelector().selectedAccount;
