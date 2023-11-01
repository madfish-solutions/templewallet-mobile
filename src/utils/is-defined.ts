export const isDefined = <T>(value: T | undefined | null | void): value is T => value !== undefined && value !== null;
