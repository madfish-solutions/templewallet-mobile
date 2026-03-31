import { useSelector } from '../selector';
import { useCurrentAccountPkhSelector } from '../wallet/wallet-selectors';

import { initialSaplingAccountState, SaplingAccountState } from './sapling-state';

const useSaplingAccountState = (): SaplingAccountState => {
  const pkh = useCurrentAccountPkhSelector();

  return useSelector(({ sapling }) => (pkh ? sapling.accountsRecord[pkh] : undefined) ?? initialSaplingAccountState);
};

export const useSaplingAddressSelector = () => useSaplingAccountState().saplingAddress;
export const useShieldedBalanceSelector = () => useSaplingAccountState().shieldedBalance;
export const useSaplingTransactionHistorySelector = () => useSaplingAccountState().transactionHistory;
export const useIsSaplingHistoryLoadingSelector = () => useSaplingAccountState().isHistoryLoading;
export const useHasSeenAnnouncementSelector = () => useSelector(({ sapling }) => sapling.hasSeenAnnouncement);
export const useIsSaplingPreparingSelector = () => useSelector(({ sapling }) => sapling.isPreparing);
export const usePreparedOpParamsSelector = () => useSelector(({ sapling }) => sapling.preparedOpParams);
