import { BigNumber } from 'bignumber.js';
import { object } from 'yup';

import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { emptyTezosLikeToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { bigNumberValidation } from './big-number';
import { makeRequiredErrorMessage } from './messages';

export const assetAmountValidation = object().shape({
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
});

export const assetValidation = object().shape({
  asset: object()
    .shape({})
    .required(makeRequiredErrorMessage('Token'))
    .test('is-equal', 'Token must be selected', (value: TokenInterface) => {
      const isEqual = tokenEqualityFn(value, emptyTezosLikeToken);
      if (isEqual || !isDefined(value.address) || !isDefined(value.symbol)) {
        return false;
      }

      return true;
    })
});
