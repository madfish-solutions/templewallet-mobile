import { BigNumber } from 'bignumber.js';
import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema, ValidationError } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
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
      value ? schema : schema.required(makeRequiredErrorMessage('To'))
    )
    .ensure(),
  amount: object()
    .shape({})
    .test('is-valid', value => {
      if (!isDefined(value?.token) || !isDefined(value?.amount)) {
        return new ValidationError(makeRequiredErrorMessage('Amount'));
      }
      const amount = value.amount as BigNumber;
      if (amount.lte(0)) {
        return new ValidationError('Must be positive');
      }

      return true;
    })
    .required(),
  ownAccount: object()
    .shape({})
    .when('transferBetweenOwnAccounts', (value: boolean, schema: AnyObjectSchema) =>
      value ? schema.required(makeRequiredErrorMessage('To')) : schema
    ) as SchemaOf<WalletAccountInterface>,
  transferBetweenOwnAccounts: boolean().required()
});
