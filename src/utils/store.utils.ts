import { isEqual } from 'lodash-es';

export const jsonEqualityFn = <T>(left: T, right: T) => isEqual(left, right);
