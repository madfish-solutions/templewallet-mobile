import React, { memo, ReactNode } from 'react';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';

interface CollectibleModalAction {
  disabled?: boolean;
  isLoading?: boolean;
  onPress: EmptyFn;
  testID?: string;
  title: string;
}

interface Props {
  action: CollectibleModalAction;
  children: ReactNode;
  scrollEnabled?: boolean;
}

export const CollectibleModalLayout = memo<Props>(({ action, children, scrollEnabled }) => (
  <>
    <ScreenContainer isFullScreenMode scrollEnabled={scrollEnabled}>
      <ModalStatusBar />
      {children}
    </ScreenContainer>

    <ModalButtonsFloatingContainer variant="bordered">
      <ButtonLargePrimary {...action} />
    </ModalButtonsFloatingContainer>
  </>
));
