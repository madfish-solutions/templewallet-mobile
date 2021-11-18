import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation } from '../../form/validation/asset-amount';
import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { walletAddressValidation } from '../../form/validation/wallet-address';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface SendModalFormValues {
  assetAmount: AssetAmountInterface;
  receiverPublicKeyHash: string;
  ownAccount: WalletAccountInterface;
  transferBetweenOwnAccounts: boolean;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  assetAmount: assetAmountValidation,
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: boolean, schema: StringSchema) =>
      value ? schema : walletAddressValidation
    )
    .ensure(),
  ownAccount: object()
    .shape({})
    .when('transferBetweenOwnAccounts', (value: boolean, schema: AnyObjectSchema) =>
      value ? schema.required(makeRequiredErrorMessage('To')) : schema
    ) as SchemaOf<WalletAccountInterface>,
  transferBetweenOwnAccounts: boolean().required()
});
