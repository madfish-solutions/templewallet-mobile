import React, { FC } from 'react';
import { Text } from 'react-native';
import useSWR from 'swr';

import { getAsyncStorageUsageDetails } from 'src/utils/get-async-storage-details';

import { StatsRow } from './stats-row';
import { useAsyncStorageDetailsStyles } from './styles';

export const AsyncStorageDetails: FC = () => {
  const styles = useAsyncStorageDetailsStyles();
  const { data: asyncStorageDetails } = useSWR('asyncStorageDetails', getAsyncStorageUsageDetails);

  return asyncStorageDetails ? (
    <>
      <Text style={styles.title}>Async storage summary:</Text>
      <StatsRow name="Total values size" value={`${asyncStorageDetails.totalValuesSize} B`} />
      <StatsRow
        name="Keys with oversize"
        value={asyncStorageDetails.oversizeForKeys.length > 0 ? asyncStorageDetails.oversizeForKeys.join(', ') : '-'}
      />
      <Text style={styles.title}>Keys sizes:</Text>
      {Object.entries(asyncStorageDetails.sizesByKey).map(([key, value]) => (
        <StatsRow key={key} name={key} value={`${value} B`} />
      ))}
    </>
  ) : (
    <Text style={styles.title}>Loading async storage details...</Text>
  );
};
