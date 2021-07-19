import { BigNumber } from 'bignumber.js';
import { boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { bigNumberValidation } from '../../form/validation/big-number';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';

export interface SendModalFormValues {
  token: TokenInterface;
  receiverPublicKeyHash: string;
  amount?: BigNumber;
  ownAccount: WalletAccountInterface;
  transferBetweenOwnAccounts: boolean;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  token: object().shape({}).required(),
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: string, schema: StringSchema) => (value ? schema : schema.required()))
    .ensure(),
  amount: bigNumberValidation
    .clone()
    .test('is-greater-than', 'Should be greater than 0', value => {
      if (value instanceof BigNumber) {
        return value.gt(0);
      }

      return false;
    })
    .required(),
  ownAccount: object().shape({}).required(),
  transferBetweenOwnAccounts: boolean().required()
});
