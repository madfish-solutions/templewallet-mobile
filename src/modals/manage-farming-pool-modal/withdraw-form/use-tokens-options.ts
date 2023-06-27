import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { from, switchMap } from 'rxjs';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { estimateWithdrawTokenOutput as estimateStableswapWithdrawTokenOutput } from 'src/apis/quipuswap-staking';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { Farm } from 'src/types/farm';
import { getTaquitoRpcErrorMessage } from 'src/utils/get-taquito-rpc-error-message';
import { isDefined } from 'src/utils/is-defined';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';

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

    const subscription = from(getReadOnlyContract(farm.stakedToken.contractAddress, tezos))
      .pipe(
        switchMap(stableswapContract => {
          const tokensIndexes = farm.tokens.map((_, index) => index);
          const outputPromise =
            farm.type === FarmPoolTypeEnum.LIQUIDITY_BAKING
              ? calculateUnstakeParams(tezos, tokensIndexes, lpAmount, slippageTolerance).then(
                  ({ outputTokenIndexDependentParams }) =>
                    outputTokenIndexDependentParams.map(
                      ({ swapOutputAtomic, directDivestOutputAtomic, routingFeeAtomic }) =>
                        swapOutputAtomic.plus(directDivestOutputAtomic).minus(routingFeeAtomic)
                    )
                )
              : estimateStableswapWithdrawTokenOutput(
                  tezos,
                  stableswapContract,
                  tokensIndexes,
                  lpAmount,
                  farm.stakedToken.fa2TokenId ?? 0
                );

          return from(
            outputPromise.catch(error => {
              showErrorToast({ description: getTaquitoRpcErrorMessage(error) });

              return undefined;
            })
          );
        })
      )
      .subscribe(value => setAtomicAmounts(value));

    return () => subscription.unsubscribe();
  }, [farm, lpAmount, tezos, slippageTolerance]);

  const options = useMemo(() => {
    const shouldFilterOutFailingOptions = isDefined(atomicAmounts) && atomicAmounts.some(amount => amount !== null);

    return stakeTokens.reduce<WithdrawTokenOption[]>((acc, token, index) => {
      const amount = atomicAmounts?.[index];
      if (!shouldFilterOutFailingOptions || amount !== null) {
        acc.push({ token, amount: amount ?? undefined });
      }

      return acc;
    }, []);
  }, [stakeTokens, atomicAmounts]);

  return options;
};
