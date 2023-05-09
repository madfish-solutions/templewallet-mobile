import { TopUpProviderPairLimits } from '../interfaces/topup.interface';
import { isDefined } from './is-defined';

export const intersectAssetsLimits = (limits: Array<Partial<TopUpProviderPairLimits> | undefined>) =>
  limits.reduce<Partial<TopUpProviderPairLimits>>((result, limits) => {
    const { min, max } = limits ?? {};

    if (isDefined(min)) {
      result.min = Math.max(result.min ?? 0, min);
    }
    if (isDefined(max)) {
      result.max = Math.min(result.max ?? Infinity, max);
    }

    return result;
  }, {});
