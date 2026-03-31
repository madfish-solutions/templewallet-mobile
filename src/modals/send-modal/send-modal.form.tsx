import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { SAPLING_MEMO_SIZE } from 'src/config/sapling';
import { assetAmountValidation } from 'src/form/validation/asset-amount';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { walletAddressValidation } from 'src/form/validation/wallet-address';
import { AccountBaseInterface } from 'src/interfaces/account.interface';

export interface SendModalFormValues {
  assetAmount: AssetAmountInterface;
  receiverPublicKeyHash: string;
  recipient: AccountBaseInterface;
  transferBetweenOwnAccounts: boolean;
  memo: string;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  assetAmount: assetAmountValidation,
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: boolean, schema: StringSchema) =>
      value ? schema : walletAddressValidation
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
