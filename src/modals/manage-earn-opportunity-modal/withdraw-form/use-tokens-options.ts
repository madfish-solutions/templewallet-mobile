import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { catchError, from, of } from 'rxjs';

import { calculateUnstakeParams as calculateLbUnstakeParams } from 'src/apis/liquidity-baking';
import { estimateDivestOneCoinOutputs as estimateStableswapDivestOutputs } from 'src/apis/quipuswap-staking';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { isDefined } from 'src/utils/is-defined';

import { WithdrawTokenOption } from './use-withdraw-formik';

export const useTokensOptions = (earnOpportunityItem: EarnOpportunity, lpAmount?: BigNumber) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunityItem);
  const tezos = useReadOnlyTezosToolkit();
  const [atomicAmounts, setAtomicAmounts] = useState<(BigNumber | null | undefined)[]>();
  const prevLpAmountRef = useRef(lpAmount);
  const slippageTolerance = useSlippageSelector();

  useEffect(() => {
    const prevLpAmount = prevLpAmountRef.current;
    prevLpAmountRef.current = lpAmount;
    const emptyAmounts = earnOpportunityItem.tokens.map(() => undefined);

    if (!isDefined(lpAmount) || lpAmount.isZero()) {
      setAtomicAmounts(emptyAmounts);

      return;
    }

    if (!lpAmount.isEqualTo(prevLpAmount ?? 0)) {
      setAtomicAmounts(emptyAmounts);
    }

    let outputPromise: Promise<Array<BigNumber | nullish>>;
    const tokensIndexes = earnOpportunityItem.tokens.map((_, index) => index);

    switch (earnOpportunityItem.type) {
      case EarnOpportunityTypeEnum.STABLESWAP:
        outputPromise = estimateStableswapDivestOutputs(
          tezos,
          earnOpportunityItem.stakedToken.contractAddress,
          tokensIndexes,
          lpAmount,
          earnOpportunityItem.stakedToken.fa2TokenId ?? 0
        );
        break;
      case EarnOpportunityTypeEnum.LIQUIDITY_BAKING:
        outputPromise = calculateLbUnstakeParams(
          tokensIndexes,
          lpAmount,
          slippageTolerance,
          tezos.rpc.getRpcUrl()
        ).then(params => params.map(({ outputAfterFeeAtomic }) => outputAfterFeeAtomic));
        break;
      default:
        outputPromise = Promise.resolve([lpAmount]);
    }
    const subscription = from(outputPromise)
      .pipe(
        catchError(error => {
          showErrorToastByError(error);

          return of(undefined);
        })
      )
      .subscribe(value => setAtomicAmounts(value));

    return () => subscription.unsubscribe();
  }, [earnOpportunityItem, lpAmount, tezos, slippageTolerance]);

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
