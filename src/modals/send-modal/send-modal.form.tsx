import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { SAPLING_MEMO_SIZE } from 'src/config/sapling';
import { assetAmountValidation } from 'src/form/validation/asset-amount';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { walletAddressValidation } from 'src/form/validation/wallet-address';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { TEZ_TOKEN_SLUG, TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';

export interface SendModalFormValues {
  assetAmount: AssetAmountInterface;
  receiverPublicKeyHash: string;
  recipient: AccountBaseInterface;
  transferBetweenOwnAccounts: boolean;
  memo: string;
}

function isTezAssetForSaplingAddress(this: { parent: SendModalFormValues }, addr: string | undefined) {
  if (!addr || !isSaplingAddress(addr)) {
    return true;
  }

  const slug = getTokenSlug(this.parent.assetAmount.asset);

  return slug === TEZ_TOKEN_SLUG || slug === TEZ_SHIELDED_TOKEN_SLUG;
}

const saplingAssetValidation = walletAddressValidation.test(
  'sapling-only-tez',
  'Only TEZ or Shielded TEZ can be sent to a shielded (zet1) address',
  isTezAssetForSaplingAddress
);

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  assetAmount: assetAmountValidation,
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: boolean, schema: StringSchema) =>
      value ? schema : saplingAssetValidation
    )
    .ensure(),
  recipient: object()
    .shape({})
    .when('transferBetweenOwnAccounts', (value: boolean, schema: AnyObjectSchema) =>
      value ? schema.required(makeRequiredErrorMessage('To')) : schema
    ) as SchemaOf<AccountBaseInterface>,
  transferBetweenOwnAccounts: boolean().required(),
  memo: string()
    .max(SAPLING_MEMO_SIZE, `Memo must be at most ${SAPLING_MEMO_SIZE} symbols`)
    .matches(/^[\x00-\x7F]*$/, 'Memo must contain only ASCII characters')
    .ensure()
});
