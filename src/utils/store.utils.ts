import { EqualityFn } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonEqualityFn: EqualityFn<any> = (left, right) => JSON.stringify(left) === JSON.stringify(right);
