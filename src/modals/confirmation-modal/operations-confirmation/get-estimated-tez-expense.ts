import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { TEZ_TOKEN_DECIMALS } from 'src/token/data/tokens-metadata';
import { tzToMutez } from 'src/utils/tezos.util';

export const getEstimatedTezExpenseMutez = (
  opParams: ParamsWithKind[],
  gasFeeTez: BigNumber,
  storageLimit: BigNumber,
  costPerStorageByteMutez: number
): BigNumber =>
  opParams.reduce((total, opParam) => {
    if (opParam.kind !== OpKind.TRANSACTION) {
      return total;
    }

    const amount = new BigNumber(opParam.amount ?? 0);

    return total.plus(opParam.mutez ? amount : tzToMutez(amount, TEZ_TOKEN_DECIMALS));
  }, tzToMutez(gasFeeTez, TEZ_TOKEN_DECIMALS).plus(storageLimit.multipliedBy(costPerStorageByteMutez)));
