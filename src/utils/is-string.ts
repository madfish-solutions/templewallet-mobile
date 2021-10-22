import { isDefined } from './is-defined';

type MaybeString = string | number | boolean | object | undefined | null;

export const isString = (str: MaybeString): str is string =>
  isDefined(str) && typeof str === 'string' && str.length !== 0;
