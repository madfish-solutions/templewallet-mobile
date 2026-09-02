import React, { FC } from 'react';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { BottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Account } from 'src/interfaces/account.interfaces';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { ManageAccountActionsBottomSheetSelectors } from './manage-account-actions-bottom-sheet.selectors';

interface Props {
  account: Account | null;
  controller: BottomSheetController;
}

export const ManageAccountActionsBottomSheet: FC<Props> = ({ account, controller }) => {
  const navigateToModal = useNavigateToModal();

  const openModal = (modal: ModalsEnum.RenameAccount | ModalsEnum.RevealPrivateKey) => {
    if (!account) return;

    navigateToModal(modal, { account });
    controller.close();
  };

  return (
    <BottomSheet
      description="Select what do you want to manage:"
      contentHeight={formatSize(180)}
      controller={controller}
    >
      <BottomSheetActionButton
        title="Edit name"
        onPress={() => openModal(ModalsEnum.RenameAccount)}
        testID={ManageAccountActionsBottomSheetSelectors.editNameButton}
      />
      <BottomSheetActionButton
        title="Reveal private key"
        onPress={() => openModal(ModalsEnum.RevealPrivateKey)}
        testID={ManageAccountActionsBottomSheetSelectors.revealPrivateKeyButton}
      />
    </BottomSheet>
  );
};
