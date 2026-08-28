import { MAX_SYNCED_HD_ACCOUNTS } from 'src/config/wallet.const';

export const getHdAccountsLengthForImport = (value: unknown): number | undefined => {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    return undefined;
  }

  return Math.min(value, MAX_SYNCED_HD_ACCOUNTS);
};
