import { BigNumber } from 'bignumber.js';

import {
  ActivityOperKindEnum,
  ActivityOperTransferType,
  EvmActivityAsset,
  EvmOperation,
  TezosOperation
} from 'src/activity/types';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { formatDayMonthYear, isToday, isYesterday } from 'src/utils/date.utils';
import { equalsIgnoreCase } from 'src/utils/evm/on-chain/common.utils';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { formatAssetAmount, ZERO } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';
import { concatUrlPath } from 'src/utils/url.utils';

import { ActivityFaceKind, ActivityRowAsset, ActivityRowKind, BUNDLE_FACE_KIND } from './types';

interface ActivityRowAmountView {
  amountText?: string;
  symbolText?: string;
  isPositive: boolean;
  fiatValue?: BigNumber;
  noteText?: string;
}

const HASH_FIRST_CHARS_COUNT = 6;
const HASH_LAST_CHARS_COUNT = 4;
const MAX_SYMBOL_LENGTH = 6;

const NO_VALUE_TEXT = 'No value';
const UNLIMITED_TEXT = 'Unlimited';

export const shortenHash = (hash: string) =>
  hash.length > HASH_FIRST_CHARS_COUNT + HASH_LAST_CHARS_COUNT
    ? `${hash.slice(0, HASH_FIRST_CHARS_COUNT)}…${hash.slice(-HASH_LAST_CHARS_COUNT)}`
    : hash;

const truncateSymbol = (symbol: string) =>
  symbol.length > MAX_SYMBOL_LENGTH ? `${symbol.slice(0, MAX_SYMBOL_LENGTH)}…` : symbol;

const transferRowKinds: Record<ActivityOperTransferType, ActivityRowKind> = {
  [ActivityOperTransferType.sendToAccount]: ActivityRowKind.send,
  [ActivityOperTransferType.receiveFromAccount]: ActivityRowKind.receive,
  [ActivityOperTransferType.send]: ActivityRowKind.transfer,
  [ActivityOperTransferType.receive]: ActivityRowKind.transfer
};

// Shielding and unshielding go through the sapling contract, but read as plain sends and receives
const shieldedTransferRowKinds: Record<ActivityOperTransferType, ActivityRowKind> = {
  [ActivityOperTransferType.sendToAccount]: ActivityRowKind.send,
  [ActivityOperTransferType.receiveFromAccount]: ActivityRowKind.receive,
  [ActivityOperTransferType.send]: ActivityRowKind.send,
  [ActivityOperTransferType.receive]: ActivityRowKind.receive
};

export const getActivityRowKind = (
  kind: ActivityFaceKind,
  transferType?: ActivityOperTransferType,
  isShielded?: boolean
) => {
  if (kind === BUNDLE_FACE_KIND) {
    return ActivityRowKind.bundle;
  }

  if (kind === ActivityOperKindEnum.approve) {
    return ActivityRowKind.approve;
  }

  if (kind === ActivityOperKindEnum.interaction || transferType == null) {
    return ActivityRowKind.interaction;
  }

  return (isShielded === true ? shieldedTransferRowKinds : transferRowKinds)[transferType];
};

const activityRowTitles: Record<ActivityRowKind, string> = {
  [ActivityRowKind.send]: 'Send',
  [ActivityRowKind.receive]: 'Receive',
  [ActivityRowKind.transfer]: 'Transfer',
  [ActivityRowKind.interaction]: 'Interaction',
  [ActivityRowKind.approve]: 'Approve',
  [ActivityRowKind.bundle]: 'Bundle'
};

export const getActivityRowTitle = (rowKind: ActivityRowKind) => activityRowTitles[rowKind];

