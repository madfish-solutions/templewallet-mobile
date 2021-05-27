import { isDefined } from './is-defined';

// eslint-disable-next-line @typescript-eslint/ban-types
type MaybeString = string | number | boolean | object | undefined | null;

// TODO: add unit tests
export const isString = (str: MaybeString): str is string =>
  isDefined(str) && typeof str === 'string' && str.length !== 0;
