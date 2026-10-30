import { packDataBytes } from '@taquito/michel-codec';
import { BigNumber } from 'bignumber.js';
import { encodeFunctionData, parseAbi } from 'viem';

import { FastWithdrawalProvider } from 'src/apis/temple-wallet';
import {
  ETHERLINK_FAST_WITHDRAWAL_CONTRACT_ADDRESS,
  ETHERLINK_XTZ_PRECOMPILE_ADDRESS
} from 'src/config/etherlink-bridge';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';

type FastWithdrawalAmountRange = Pick<FastWithdrawalProvider, 'minAmountMutez' | 'maxAmountMutez'>;

const MUTEZ_TO_WEI = 10n ** 12n;

const xtzPrecompileAbi = parseAbi([
  'function fast_withdraw_base58(string target, string fast_withdrawal_contract, bytes payload) payable'
]);

export const getFastWithdrawalAmountRanges = (providers: FastWithdrawalProvider[]) =>
  providers
    .map(({ minAmountMutez, maxAmountMutez }): FastWithdrawalAmountRange => ({ minAmountMutez, maxAmountMutez }))
    .sort((a, b) => a.minAmountMutez.comparedTo(b.minAmountMutez) ?? 0)
    .reduce<FastWithdrawalAmountRange[]>((ranges, range) => {
      const last = ranges.at(-1);

      if (last && range.minAmountMutez.isLessThanOrEqualTo(last.maxAmountMutez)) {
        return [
          ...ranges.slice(0, -1),
          {
            minAmountMutez: last.minAmountMutez,
            maxAmountMutez: BigNumber.max(last.maxAmountMutez, range.maxAmountMutez)
          }
        ];
      }

      return [...ranges, range];
    }, []);

export const pickFastWithdrawalProvider = (providers: FastWithdrawalProvider[], amountMutez: BigNumber) =>
  providers
    .filter(
      ({ minAmountMutez, maxAmountMutez }) =>
        amountMutez.isGreaterThanOrEqualTo(minAmountMutez) && amountMutez.isLessThanOrEqualTo(maxAmountMutez)
    )
    .reduce<FastWithdrawalProvider | undefined>(
      (best, provider) => (best && best.rate.isLessThanOrEqualTo(provider.rate) ? best : provider),
      undefined
    );

export const getFastWithdrawalReceiveMutez = (amountMutez: BigNumber, rate: BigNumber) =>
  amountMutez.times(new BigNumber(1).minus(rate)).integerValue(BigNumber.ROUND_FLOOR);

export const weiToMutez = (wei: BigNumber) => wei.dividedToIntegerBy(MUTEZ_TO_WEI.toString());

export const buildFastWithdrawRequest = (
  tezosAddress: string,
  amountMutez: bigint,
  receiveMutez: bigint
): EvmTransactionRequest => ({
  to: ETHERLINK_XTZ_PRECOMPILE_ADDRESS,
  value: amountMutez * MUTEZ_TO_WEI,
  data: encodeFunctionData({
    abi: xtzPrecompileAbi,
    functionName: 'fast_withdraw_base58',
    args: [
      tezosAddress,
      ETHERLINK_FAST_WITHDRAWAL_CONTRACT_ADDRESS,
      `0x${packDataBytes({ int: receiveMutez.toString() }, { prim: 'nat' }).bytes}`
    ]
  })
});
