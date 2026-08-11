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

  return {
    hash,
    chain: TempleChainKind.Tezos,
    chainId,
    operations: preOperations.map(operation => parseTezosPreActivityOperation(operation, address)),
    addedAt: new Date(addedAt).getTime(),
    status: toActivityStatus(status)
  };
}

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

  if (preOperation.sender.address === SAPLING_CONTRACT_ADDRESS || withAddress === SAPLING_CONTRACT_ADDRESS) {
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
      amountSigned
    };
  }

  if (preOperation.to.some(member => member.address === address)) {
    return {
      kind: ActivityOperKindEnum.transfer,
      type: isKTAddress(fromAddress) ? ActivityOperTransferType.receive : ActivityOperTransferType.receiveFromAccount,
      fromAddress,
      toAddress,
      assetSlug,
      amountSigned
    };
  }

  return { kind: ActivityOperKindEnum.interaction, withAddress };
}
