import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { isTooLowTezBalanceError } from 'src/utils/is-too-low-tez-balance-error';

export const shouldShowOnRampForError = (error: unknown, tezosBalance: string): boolean => {
  const cause = error instanceof AnalyticsError ? error.error : error;

  return tezosBalance === '0' || isTooLowTezBalanceError(cause);
};
