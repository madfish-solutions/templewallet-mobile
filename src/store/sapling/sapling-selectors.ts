import { Account } from 'src/interfaces/account.interfaces.ts';
import { getAccountAddressForTezos } from 'src/utils/account.utils.ts';

import { useSelector } from '../selector';
import { useAccountAddressForTezos } from '../wallet/wallet-selectors';

import { initialSaplingAccountState, SaplingAccountState } from './sapling-state';

const useSaplingAccountState = (): SaplingAccountState => {
  const pkh = useAccountAddressForTezos();

  return useSelector(({ sapling }) => (pkh ? sapling.accountsRecord[pkh] : undefined) ?? initialSaplingAccountState);
};

export const useSaplingAddressForAccount = (account: Account) => {
  const tezosAddress = getAccountAddressForTezos(account);

  return useSelector(({ sapling }) =>
    tezosAddress ? sapling.accountsRecord[tezosAddress]?.saplingAddress : undefined
  );
};

export const useSaplingAddressSelector = () => useSaplingAccountState().saplingAddress;
export const useShieldedBalanceSelector = () => useSaplingAccountState().shieldedBalance;
export const useIsSaplingCredentialsLoadedSelector = () => useSaplingAccountState().isCredentialsLoaded;
export const useIsSaplingBalanceLoadingSelector = () => useSaplingAccountState().isBalanceLoading;
export const useSaplingTransactionHistorySelector = () => useSaplingAccountState().transactionHistory;
export const useIsSaplingHistoryLoadingSelector = () => useSaplingAccountState().isHistoryLoading;
export const useHasSeenAnnouncementSelector = () => useSelector(({ sapling }) => sapling.hasSeenAnnouncement);
export const useIsSaplingPreparingSelector = () => useSelector(({ sapling }) => sapling.isPreparing);
export const usePreparedOpParamsSelector = () => useSelector(({ sapling }) => sapling.preparedOpParams);
