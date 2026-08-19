import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmSendAsset, SendAsset, TezosSendAsset } from 'src/types/send-asset';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';

export type SendIntent =
  | {
      type: 'evm-transfer';
      accountId: string;
      asset: EvmSendAsset;
      receiverAddress: HexString;
      atomicAmount: string;
    }
  | {
      type: 'sapling-transaction';
      transactionType: 'shield' | 'unshield' | 'transfer';
      amount: string;
      recipientAddress: string;
      memo?: string;
    }
  | { type: 'tezos-transfer'; asset: TezosSendAsset; receiverAddress: string; amount: string }
  | { type: 'on-ramp' };

export type SendIntentFailureReason = 'missing-evm-account' | 'missing-tezos-account';

type CreateSendIntentResult =
  | { success: true; intent: SendIntent }
  | { success: false; reason: SendIntentFailureReason };

interface CreateSendIntentParams {
  accountId?: string;
  amount: BigNumber;
  asset: SendAsset;
  evmAddress?: string;
  isOnRampEnabled: boolean;
  memo: string;
  receiverAddress: string;
  tezosAddress?: string;
  tezosBalance: string;
}

export const createSendIntent = ({
  accountId,
  amount,
  asset,
  evmAddress,
  isOnRampEnabled,
  memo,
  receiverAddress,
  tezosAddress,
  tezosBalance
}: CreateSendIntentParams): CreateSendIntentResult => {
  if (asset.chainKind === TempleChainKind.EVM) {
    if (!evmAddress || !accountId) {
      return { success: false, reason: 'missing-evm-account' };
    }

    return {
      success: true,
      intent: {
        type: 'evm-transfer',
        accountId,
        asset,
        receiverAddress: receiverAddress as HexString,
        atomicAmount: amount.toFixed(0)
      }
    };
  }

  if (!tezosAddress) {
    return { success: false, reason: 'missing-tezos-account' };
  }

  const isRecipientSapling = isSaplingAddress(receiverAddress);
  const isSourceShielded = asset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;

  if (isSourceShielded || (asset.assetSlug === TEZ_TOKEN_SLUG && isRecipientSapling)) {
    const type = isSourceShielded ? (isRecipientSapling ? 'transfer' : 'unshield') : 'shield';

    return {
      success: true,
      intent: {
        type: 'sapling-transaction',
        transactionType: type,
        amount: amount.toFixed(0),
        recipientAddress: receiverAddress,
        ...((type === 'transfer' || type === 'shield') && { memo: memo || undefined })
      }
    };
  }

  if (asset.assetSlug === TEZ_TOKEN_SLUG && amount.isGreaterThan(tezosBalance) && isOnRampEnabled) {
    return { success: true, intent: { type: 'on-ramp' } };
  }

  return {
    success: true,
    intent: {
      type: 'tezos-transfer',
      asset,
      receiverAddress,
      amount: amount.toString()
    }
  };
};