const assetPlaceholderIconNames: Record<ActivityRowKind, IconNameV2Enum> = {
  [ActivityRowKind.send]: IconNameV2Enum.Send,
  [ActivityRowKind.receive]: IconNameV2Enum.Income,
  [ActivityRowKind.transfer]: IconNameV2Enum.Documents,
  [ActivityRowKind.interaction]: IconNameV2Enum.Documents,
  [ActivityRowKind.approve]: IconNameV2Enum.Ok,
  [ActivityRowKind.bundle]: IconNameV2Enum.Documents
};

// Rows without an asset logo (token page) name the operation with the glyph itself
const operationIconNames: Record<ActivityRowKind, IconNameV2Enum> = {
  [ActivityRowKind.send]: IconNameV2Enum.Send,
  [ActivityRowKind.receive]: IconNameV2Enum.Income,
  [ActivityRowKind.transfer]: IconNameV2Enum.DocumentGear,
  [ActivityRowKind.interaction]: IconNameV2Enum.DocumentGear,
  [ActivityRowKind.approve]: IconNameV2Enum.LockOpen,
  [ActivityRowKind.bundle]: IconNameV2Enum.Cube
};

export const getActivityRowIconName = (rowKind: ActivityRowKind, withoutAssetIcon = false) =>
  (withoutAssetIcon ? operationIconNames : assetPlaceholderIconNames)[rowKind];

export const buildActivityExplorerUrl = (explorerUrl: string, hash: string, chain: TempleChainKind) =>
  concatUrlPath(explorerUrl, chain === TempleChainKind.Tezos ? hash : `tx/${hash}`);

export const getActivityDateSectionTitle = (addedAt: number) => {
  const date = new Date(addedAt);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return formatDayMonthYear(date).toUpperCase();
};

export const getActivityOperTransferType = (operation?: TezosOperation | EvmOperation) =>
  operation?.kind === ActivityOperKindEnum.transfer ? operation.type : undefined;

export const getTezosOperationIsShielded = (operation?: TezosOperation) =>
  operation?.kind === ActivityOperKindEnum.interaction || operation?.kind === ActivityOperKindEnum.transfer
    ? operation.isShielded
    : undefined;

export const getTezosBundleIsShielded = (operations: TezosOperation[]) =>
  operations.some(operation => getTezosOperationIsShielded(operation) === true);

interface TezosBundleFaceAsset {
  assetSlug?: string;
  amountSigned?: string;
}

const sumTezosTransfersOf = (operations: TezosOperation[], assetSlug: string) => {
  let amount = ZERO;

  for (const operation of operations) {
    if (
      operation.kind === ActivityOperKindEnum.transfer &&
      operation.assetSlug === assetSlug &&
      operation.amountSigned != null
    ) {
      amount = amount.plus(operation.amountSigned);
    }
  }

  return amount;
};

export const getTezosBundleFaceAsset = (
  operations: TezosOperation[],
  preferredAssetSlug?: string
): TezosBundleFaceAsset => {
  const preferredSlug =
    preferredAssetSlug != null && !sumTezosTransfersOf(operations, preferredAssetSlug).isZero()
      ? preferredAssetSlug
      : undefined;

  const gasSlug = sumTezosTransfersOf(operations, TEZ_TOKEN_SLUG).isZero() ? undefined : TEZ_TOKEN_SLUG;

  const faceSlug =
    preferredSlug ??
    gasSlug ??
    operations.find(
      operation =>
        operation.kind === ActivityOperKindEnum.transfer &&
        operation.assetSlug != null &&
        operation.assetSlug !== TEZ_TOKEN_SLUG &&
        !sumTezosTransfersOf(operations, operation.assetSlug).isZero()
    )?.assetSlug;

  if (faceSlug == null) {
    return {};
  }

  return { assetSlug: faceSlug, amountSigned: sumTezosTransfersOf(operations, faceSlug).toFixed() };
};

export const getNftTransfersCount = (operations: EvmOperation[]) =>
  operations.filter(operation => operation.kind === ActivityOperKindEnum.transfer && operation.asset?.nft === true)
    .length;

