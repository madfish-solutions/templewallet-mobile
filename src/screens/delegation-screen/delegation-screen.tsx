import React from 'react';

import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectBakerBottomSheet } from './select-baker-bottom-sheet/select-baker-bottom-sheet';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const [selectedBaker, isBakerSelected] = useSelectedBakerSelector();
  const selectBakerBottomSheetController = useBottomSheetController();

  return (
    <>
      {isBakerSelected ? (
        <SelectedBakerScreen baker={selectedBaker} onRedelegatePress={selectBakerBottomSheetController.open} />
      ) : (
        <AboutDelegationScreen onDelegatePress={selectBakerBottomSheetController.open} />
      )}

      <SelectBakerBottomSheet controller={selectBakerBottomSheetController} />
    </>
  );
};
