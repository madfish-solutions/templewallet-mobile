import { Farm } from 'src/apis/quipuswap-staking/types';
import { formatTimespan } from 'src/utils/date.utils';

export const useVestingPeriod = (farm: Farm) => {
  const vestingPeriodSeconds = Number(farm.vestingPeriodSeconds);
  const formattedVestingPeriod = formatTimespan(vestingPeriodSeconds * 1000, {
    roundingMethod: 'ceil',
    unit: 'day'
  });

  return { vestingPeriodSeconds, formattedVestingPeriod };
};
