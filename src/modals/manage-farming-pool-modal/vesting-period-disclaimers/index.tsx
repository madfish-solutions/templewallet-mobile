import React, { FC } from 'react';
import { Text } from 'react-native';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { formatTimespan, SECONDS_IN_DAY } from 'src/utils/date.utils';

import { useVestingPeriodDisclaimersStyles } from './styles';

interface Props {
  farm: Farm;
}

export const VestingPeriodDisclaimers: FC<Props> = ({ farm }) => {
  const vestingPeriodSeconds = Number(farm.vestingPeriodSeconds);
  const formattedVestingPeriod = formatTimespan(vestingPeriodSeconds * 1000, {
    roundingMethod: 'ceil',
    unit: vestingPeriodSeconds < SECONDS_IN_DAY ? 'hour' : 'day'
  });
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
      {vestingPeriodSeconds > 0 && vestingPeriodSeconds <= SECONDS_IN_DAY && (
        <Disclaimer title="Staking pool with lock period" iconName={IconNameEnum.AlertMonochrome}>
          <Text style={styles.disclaimerDescriptionText}>
            To receive the full reward, you are required to stake your assets for{' '}
            <Text style={styles.emphasized}>{formattedVestingPeriod}</Text>. Claiming earlier results in smaller reward
            allocation and distributes the difference to the full rewards back to the pool.
          </Text>
          <Divider size={formatSize(4)} />
        </Disclaimer>
      )}
      {vestingPeriodSeconds > 0 && <Divider size={formatSize(16)} />}
    </>
  );
};
