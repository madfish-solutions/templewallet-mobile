import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';
import {
  AbiFunction,
  DecodeFunctionDataReturnType,
  PublicClient,
  SimulateContractReturnType,
  TransactionSerializable,
  decodeFunctionData
} from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

import { detectTokenStandard } from '../common.utils';
import { EvmAssetStandard } from '../types';

export type TxEssentials = Pick<TransactionSerializable, 'to' | 'data' | 'value'>;

export type AssetsAmounts = StringRecord<{
  atomicAmount: BigNumber;
  standard: EvmAssetStandard;
  /** Present for transfer-like deltas: the recipient address. */
  receiver?: HexString;
}>;

export type Approval = {
  assetSlug: string;
  spender: HexString;
  amount: BigNumber;
  standard: EvmAssetStandard.ERC20 | EvmAssetStandard.ERC721;
};

export const stripZeroBalancesChanges = (balancesChanges: AssetsAmounts) =>
  Object.fromEntries(Object.entries(balancesChanges).filter(([, { atomicAmount }]) => !atomicAmount.isZero()));

export const toBigNumber = (value: number | string | bigint) => new BigNumber(value);

const makeTargetIsOfStandardFn = (standard: EvmAssetStandard) =>
  memoizee(
    async (tx: ContractCallTransaction, network: EvmNetworkEssentials) => {
      const standardDetected = await detectTokenStandard(network, tx.to);

      return standardDetected === standard;
    },
    { max: 10000, normalizer: args => `${args[0].to}_${args[1].chainId}`, promise: true }
  );

export const targetIsErc20 = makeTargetIsOfStandardFn(EvmAssetStandard.ERC20);
export const targetIsErc721 = makeTargetIsOfStandardFn(EvmAssetStandard.ERC721);

export type TxAbiFragment = AbiFunction & { stateMutability: 'nonpayable' | 'payable' };

interface ParseCallbackInput<AbiFragment extends TxAbiFragment> {
  args: DecodeFunctionDataReturnType<[AbiFragment]>['args'];
  simulateOperation: () => Promise<SimulateContractReturnType<[AbiFragment]>['result']>;
  readContract: PublicClient['readContract'];
  sender: HexString;
  to: HexString;
}

export type ParseCallback<AbiFragment extends TxAbiFragment, Result> = (
  input: ParseCallbackInput<AbiFragment>
) => Promise<Result>;

type ContractCallTransaction = TransactionSerializable & { data: HexString; to: HexString };

export const isContractCallTransaction = (tx: TransactionSerializable): tx is ContractCallTransaction =>
  Boolean(tx.data && tx.data !== '0x' && tx.to);

export const makeAbiFunctionHandler = <AbiFragment extends TxAbiFragment, Result>(
  fragment: AbiFragment,
  onParse: ParseCallback<AbiFragment, Result>,
  applicabilityPredicate?: (tx: ContractCallTransaction, network: EvmNetworkEssentials) => Promise<boolean>
) => {
  return async (tx: ContractCallTransaction, sender: HexString, network: EvmNetworkEssentials) => {
    try {
      if (applicabilityPredicate && !(await applicabilityPredicate(tx, network))) {
        return null;
      }

      const args = decodeFunctionData({ abi: [fragment], data: tx.data }).args;
      const client = getViemPublicClient(network);
      const simulateOperation = async () => {
        // @ts-expect-error
        const { result } = await client.simulateContract({
          account: sender,
          abi: [fragment],
          functionName: fragment.name,
          args,
          address: tx.to
        });

        return result;
      };

      return await onParse({
        args,
        simulateOperation,
        readContract: client.readContract.bind(client),
        sender,
        to: tx.to
      });
    } catch {
      return null;
    }
  };
};
