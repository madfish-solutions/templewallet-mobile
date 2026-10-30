import { BigNumber } from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

import { fetchFastWithdrawalProviders } from 'src/apis/temple-wallet';
import { TEZ_TOKEN_DECIMALS } from 'src/token/data/tokens-metadata';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import {
  getFastWithdrawalAmountRanges,
  getFastWithdrawalReceiveMutez,
  pickFastWithdrawalProvider
} from 'src/utils/etherlink-bridge/fast-withdrawal';
import { formatAssetAmount, isPositiveNumber } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

export const FAST_WITHDRAWAL_UNAVAILABLE_MESSAGE = 'Fast withdrawals are unavailable right now. Try again later.';

export interface FastWithdrawalQuote {
  feeRate: BigNumber;
  receiveMutez: BigNumber;
}

const formatTez = (mutez: BigNumber.Value) => formatAssetAmount(mutezToTz(new BigNumber(mutez), TEZ_TOKEN_DECIMALS));

export const useFastWithdrawalQuote = (enabled: boolean, amountMutez: BigNumber | undefined) => {
  const {
    data: providers,
    error,
    mutate
  } = useSWR(enabled ? 'fast-withdrawal-providers' : null, fetchFastWithdrawalProviders, {
    dedupingInterval: 60_000,
    refreshInterval: 60_000,
    revalidateOnFocus: false
  });

  const amountRanges = useMemo(() => providers && getFastWithdrawalAmountRanges(providers), [providers]);
  const provider = useMemo(
    () => (amountMutez && providers ? pickFastWithdrawalProvider(providers, amountMutez) : undefined),
    [amountMutez, providers]
  );
  const receiveMutez = useMemo(
    () => (amountMutez && provider ? getFastWithdrawalReceiveMutez(amountMutez, provider.rate) : undefined),
    [amountMutez, provider]
  );

  const errorMessage = useMemo(() => {
    if (!enabled) {
      return undefined;
    }

    if ((error && providers === undefined) || amountRanges?.length === 0) {
      return FAST_WITHDRAWAL_UNAVAILABLE_MESSAGE;
    }

    if (amountRanges && isPositiveNumber(amountMutez) && !provider) {
      const rangesText = amountRanges
        .map(
          ({ minAmountMutez, maxAmountMutez }) =>
            `between ${formatTez(minAmountMutez)} and ${formatTez(maxAmountMutez)}`
        )
        .join(' or ');

      return `Amount must be ${rangesText} ${ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol}`;
    }

    return undefined;
  }, [enabled, error, providers, amountRanges, amountMutez, provider]);

  const fetchFreshQuote = useCallback(
    async (amount: BigNumber): Promise<FastWithdrawalQuote | undefined> => {
      const freshProviders = await fetchFastWithdrawalProviders();
      void mutate(freshProviders, { revalidate: false });

      const freshProvider = pickFastWithdrawalProvider(freshProviders, amount);

      return (
        freshProvider && {
          feeRate: freshProvider.rate,
          receiveMutez: getFastWithdrawalReceiveMutez(amount, freshProvider.rate)
        }
      );
    },
    [mutate]
  );

  return { feeRate: provider?.rate, receiveMutez, errorMessage, fetchFreshQuote };
};
