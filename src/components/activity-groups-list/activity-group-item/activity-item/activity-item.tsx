import { Activity } from '@temple-wallet/transactions-parser';
import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { formatSize } from 'src/styles/format-size';

import { Details } from '../details';
import { Info } from '../info/info';

interface Props {
  activity: Activity;
}

export const ActivityItem: FC<Props> = ({ activity }) => {
  const nonZeroAmounts = useNonZeroAmounts(activity.tokensDeltas);
  console.log('nonZeroAmounts: ', nonZeroAmounts);

  return (
    <View>
      <Info activity={activity} nonZeroAmounts={nonZeroAmounts} />
      <Divider size={formatSize(12)} />
      <Details activity={activity} nonZeroAmounts={nonZeroAmounts} />
    </View>
  );
};
