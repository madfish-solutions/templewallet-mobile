import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { formatTimespan, SECONDS_IN_DAY, SECONDS_IN_HOUR, SECONDS_IN_MINUTE } from 'src/utils/date.utils';

import { useVestingPeriodDisclaimersStyles } from './styles';

interface Props {
  earnOpportunityItem: EarnOpportunity;
}

const NEGLIGIBLE_VESTING_PERIOD_SECONDS = 15;

export const VestingPeriodDisclaimers: FC<Props> = ({ earnOpportunityItem }) => {
  const vestingPeriodSeconds = Number(earnOpportunityItem.vestingPeriodSeconds);
  const formattedVestingPeriod = useMemo(() => {
    let unit: 'hour' | 'day' | 'second' | 'minute';
    if (vestingPeriodSeconds < SECONDS_IN_MINUTE) {
      unit = 'second';
    } else if (vestingPeriodSeconds < SECONDS_IN_HOUR) {
      unit = 'minute';
    } else if (vestingPeriodSeconds < SECONDS_IN_DAY) {
      unit = 'hour';
    } else {
      unit = 'day';
    }

    return formatTimespan(vestingPeriodSeconds * 1000, {
      roundingMethod: 'ceil',
      unit
    });
  }, [vestingPeriodSeconds]);
  const styles = useVestingPeriodDisclaimersStyles();

  return (
    <>
      {vestingPeriodSeconds > SECONDS_IN_DAY && (
        <Disclaimer title="Long-term staking pool" iconName={IconNameEnum.AlertMonochrome}>
          <Text style={styles.disclaimerDescriptionText}>The longer you stake, the higher your yield.</Text>
          <Text style={styles.disclaimerDescriptionText}>
            Stake for <Text style={styles.emphasized}>{formattedVestingPeriod}</Text> to receive the full rewards.
            Claiming earlier results in smaller reward allocation and distributes the difference to the full rewards
            back to the pool.
          </Text>
          <Divider size={formatSize(4)} />
        </Disclaimer>
      )}
      {vestingPeriodSeconds > NEGLIGIBLE_VESTING_PERIOD_SECONDS && vestingPeriodSeconds <= SECONDS_IN_DAY && (
        <Disclaimer title="Staking pool with lock period" iconName={IconNameEnum.AlertMonochrome}>
          <Text style={styles.disclaimerDescriptionText}>
            To receive the full reward, you are required to stake your assets for{' '}
            <Text style={styles.emphasized}>{formattedVestingPeriod}</Text>. Claiming earlier results in smaller reward
            allocation and distributes the difference to the full rewards back to the pool.
          </Text>
          <Divider size={formatSize(4)} />
        </Disclaimer>
      )}
      {vestingPeriodSeconds > NEGLIGIBLE_VESTING_PERIOD_SECONDS && <Divider size={formatSize(16)} />}
    </>
  );
};
