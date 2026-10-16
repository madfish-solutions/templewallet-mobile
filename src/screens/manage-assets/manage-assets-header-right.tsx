import React, { memo } from 'react';

import { HeaderButton } from 'src/components/header/header-button/header-button';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';

export const ManageAssetsHeaderRight = memo(() => {
  const navigateToModal = useNavigateToModal();

  return <HeaderButton iconName={IconNameV2Enum.PlusBig} onPress={() => navigateToModal(ModalsEnum.AddAsset)} />;
});
