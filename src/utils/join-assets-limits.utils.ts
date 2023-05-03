import { TopUpProviderPairLimits } from '../interfaces/topup.interface';
import { isDefined } from './is-defined';

export const joinAssetsLimits = (limits: Array<Partial<TopUpProviderPairLimits> | undefined>) =>
  limits.reduce<Partial<TopUpProviderPairLimits>>((result, limits) => {
    const { min, max } = limits ?? {};

    if (isDefined(min)) {
      result.min = Math.min(result.min ?? Infinity, min);
    }
    if (isDefined(max)) {
      result.max = Math.max(result.max ?? 0, max);
    }

    return result;
  }, {});
