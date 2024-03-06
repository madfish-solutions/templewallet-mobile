import React, { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from 'src/components/divider/divider';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useNoInternetWarningToast } from '../../hooks/use-no-internet-warning-toast';

import { ManageAccountsSelectors } from './manage-accounts.selectors';
import { useManageAccountsStyles } from './manage-accounts.styles';
import { ManageHdAccounts } from './manage-hd-accounts/manage-hd-accounts';
import { ManageImportedAccounts } from './manage-imported-accounts/manage-imported-accounts';

const manageHdAccountsIndex = 0;

export const ManageAccounts = () => {
  const { navigate } = useNavigation();
  const { createHdAccount } = useShelter();
  const { trackEvent } = useAnalytics();

  const styles = useManageAccountsStyles();

  const handleNoInternet = useNoInternetWarningToast();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageHdAccounts = segmentedControlIndex === manageHdAccountsIndex;
  const revealSelectBottomSheetController = useBottomSheetController();

  usePageAnalytic(ScreensEnum.ManageAccounts);
  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Manage Accounts" />,
      <HeaderButton
        iconName={IconNameEnum.PlusIconOrange}
        onPress={() => revealSelectBottomSheetController.open()}
        testID={ManageAccountsSelectors.addAccountButton}
      />
    ),
    []
  );

  return (
    <>
      <Divider size={formatSize(8)} />
      <View style={styles.segmentControlContainer}>
        <TextSegmentControl
          selectedIndex={segmentedControlIndex}
          values={['HD', 'Imported']}
          testID={ManageAccountsSelectors.accountsTypeSwitcher}
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
        <BottomSheetActionButton
          key="create-new-hd-account"
          title="Create new HD account"
          onPress={handleNoInternet(() => {
            trackEvent(ManageAccountsSelectors.createNewHDAccountButton, AnalyticsEventCategory.ButtonPress);
            createHdAccount();
            revealSelectBottomSheetController.close();
          })}
          testID={ManageAccountsSelectors.createNewHDAccountButton}
        />
        <BottomSheetActionButton
          key="import-an-account"
          title="Import an account"
          onPress={handleNoInternet(() => {
            navigate(ModalsEnum.ChooseAccountImportType);
            revealSelectBottomSheetController.close();
          })}
          testID={ManageAccountsSelectors.importAnAccountButton}
        />
      </BottomSheet>
    </>
  );
};
