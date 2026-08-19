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
import { formatDayMonthYear, isToday, isYesterday } from 'src/utils/date.utils';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { formatAssetAmount, ZERO } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';
import { concatUrlPath } from 'src/utils/url.utils';

import { ActivityFaceKind, ActivityRowAsset, BUNDLE_FACE_KIND } from './types';

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

const transferTypeTitles: Record<ActivityOperTransferType, string> = {
  [ActivityOperTransferType.sendToAccount]: 'Send',
  [ActivityOperTransferType.receiveFromAccount]: 'Receive',
  [ActivityOperTransferType.send]: 'Transfer',
  [ActivityOperTransferType.receive]: 'Transfer'
};

export const getActivityTitle = (
  kind: ActivityFaceKind,
  transferType?: ActivityOperTransferType,
  isShielded?: boolean
) => {
  if (kind === BUNDLE_FACE_KIND) {
    return 'Bundle';
  }

  if (kind === ActivityOperKindEnum.interaction) {
    return isShielded === true ? 'Shielded transfer' : 'Interaction';
  }

  if (kind === ActivityOperKindEnum.approve) {
    return 'Approve';
  }

  return transferType == null ? 'Interaction' : transferTypeTitles[transferType];
};

const transferTypeIconNames: Record<ActivityOperTransferType, IconNameV2Enum> = {
  [ActivityOperTransferType.sendToAccount]: IconNameV2Enum.Send,
  [ActivityOperTransferType.receiveFromAccount]: IconNameV2Enum.Income,
  [ActivityOperTransferType.send]: IconNameV2Enum.Documents,
  [ActivityOperTransferType.receive]: IconNameV2Enum.Documents
};

export const getActivityKindIconName = (kind: ActivityFaceKind, transferType?: ActivityOperTransferType) => {
  if (kind === ActivityOperKindEnum.approve) {
    return IconNameV2Enum.Ok;
  }

  if (kind === BUNDLE_FACE_KIND || kind === ActivityOperKindEnum.interaction || transferType == null) {
    return IconNameV2Enum.Documents;
  }

  return transferTypeIconNames[transferType];
};

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
  operation?.kind === ActivityOperKindEnum.interaction ? operation.isShielded : undefined;

interface TezosBundleFaceAsset {
  assetSlug?: string;
  amountSigned?: string;
}

export const getTezosBundleFaceAsset = (operations: TezosOperation[]): TezosBundleFaceAsset => {
  const faceSlug = operations.find(
    operation =>
      operation.kind === ActivityOperKindEnum.transfer &&
      operation.assetSlug != null &&
      operation.amountSigned != null &&
      Number(operation.amountSigned) !== 0
  )?.assetSlug;

  if (faceSlug == null) {
    return {};
  }

  let amount = ZERO;

  for (const operation of operations) {
    if (
      operation.kind === ActivityOperKindEnum.transfer &&
      operation.assetSlug === faceSlug &&
      operation.amountSigned != null
    ) {
      amount = amount.plus(operation.amountSigned);
    }
  }

  return { assetSlug: faceSlug, amountSigned: amount.toFixed() };
};

export const getNftTransfersCount = (operations: EvmOperation[]) =>
  operations.filter(operation => operation.kind === ActivityOperKindEnum.transfer && operation.asset?.nft === true)
    .length;

export const getEvmBundleFaceAsset = (operations: EvmOperation[]): EvmActivityAsset | undefined => {
  const faceOperation = operations.find(
    operation =>
      operation.kind === ActivityOperKindEnum.transfer &&
      operation.asset?.amountSigned != null &&
      Number(operation.asset.amountSigned) !== 0
  );

  const faceAsset = faceOperation?.asset;

  if (faceAsset == null) {
    return undefined;
  }

  const faceSlug = toEvmAssetSlug(faceAsset.contract, faceAsset.tokenId);
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

  return { ...faceAsset, amountSigned: amount.toFixed() };
};

export const getActivityRowAmountView = (
  kind: ActivityFaceKind,
  asset: ActivityRowAsset | undefined,
  fiatRate: number | undefined,
  nftBundleCount?: number
): ActivityRowAmountView => {
  if (asset == null || kind === ActivityOperKindEnum.interaction) {
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
