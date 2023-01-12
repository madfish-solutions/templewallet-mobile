import React, { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from '../../components/divider/divider';
import { generateScreenOptions } from '../../components/header/generate-screen-options.util';
import { HeaderButton } from '../../components/header/header-button/header-button';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { useManageAccountsStyles } from './manage-accounts.styles';
import { ManageHdAccounts } from './manage-hd-accounts/manage-hd-accounts';
import { ManageImportedAccounts } from './manage-imported-accounts/manage-imported-accounts';

const manageHdAccountsIndex = 0;

enum AccountTypes {
  HD = 'HD',
  Imported = 'Imported'
}

const accountsLabels: Record<AccountTypes, string> = {
  [AccountTypes.HD]: 'Create new HD account',
  [AccountTypes.Imported]: 'Import an account'
};

const accountsOptions: Array<AccountTypes> = [AccountTypes.HD, AccountTypes.Imported];

export const ManageAccounts = () => {
  const { navigate } = useNavigation();
  const { createHdAccount } = useShelter();

  const styles = useManageAccountsStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageHdAccounts = segmentedControlIndex === manageHdAccountsIndex;
  const revealSelectBottomSheetController = useBottomSheetController();

  usePageAnalytic(ScreensEnum.ManageAccounts);
  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Manage Accounts" />,
      <HeaderButton iconName={IconNameEnum.PlusIconOrange} onPress={() => revealSelectBottomSheetController.open()} />
    ),
    []
  );

  const handlers = {
    [AccountTypes.HD]: () => createHdAccount(),
    [AccountTypes.Imported]: () => navigate(ModalsEnum.ImportAccount)
  };

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
      <BottomSheet
        description="Select a method to add an account:"
        contentHeight={formatSize(180)}
        controller={revealSelectBottomSheetController}
      >
        {accountsOptions.map(value => (
          <BottomSheetActionButton
            key={value}
            title={accountsLabels[value]}
            onPress={() => {
              handlers[value]();
              revealSelectBottomSheetController.close();
            }}
          />
        ))}
      </BottomSheet>
    </>
  );
};
