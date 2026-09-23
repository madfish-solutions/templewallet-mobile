import { zeroAddress } from 'viem';

import {
  EtherlinkTokenTransfer,
  EtherlinkTransaction,
  isErc20TokenTransfer,
  isErc721TokenTransfer
} from 'src/apis/etherlink';
import { DEFAULT_EVM_CURRENCY } from 'src/token/interfaces/token-metadata.interface';
import { DEFAULT_EVM_CHAINS_SPECS } from 'src/types/networks';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityOperKindEnum, ActivityOperTransferType, EvmOperation } from '../types';

import { fetchAllTxInternalTransactions, fetchAllTxLogs } from './fetchers';
import { EvmOperationKind, getEvmOperationKind } from './operation-kind';
import { getApprovalLogOwnerAddress, isApprovalLog, parseApprovalLog } from './parse-approval';

const INTEGER_REGEX = /^-?\d+$/;

export const toBigInt = (value: string) => (INTEGER_REGEX.test(value) ? BigInt(value) : 0n);

const makeGasAsset = (chainId: number) => {
  const currency = DEFAULT_EVM_CHAINS_SPECS.find(specs => specs.chainId === chainId)?.currency ?? DEFAULT_EVM_CURRENCY;

  return { contract: currency.address, decimals: currency.decimals, nft: false, symbol: currency.symbol };
};

const makeGasTokenTransfer = (
  operation: Pick<EtherlinkTransaction, 'from' | 'to' | 'value'> & { logIndex: number },
  chainId: number,
  accountAddress: string
): EvmOperation => {
  const { from, to, value, logIndex } = operation;
  const isSending = equalsIgnoreCase(from.hash, accountAddress);

  return {
    kind: ActivityOperKindEnum.transfer,
    fromAddress: from.hash,
    toAddress: to?.hash ?? zeroAddress,
    asset: { ...makeGasAsset(chainId), amountSigned: isSending ? `-${value}` : value },
    logIndex,
    type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
  };
};

export const parseTokenTransfer = (transfer: EtherlinkTokenTransfer, accountAddress: string): EvmOperation => {
  const { from, to, log_index: logIndex } = transfer;
  const isSending = equalsIgnoreCase(from.hash, accountAddress);
  const amountNotSigned = isErc721TokenTransfer(transfer) ? '1' : transfer.total.value;
  const amountSigned = isSending ? `-${amountNotSigned}` : amountNotSigned;

  if (isErc20TokenTransfer(transfer)) {
    const { address_hash: address, decimals, symbol, icon_url: iconURL } = transfer.token;

    return {
      kind: ActivityOperKindEnum.transfer,
      fromAddress: from.hash,
      toAddress: to.hash,
      asset: {
        contract: address,
        amountSigned,
        decimals: decimals == null ? undefined : Number(decimals),
        nft: false,
        symbol: symbol ?? undefined,
        iconURL: iconURL ?? undefined
      },
      logIndex,
      type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
    };
  }

  const { total } = transfer;
  const instance = total.token_instance;
  const {
    address_hash: address,
    symbol,
    decimals: rawDecimals,
    icon_url: iconFallback,
    name: collectionName
  } = instance?.token ?? transfer.token;

  return {
    kind: ActivityOperKindEnum.transfer,
    fromAddress: from.hash,
    toAddress: to.hash,
    asset: {
      contract: address,
      tokenId: instance?.id ?? total.token_id,
      amountSigned,
      decimals: rawDecimals == null ? 0 : Number(rawDecimals),
      nft: true,
      symbol: symbol ?? undefined,
      name: instance?.metadata?.name ?? collectionName ?? undefined,
      iconURL: instance?.metadata?.image ?? iconFallback ?? undefined
    },
    logIndex,
    type: isSending ? ActivityOperTransferType.sendToAccount : ActivityOperTransferType.receiveFromAccount
  };
};

const getApprovalsForAccount = async (tx: EtherlinkTransaction, accountAddress: string, signal?: AbortSignal) => {
  const logEntries = await fetchAllTxLogs(tx.hash, signal);

  return logEntries
    .map(({ topics, index, data, address, decoded }) => ({
      topics: topics.filter(isDefined),
      logIndex: index,
      data,
      address: address.hash,
      decoded
    }))
    .filter(
      ({ decoded, topics }) =>
        isApprovalLog({ decoded, topics }) && equalsIgnoreCase(getApprovalLogOwnerAddress(topics), accountAddress)
    )
    .map(({ topics, logIndex, data, address }) => parseApprovalLog({ topics, logIndex, data, address }));
};

export const toUnorderedOperations = async (
  tx: EtherlinkTransaction,
  tokensTransfers: EtherlinkTokenTransfer[],
  nativeCoinDelta: string,
  accountAddress: string,
  chainId: number,
  signal?: AbortSignal
): Promise<EvmOperation[]> => {
  const { to, position, raw_input: rawInput, value, status } = tx;
  const toAddress = to?.hash;
  const parsedTokensTransfers = tokensTransfers.map(transfer => parseTokenTransfer(transfer, accountAddress));

  const operationKind = getEvmOperationKind({ data: rawInput, to: toAddress, value: toBigInt(value) });
  const gasTokenTransfer = makeGasTokenTransfer({ ...tx, logIndex: position }, chainId, accountAddress);
  const fallbackOperations: EvmOperation[] = [
    {
      kind: ActivityOperKindEnum.interaction,
      logIndex: position,
      withAddress: toAddress,
      asset: Number(value) > 0 ? { ...makeGasAsset(chainId), amountSigned: `-${value}` } : undefined
    }
  ];

  switch (operationKind) {
    case EvmOperationKind.DeployContract:
      return parsedTokensTransfers.concat(fallbackOperations);
    case EvmOperationKind.Send:
    case EvmOperationKind.Mint:
      if (rawInput === '0x') {
        return [gasTokenTransfer];
      }

      return parsedTokensTransfers.length
        ? parsedTokensTransfers.concat(Number(value) ? gasTokenTransfer : [])
        : fallbackOperations;
    case EvmOperationKind.Approval: {
      const approvals = await getApprovalsForAccount(tx, accountAddress, signal);

      return approvals.length ? approvals : fallbackOperations;
    }
    case EvmOperationKind.ApprovalForAll:
      return [{ kind: ActivityOperKindEnum.interaction, logIndex: position, withAddress: toAddress }];
    default: {
      if (status !== 'ok') {
        return fallbackOperations;
      }

      const hasGasTokenReceiveOperations = toBigInt(nativeCoinDelta) + toBigInt(value) > 0n;

      if (!tokensTransfers.length && !hasGasTokenReceiveOperations) {
        const approvalOperations = await getApprovalsForAccount(tx, accountAddress, signal);

        return approvalOperations.length ? approvalOperations : fallbackOperations;
      }

      let gasTokenReceiveOperations: EvmOperation[] = [];

      if (hasGasTokenReceiveOperations) {
        const internalOperations = await fetchAllTxInternalTransactions(tx.hash, signal);
        gasTokenReceiveOperations = internalOperations
          .filter(operation => equalsIgnoreCase(operation.to?.hash, accountAddress) && Number(operation.value) > 0)
          .map(operation => makeGasTokenTransfer({ ...operation, logIndex: operation.index }, chainId, accountAddress));
      }

      return parsedTokensTransfers.concat(gasTokenReceiveOperations).concat(Number(value) ? gasTokenTransfer : []);
    }
  }
};
