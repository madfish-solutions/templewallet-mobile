/** `NaN` is not a type, but is considered a 'falsy' too */
type AllFalsyTypes = null | undefined | void | false | '' | 0 | 0n;

type IsTruthy<T> = T extends AllFalsyTypes ? never : T;

export const isTruthy = <T>(value: T): value is IsTruthy<T> => Boolean(value);
