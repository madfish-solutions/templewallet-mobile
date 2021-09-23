import { BigNumber } from 'bignumber.js';
import { AnyObjectSchema, boolean, object, SchemaOf, string, StringSchema } from 'yup';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { bigNumberValidation } from '../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { walletAddressValidation } from '../../form/validation/wallet-address';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';

export interface SendModalFormValues {
  assetAmount: AssetAmountInterface;
  asset: TokenInterface;
  receiverPublicKeyHash: string;
  amount?: BigNumber;
  ownAccount: WalletAccountInterface;
  transferBetweenOwnAccounts: boolean;
}

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  assetAmount: object().shape({
    asset: object().shape({}).required(makeRequiredErrorMessage('Asset')),
    amount: bigNumberValidation
      .clone()
      .required(makeRequiredErrorMessage('Amount'))
      .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
        if (value instanceof BigNumber) {
          return value.gt(0);
        }

        return false;
      })
  }),
  asset: object().shape({}).required(makeRequiredErrorMessage('Asset')),
  receiverPublicKeyHash: string()
    .when('transferBetweenOwnAccounts', (value: boolean, schema: StringSchema) =>
      value ? schema : walletAddressValidation
    )
    .ensure(),
  amount: bigNumberValidation
    .clone()
    .required(makeRequiredErrorMessage('Amount'))
    .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
      if (value instanceof BigNumber) {
        return value.gt(0);
      }

      return false;
    }),
  ownAccount: object()
    .shape({})
    .when('transferBetweenOwnAccounts', (value: boolean, schema: AnyObjectSchema) =>
      value ? schema.required(makeRequiredErrorMessage('To')) : schema
    ) as SchemaOf<WalletAccountInterface>,
  transferBetweenOwnAccounts: boolean().required()
});
