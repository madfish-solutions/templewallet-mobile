import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation } from '../../form/validation/asset-amount';
import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { walletAddressValidation } from '../../form/validation/wallet-address';
import { AccountBaseInterface } from '../../interfaces/account.interface';

export interface SendModalFormValues {
  assetAmount: AssetAmountInterface;
  receiverPublicKeyHash: string;
  recipient: AccountBaseInterface;
  transferBetweenOwnAccounts: boolean;
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
  transferBetweenOwnAccounts: boolean().required()
});
