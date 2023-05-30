import { isDefined } from './is-defined';

export interface PairLimits {
  min: number;
  max: number;
}

export const intersectAssetsLimits = (limits: (Partial<PairLimits> | undefined)[]) =>
  limits.reduce<Partial<PairLimits>>((result, limits) => {
    const { min, max } = limits ?? {};

    if (isDefined(min)) {
      result.min = Math.max(result.min ?? 0, min);
    }
    if (isDefined(max)) {
      result.max = Math.min(result.max ?? Infinity, max);
    }

    return result;
  }, {});

export const mergeAssetsLimits = (limits: (Partial<PairLimits> | undefined)[]) =>
  limits.reduce<Partial<PairLimits>>((result, limits) => {
    const { min, max } = limits ?? {};

    if (isDefined(min)) {
      result.min = Math.min(result.min ?? Infinity, min);
    }
    if (isDefined(max)) {
      result.max = Math.max(result.max ?? 0, max);
    }

    return result;
  }, {});
