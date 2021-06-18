import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../form/validation/big-number';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface SendModalFormValues {
  sender: WalletAccountInterface;
  receiverPublicKeyHash: string;
  amount?: BigNumber;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  sender: object().shape({}).required(),
  receiverPublicKeyHash: string().required(),
  amount: bigNumberValidation
    .clone()
    .test('is-greater-than', 'Should be greater than 0', value => {
      if (value instanceof BigNumber) {
        return value.gt(0);
      }

      return false;
    })
    .required()
});
