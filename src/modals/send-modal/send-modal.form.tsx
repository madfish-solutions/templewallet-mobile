import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { assetAmountValidation } from '../../form/validation/asset-amount';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface SendModalFormValues {
  sender: WalletAccountInterface;
  receiverPublicKeyHash: string;
  amount?: BigNumber;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  sender: object().shape({}).required(),
  receiverPublicKeyHash: string().required(),
  amount: assetAmountValidation.required()
});
