import { object, SchemaOf } from 'yup';

import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { emptyTezosLikeToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';

import { makeRequiredErrorMessage } from './messages';

export const assetValidation: SchemaOf<TokenInterface> = object()
  .shape({})
  .required(makeRequiredErrorMessage('Token'))
  .test('is-equal', 'Asset must be selected', (value: TokenInterface) => {
    const isEqual = tokenEqualityFn(value, emptyTezosLikeToken);
    if (isEqual || !isDefined(value.symbol)) {
      return false;
    }

    return true;
  }) as SchemaOf<TokenInterface>;
