import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { catchError, from, of } from 'rxjs';

import { estimateDivestOneCoinOutputs } from 'src/apis/quipuswap-staking';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

import { WithdrawTokenOption } from './use-withdraw-formik';

export const useTokensOptions = (earnOpportunityItem: EarnOpportunity, lpAmount?: BigNumber) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunityItem);
  const tezos = useReadOnlyTezosToolkit();
  const [atomicAmounts, setAtomicAmounts] = useState<(BigNumber | null | undefined)[]>();

  useEffect(() => {
    if (!isDefined(lpAmount) || lpAmount.isZero()) {
      setAtomicAmounts(earnOpportunityItem.tokens.map(() => undefined));

      return;
    }

    const observable = isFarm(earnOpportunityItem)
      ? from(
          estimateDivestOneCoinOutputs(
            tezos,
            earnOpportunityItem.stakedToken.contractAddress,
            earnOpportunityItem.tokens.map((_, index) => index),
            lpAmount,
            earnOpportunityItem.stakedToken.fa2TokenId ?? 0
          )
        )
      : of([lpAmount]);
    const subscription = observable
      .pipe(
        catchError(error => {
          showErrorToastByError(error);

          return of(undefined);
        })
      )
      .subscribe(value => setAtomicAmounts(value));

    return () => subscription.unsubscribe();
  }, [earnOpportunityItem, lpAmount, tezos]);

  const options = useMemo(() => {
    const shouldFilterOutFailingOptions = isDefined(atomicAmounts) && atomicAmounts.some(amount => amount !== null);

    return stakeTokens.reduce<WithdrawTokenOption[]>((acc, token, index) => {
      const amount = atomicAmounts?.[index];
      if ((!shouldFilterOutFailingOptions || amount !== null) && (!isDefined(amount) || amount.gt(0))) {
        acc.push({ token, amount: amount ?? undefined });
      }

      return acc;
    }, []);
  }, [stakeTokens, atomicAmounts]);

  return options;
};
