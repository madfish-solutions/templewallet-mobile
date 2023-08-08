import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { catchError, from, of } from 'rxjs';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { estimateDivestOneCoinOutputs as estimateStableswapDivestOutputs } from 'src/apis/quipuswap-staking';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { Farm } from 'src/types/farm';
import { getTaquitoRpcErrorMessage } from 'src/utils/get-taquito-rpc-error-message';
import { isDefined } from 'src/utils/is-defined';

import { WithdrawTokenOption } from './use-withdraw-formik';

export const useTokensOptions = (farm: Farm, lpAmount?: BigNumber) => {
  const { stakeTokens } = useFarmTokens(farm);
  const tezos = useReadOnlyTezosToolkit();
  const [atomicAmounts, setAtomicAmounts] = useState<(BigNumber | null | undefined)[]>();
  const prevLpAmountRef = useRef(lpAmount);
  const slippageTolerance = useSlippageSelector();

  useEffect(() => {
    const prevLpAmount = prevLpAmountRef.current;
    prevLpAmountRef.current = lpAmount;
    const emptyAmounts = farm.tokens.map(() => undefined);

    if (!isDefined(lpAmount) || lpAmount.isZero()) {
      setAtomicAmounts(emptyAmounts);

      return;
    }

    if (!lpAmount.isEqualTo(prevLpAmount ?? 0)) {
      setAtomicAmounts(emptyAmounts);
    }

    const tokensIndexes = farm.tokens.map((_, index) => index);
    const outputPromise =
      farm.type === FarmPoolTypeEnum.LIQUIDITY_BAKING
        ? calculateUnstakeParams(tokensIndexes, lpAmount, slippageTolerance).then(params =>
            params.map(({ outputAfterFeeAtomic }) => outputAfterFeeAtomic)
          )
        : estimateStableswapDivestOutputs(
            tezos,
            farm.stakedToken.contractAddress,
            farm.tokens.map((_, index) => index),
            lpAmount,
            farm.stakedToken.fa2TokenId ?? 0
          );

    const subscription = from(outputPromise)
      .pipe(
        catchError(error => {
          showErrorToast({ description: getTaquitoRpcErrorMessage(error) });

          return of(undefined);
        })
      )
      .subscribe(value => setAtomicAmounts(value));

    return () => subscription.unsubscribe();
  }, [farm, lpAmount, tezos, slippageTolerance]);

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
