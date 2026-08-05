import { BigNumber } from 'bignumber.js';
import { isAddress as isEvmAddress } from 'viem';
import { boolean, mixed, object, SchemaOf, string, ValidationError } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { SAPLING_MEMO_SIZE } from 'src/config/sapling';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { bigNumberSchema } from 'src/form/validation/big-number';
import { TEZ_TOKEN_SLUG, TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset } from 'src/types/send-asset';
import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';
import { isValidAddress } from 'src/utils/tezos.util';

export interface SendAssetAmount extends AssetAmountInterface<SendAsset> {
  asset: SendAsset;
}

export interface SendModalFormValues {
  assetAmount: SendAssetAmount;
  recipient: string;
  transferBetweenOwnAccounts: boolean;
  memo: string;
}

const assetAmountValidation = object()
  .shape({
    asset: mixed<SendAsset>().required(),
    amount: bigNumberSchema()
      .required('Required')
      .test('is-positive', 'Should be greater than 0', value => value instanceof BigNumber && value.isGreaterThan(0))
  })
  .test('max-amount', (value, context) => {
    const asset = value?.asset;
    const amount = value?.amount;

    if (!asset || !(amount instanceof BigNumber)) {
      return true;
    }

    if (amount.isGreaterThan(asset.balance)) {
      return new ValidationError('Insufficient balance', value, context.path, 'max-amount');
    }

    if (asset.sendStandard === EvmAssetStandardEnum.ERC721 && !amount.isEqualTo(1)) {
      return new ValidationError('ERC-721 amount must be 1', value, context.path, 'erc721-amount');
    }

    if (
      (asset.sendStandard === EvmAssetStandardEnum.ERC721 || asset.sendStandard === EvmAssetStandardEnum.ERC1155) &&
      !amount.isInteger()
    ) {
      return new ValidationError('NFT amount must be a whole number', value, context.path, 'nft-amount');
    }

    return true;
  });

const isRecipientAddressValid = (value: string, asset: SendAsset, allowDomain: boolean) => {
  if (asset.chainKind === TempleChainKind.EVM) {
    return isEvmAddress(value);
  }

  if (allowDomain && isTezosDomainNameValid(value)) {
    return true;
  }

  if (!isValidAddress(value) && !isSaplingAddress(value)) {
    return false;
  }

  return !isSaplingAddress(value) || asset.assetSlug === TEZ_TOKEN_SLUG || asset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
};

const recipientAddressValidation = string()
  .required('Required')
  .test('network-address', 'Invalid address', function (value) {
    if (!value) {
      return false;
    }

    const { asset } = (this.parent as SendModalFormValues).assetAmount;

    return isRecipientAddressValid(value, asset, true);
  });

export const sendModalValidationSchema = object().shape({
  assetAmount: assetAmountValidation,
  recipient: recipientAddressValidation.ensure(),
  transferBetweenOwnAccounts: boolean().required(),
  memo: string()
    .max(SAPLING_MEMO_SIZE, `Memo must be at most ${SAPLING_MEMO_SIZE} symbols`)
    .matches(/^[\x00-\x7F]*$/, 'Memo must contain only ASCII characters')
    .ensure()
}) as unknown as SchemaOf<SendModalFormValues>;
