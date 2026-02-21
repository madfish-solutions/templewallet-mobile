import React, { FC } from 'react';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { DAppOperationsConfirmation } from './d-app-operations-confirmation/d-app-operations-confirmation';
import { InternalOperationsConfirmation } from './internal-operations-confirmation/internal-operations-confirmation';

export const ConfirmationModal: FC = () => (
  <>
    <ModalStatusBar />
    <ConfirmationModalContent />
  </>
);

const ConfirmationModalContent: FC = () => {
  const params = useModalParams<ModalsEnum.Confirmation>();

  usePageAnalytic(ModalsEnum.Confirmation);

  switch (params.type) {
    case ConfirmationTypeEnum.InternalOperations:
      return (
        <InternalOperationsConfirmation
          opParams={params.opParams}
          modalTitle={params.modalTitle}
          testID={params.testID}
          disclaimerMessage={params.disclaimerMessage}
        />
      );
    case ConfirmationTypeEnum.DAppOperations:
      return <DAppOperationsConfirmation loading={params.loading} message={params.message} />;
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <DataPlaceholder text="This kind of operations isn't supported yet." />
        </ScreenContainer>
      );
  }
};
