export type EventFn<T, K = void> = (event: T) => K;
export type EventFnPromisable<T, K = void> = (event: T) => Promise<K>;
/** @deprecated // Declared globally */
export type EmptyFn = () => void;
export const emptyFn = () => void 0;
export const emptyComponent = () => null;

export const DEFAULT_EXPECTED_GAS_EXPENSE = 0.3;
export const delegationApy = 5.6;
export const OPERATION_LIMIT = 50;
export const UNKNOWN_TOKEN_SYMBOL = '???';
