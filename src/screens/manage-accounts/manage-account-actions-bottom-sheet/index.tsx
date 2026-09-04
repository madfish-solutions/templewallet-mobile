import React, { FC } from 'react';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button.tsx';
import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet.tsx';
import { BottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller.ts';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { ModalsEnum } from 'src/navigator/enums/modals.enum.ts';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook.ts';
import { formatSize } from 'src/styles/format-size.ts';

import { ManageAccountActionsBottomSheetSelectors } from './selectors.ts';

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
