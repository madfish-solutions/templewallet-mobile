import React, { useState } from 'react';
import { View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { formatSize } from '../../styles/format-size';
import { useManageAccountsStyles } from './manage-accounts.styles';
import { ManageHdAccounts } from './manage-hd-accounts/manage-hd-accounts';
import { ManageImportedAccounts } from './manage-imported-accounts/manage-imported-accounts';

const manageHdAccountsIndex = 0;

export const ManageAccounts = () => {
  const styles = useManageAccountsStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageHdAccounts = segmentedControlIndex === manageHdAccountsIndex;

  return (
    <>
      <Divider size={formatSize(8)} />
      <View style={styles.segmentControlContainer}>
        <TextSegmentControl
          selectedIndex={segmentedControlIndex}
          values={['HD', 'Imported']}
          onChange={setSegmentedControlIndex}
        />
      </View>

      <Divider size={formatSize(8)} />

      {showManageHdAccounts ? <ManageHdAccounts /> : <ManageImportedAccounts />}
    </>
  );
};
