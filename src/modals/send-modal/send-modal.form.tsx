import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { walletAddressValidation } from '../../form/validation/wallet-address';
import { AssetAmountInputValue } from '../../interfaces/asset-amount-input-value.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { isDefined } from '../../utils/is-defined';

export interface SendModalFormValues {
  receiverPublicKeyHash: string;
  amount: AssetAmountInputValue;
  ownAccount: WalletAccountInterface;
  transferBetweenOwnAccounts: boolean;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: boolean, schema: StringSchema) =>
      value ? schema : walletAddressValidation
    )
    .ensure(),
  amount: object()
    .shape({})
    .required(makeRequiredErrorMessage('Amount'))
    .test(
      'required',
      makeRequiredErrorMessage('Amount'),
      (value?: AssetAmountInputValue) => isDefined(value?.token) && isDefined(value?.amount)
    )
    .test('positive', 'Amount must be positive', (value?: AssetAmountInputValue) => {
      const amount = value?.amount;

      return isDefined(amount) && amount.gt(0);
    }),
  ownAccount: object()
    .shape({})
    .when('transferBetweenOwnAccounts', (value: boolean, schema: AnyObjectSchema) =>
      value ? schema.required(makeRequiredErrorMessage('To')) : schema
    ) as SchemaOf<WalletAccountInterface>,
  transferBetweenOwnAccounts: boolean().required()
});
