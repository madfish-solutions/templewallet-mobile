import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

export const bigNumberValidation: SchemaOf<BigNumber> = object().shape({}) as SchemaOf<BigNumber>;
