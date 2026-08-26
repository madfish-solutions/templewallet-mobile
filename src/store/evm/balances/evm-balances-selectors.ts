import { useSelector } from '../../selector';

const EMPTY_EVM_CHAIN_BALANCES_RECORD: Record<string, string> = {};

export const useEvmAccountChainBalancesSelector = (
  account: HexString = '0x',
  chainId: number
): Record<string, string> =>
  useSelector(({ evmBalances }) => evmBalances.record[account]?.[chainId]) ?? EMPTY_EVM_CHAIN_BALANCES_RECORD;

export const useEvmAccountChainBalancesTimestampSelector = (
  account: HexString = '0x',
  chainId: number
): number | undefined => useSelector(({ evmBalances }) => evmBalances.timestamps[account]?.[chainId]);
