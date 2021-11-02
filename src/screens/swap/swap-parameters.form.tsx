import { BigNumber } from 'bignumber.js';
import { object } from 'yup';

import { bigNumberValidation } from '../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';

export const swapFormInitialValues = (tezosToken: TokenInterface) => ({
  swapFromField: {
    asset: tezosToken,
    amount: new BigNumber(0)
  },
  swapToField: {
    asset: emptyToken,
    amount: new BigNumber(0)
  }
});

export const swapFormValidationSchema = object().shape({
  // TODO: move validation in separate file (also reuse in send modal form)
  swapFromField: object().shape({
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
  swapToField: object().shape({
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
  })
});
