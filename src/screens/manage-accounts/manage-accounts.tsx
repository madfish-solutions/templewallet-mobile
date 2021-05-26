import React, { useState } from 'react';

import { Divider } from '../../components/divider/divider';
import { useScreenHeader } from '../../components/header/use-screen-header.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { formatSize } from '../../styles/format-size';
import { ManageHdAccounts } from './manage-hd-accounts/manage-hd-accounts';
import { ManageImportedAccounts } from './manage-imported-accounts/manage-imported-accounts';

const manageHdAccountsIndex = 0;

export const ManageAccounts = () => {
  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageHdAccounts = segmentedControlIndex === manageHdAccountsIndex;

  useScreenHeader('Manage Accounts');

  return (
    <ScreenContainer>
      <TextSegmentControl
        selectedIndex={segmentedControlIndex}
        values={['HD', 'Imported']}
        onChange={setSegmentedControlIndex}
      />
      <Divider height={formatSize(16)} />

      {showManageHdAccounts ? <ManageHdAccounts /> : <ManageImportedAccounts />}
    </ScreenContainer>
  );
};
