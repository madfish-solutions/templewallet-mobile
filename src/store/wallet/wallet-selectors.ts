import { useSelector } from 'react-redux';
import { WalletRootState, WalletState } from './wallet-state';

export const useWalletSelector = () => useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);
