import { isDefined } from './is-defined';

export const isString = <T>(value: T | undefined | null | string): value is T => isDefined(value) && value !== '';
