import { AbiFunction, decodeFunctionData } from 'viem';

import {
  erc1155MintAbi,
  erc1155MintBatchAbi,
  erc1155SafeBatchTransferFromAbi,
  erc1155SafeTransferFromAbi,
  erc1155SetApprovalForAllAbi
} from '../abi/erc1155.abi';
import {
  erc20ApproveAbi,
  erc20IncreaseAllowanceAbi,
  erc20MintAbi,
  erc20TransferAbi,
  erc20TransferFromAbi
} from '../abi/erc20.abi';
import {
  erc721MintAbi,
  erc721SafeMintAbi,
  erc721SafeMintWithDataAbi,
  erc721SafeTransferFromNonpayableAbi,
  erc721SafeTransferFromPayableAbi,
  erc721SetApprovalForAllAbi,
  erc721TransferFromAbi
} from '../abi/erc721.abi';
import {
  erc1155SeaCreateCloneAbi,
  erc1155SeaMultiConfigureAbi,
  erc721SeaCreateCloneAbi,
  erc721SeaMultiConfigureAbi
} from '../abi/opensea.abi';
import {
  erc1155RaribleMintAndTransferAbi,
  erc721RaribleMintAndTransferAbi,
  raribleCreateTokenAbi
} from '../abi/rarible.abi';

import { TxEssentials } from './helpers';

const deployContractAbis = [erc721SeaCreateCloneAbi, erc1155SeaCreateCloneAbi, raribleCreateTokenAbi] as const;

// Parsing transaction data with erc20ApproveAbi and erc721ApproveAbi returns the same results
const approveAbis = [erc20ApproveAbi, erc20IncreaseAllowanceAbi] as const;

const approvalForAllAbis = [erc721SetApprovalForAllAbi, erc1155SetApprovalForAllAbi] as const;

const transferAbis = [
  erc20TransferAbi,
  erc20TransferFromAbi,
  erc721SafeTransferFromNonpayableAbi,
  erc721SafeTransferFromPayableAbi,
  erc721TransferFromAbi,
  erc1155SafeBatchTransferFromAbi,
  erc1155SafeTransferFromAbi
] as const;

const mintAbis = [
  erc20MintAbi,
  erc721MintAbi,
  erc721SafeMintAbi,
  erc721SafeMintWithDataAbi,
  erc1155MintAbi,
  erc1155MintBatchAbi,
  erc721RaribleMintAndTransferAbi,
  erc1155RaribleMintAndTransferAbi,
  erc721SeaMultiConfigureAbi,
  erc1155SeaMultiConfigureAbi
] as const;

const dataMatchesAbis = (data: HexString, abis: readonly AbiFunction[]) => {
  try {
    decodeFunctionData({ abi: abis, data });

    return true;
  } catch {
    return false;
  }
};

export enum EvmOperationKind {
  DeployContract = 'DeployContract',
  Mint = 'Mint',
  Send = 'Send',
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  Other = 'Other'
}

const abiDetectionTypesEntries = [
  [EvmOperationKind.Send, transferAbis],
  [EvmOperationKind.DeployContract, deployContractAbis],
  [EvmOperationKind.Mint, mintAbis],
  [EvmOperationKind.Approval, approveAbis],
  [EvmOperationKind.ApprovalForAll, approvalForAllAbis]
] as const;

export const getOperationKind = (tx: TxEssentials) => {
  if (!tx.to) {
    return EvmOperationKind.DeployContract;
  }

  if (!tx.data || tx.data === '0x') {
    return tx.value && tx.value > 0n ? EvmOperationKind.Send : EvmOperationKind.Other;
  }

  for (const [kind, abis] of abiDetectionTypesEntries) {
    if (dataMatchesAbis(tx.data, abis)) {
      return kind;
    }
  }

  return EvmOperationKind.Other;
};