const sumEvmTransfersOf = (operations: EvmOperation[], faceSlug: string) => {
  let amount = ZERO;

  for (const operation of operations) {
    const { asset } = operation;

    if (
      operation.kind === ActivityOperKindEnum.transfer &&
      asset?.amountSigned != null &&
      toEvmAssetSlug(asset.contract, asset.tokenId) === faceSlug
    ) {
      amount = amount.plus(asset.amountSigned);
    }
  }

  return amount;
};

export const getEvmBundleFaceAsset = (
  operations: EvmOperation[],
  preferredContract?: string
): EvmActivityAsset | undefined => {
  const findNonzeroNetTransfer = (matchesAsset: (asset: EvmActivityAsset) => boolean) =>
    operations.find(
      operation =>
        operation.kind === ActivityOperKindEnum.transfer &&
        operation.asset?.amountSigned != null &&
        matchesAsset(operation.asset) &&
        !sumEvmTransfersOf(operations, toEvmAssetSlug(operation.asset.contract, operation.asset.tokenId)).isZero()
    );

  const preferredOperation =
    preferredContract == null
      ? undefined
      : findNonzeroNetTransfer(asset => equalsIgnoreCase(asset.contract, preferredContract));

  const faceAsset = (preferredOperation ?? findNonzeroNetTransfer(() => true))?.asset;

  if (faceAsset == null) {
    return undefined;
  }

  const faceSlug = toEvmAssetSlug(faceAsset.contract, faceAsset.tokenId);

  return { ...faceAsset, amountSigned: sumEvmTransfersOf(operations, faceSlug).toFixed() };
};

export const getActivityRowAmountView = (
  kind: ActivityFaceKind,
  asset: ActivityRowAsset | undefined,
  fiatRate: number | undefined,
  nftBundleCount?: number
): ActivityRowAmountView => {
  if (asset == null) {
    return { isPositive: false };
  }

  const { amountSigned, decimals, symbol, name, isNft, contract } = asset;

  // An NFT-led bundle mixes editions, so per-unit sums mislead; the transfer count is the meaningful number
  if (kind === BUNDLE_FACE_KIND && isNft && nftBundleCount != null) {
    const isPositive = amountSigned != null && Number(amountSigned) > 0;
    const isNegative = amountSigned != null && Number(amountSigned) < 0;

    return {
      amountText: `${isPositive ? '+' : isNegative ? '-' : ''}${nftBundleCount}`,
      symbolText: 'NFT',
      isPositive,
      noteText: NO_VALUE_TEXT
    };
  }

  if (kind === ActivityOperKindEnum.approve) {
    if (symbol == null) {
      return { amountText: shortenHash(contract), isPositive: false };
    }

    if (amountSigned === null) {
      return { amountText: truncateSymbol(symbol), isPositive: false, noteText: UNLIMITED_TEXT };
    }

    if (amountSigned == null || decimals == null) {
      return { amountText: truncateSymbol(symbol), isPositive: false };
    }

    return {
      amountText: truncateSymbol(symbol),
      isPositive: false,
      noteText: formatAssetAmount(mutezToTz(new BigNumber(amountSigned), decimals))
    };
  }

  // An NFT without a symbol still gets a title - its name
  const title = symbol ?? (isNft ? name : undefined);
  const symbolText = title == null ? undefined : truncateSymbol(title);

  if (amountSigned == null || decimals == null) {
    return { amountText: symbolText ?? shortenHash(contract), isPositive: false, noteText: NO_VALUE_TEXT };
  }

  const amount = mutezToTz(new BigNumber(amountSigned), decimals);
  const isPositive = amount.isGreaterThan(0);
  const amountText = `${isPositive ? '+' : ''}${formatAssetAmount(amount)}`;

  if (isNft || fiatRate == null) {
    return { amountText, symbolText, isPositive, noteText: NO_VALUE_TEXT };
  }

  return { amountText, symbolText, isPositive, fiatValue: amount.multipliedBy(fiatRate) };
};
