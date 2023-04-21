/** From lodash */
type Truthy<T> = T extends null | undefined | void | false | '' | 0 | 0n ? never : T;

export const isTruthy = <T>(value: T): value is Truthy<T> => Boolean(value);
