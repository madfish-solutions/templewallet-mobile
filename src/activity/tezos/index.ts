import { BigNumber } from 'bignumber.js';

import {
  ETHERLINK_BRIDGE_EXCHANGER_ADDRESS,
  ETHERLINK_BRIDGE_HELPER_ADDRESS,
  ETHERLINK_FAST_WITHDRAWAL_CONTRACT_ADDRESS,
  ETHERLINK_ROLLUP_ADDRESS
} from 'src/config/etherlink-bridge';
import { SAPLING_CONTRACT_ADDRESS } from 'src/config/sapling';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isKTAddress } from 'src/utils/tezos.util';

import {
  ActivityOperKindEnum,
  ActivityOperTransferType,
  ActivityStatus,
  TezosActivity,
  TezosOperation
} from '../types';

import { preparseTezosOperationsGroup } from './pre-parse';
import type { TempleTzktOperationsGroup, TezosPreActivityOperation, TezosPreActivityStatus } from './types';

export function parseTezosOperationsGroup(
  operationsGroup: TempleTzktOperationsGroup,
  chainId: string,
  address: string
): TezosActivity | null {
  const preActivity = preparseTezosOperationsGroup(operationsGroup, address, chainId);

  if (preActivity == null) return null;

  const { hash, addedAt, operations: preOperations, status } = preActivity;

  const operations = preOperations.map(operation => parseTezosPreActivityOperation(operation, address));

  return {
    hash,
    chain: TempleChainKind.Tezos,
    chainId,
    operations: withoutBridgeInternalCalls(withoutUnshieldingCall(operations)),
    addedAt: new Date(addedAt).getTime(),
    status: toActivityStatus(status)
  };
}

const isShieldedPayout = (operation: TezosOperation) =>
  operation.kind === ActivityOperKindEnum.transfer &&
  operation.isShielded === true &&
  operation.toAddress !== SAPLING_CONTRACT_ADDRESS;

const isShieldedInteraction = (operation: TezosOperation) =>
  operation.kind === ActivityOperKindEnum.interaction && operation.isShielded === true;

// An unshielding is one zero-amount sapling call plus its payout; only the payout is the user's activity
const withoutUnshieldingCall = (operations: TezosOperation[]) =>
  operations.filter(isShieldedInteraction).length === 1 && operations.some(isShieldedPayout)
    ? operations.filter(operation => !isShieldedInteraction(operation))
    : operations;

const BRIDGE_CONTRACT_ADDRESSES = new Set([
  ETHERLINK_BRIDGE_HELPER_ADDRESS,
  ETHERLINK_BRIDGE_EXCHANGER_ADDRESS,
  ETHERLINK_ROLLUP_ADDRESS,
  ETHERLINK_FAST_WITHDRAWAL_CONTRACT_ADDRESS
]);

const isBridgeContractInteraction = (operation: TezosOperation) =>
  operation.kind === ActivityOperKindEnum.interaction &&
  operation.withAddress != null &&
  BRIDGE_CONTRACT_ADDRESSES.has(operation.withAddress);

// A bridge deposit or payout carries the bridge contracts' own calls, only the TEZ transfer is the user's activity
const withoutBridgeInternalCalls = (operations: TezosOperation[]) =>
  operations.some(operation => operation.kind === ActivityOperKindEnum.transfer && operation.isBridge === true)
    ? operations.filter(operation => !isBridgeContractInteraction(operation))
    : operations;

const toActivityStatus = (status: TezosPreActivityStatus): ActivityStatus => {
  switch (status) {
    case 'applied':
      return ActivityStatus.applied;
    case 'pending':
      return ActivityStatus.pending;
    default:
      return ActivityStatus.failed;
  }
};

const toTezosAssetSlug = (contract: string | undefined, tokenId: string | undefined) =>
  contract == null || contract === TEZ_TOKEN_SLUG ? TEZ_TOKEN_SLUG : toTokenSlug(contract, tokenId);

function parseTezosPreActivityOperation(preOperation: TezosPreActivityOperation, address: string): TezosOperation {
  if (preOperation.type !== 'transaction') {
    return { kind: ActivityOperKindEnum.interaction, withAddress: preOperation.destination?.address };
  }

  const withAddress = preOperation.destination.address;
  const isShielded =
    withAddress === SAPLING_CONTRACT_ADDRESS || preOperation.sender.address === SAPLING_CONTRACT_ADDRESS;

  if (withAddress === SAPLING_CONTRACT_ADDRESS && new BigNumber(preOperation.amountSigned).isZero()) {
    return { kind: ActivityOperKindEnum.interaction, withAddress, isShielded: true };
  }

  const firstTo = preOperation.to.at(0);

  if (firstTo == null) return { kind: ActivityOperKindEnum.interaction, withAddress };

  const assetSlug = toTezosAssetSlug(preOperation.contract, preOperation.tokenId);
  const amountSigned = preOperation.amountSigned;

  if (preOperation.subtype === 'approve') {
    return { kind: ActivityOperKindEnum.approve, spenderAddress: firstTo.address, assetSlug, amountSigned };
  }

  const fromAddress = preOperation.from.address;
  const toAddress = firstTo.address;

  if (fromAddress === address) {
    return {
      kind: ActivityOperKindEnum.transfer,
      type:
        preOperation.to.length === 1 && !isKTAddress(toAddress)
          ? ActivityOperTransferType.sendToAccount
          : ActivityOperTransferType.send,
      fromAddress,
      toAddress,
      assetSlug,
      amountSigned,
      isShielded: isShielded ? true : undefined,
      // Deposits go through the helper contract only, payouts may come from any bridge contract
      isBridge: assetSlug === TEZ_TOKEN_SLUG && toAddress === ETHERLINK_BRIDGE_HELPER_ADDRESS ? true : undefined
    };
  }

  if (preOperation.to.some(member => member.address === address)) {
    return {
      kind: ActivityOperKindEnum.transfer,
      type: isKTAddress(fromAddress) ? ActivityOperTransferType.receive : ActivityOperTransferType.receiveFromAccount,
      fromAddress,
      toAddress,
      assetSlug,
      amountSigned,
      isShielded: isShielded ? true : undefined,
      isBridge: assetSlug === TEZ_TOKEN_SLUG && BRIDGE_CONTRACT_ADDRESSES.has(fromAddress) ? true : undefined
    };
  }

  return { kind: ActivityOperKindEnum.interaction, withAddress };
}
