import { useSelector } from 'react-redux';

import { AccountInterface } from '../../interfaces/account.interface';
import { WalletRootState, WalletState } from './wallet-state';

export const useWalletSelector = () => useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

export const useFirstAccountSelector = () =>
  useSelector<WalletRootState, AccountInterface>(({ wallet }) => wallet.hdAccounts[0]);

export const useIsAuthorisedSelector = () => useWalletSelector().hdAccounts.length > 0;
