import { BeaconMessageType } from '@airgap/beacon-sdk';
import React, { FC } from 'react';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { DAppOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { PermissionRequestConfirmation } from './permission-request-confirmation/permission-request-confirmation';
import { SignPayloadRequestConfirmation } from './sign-payload-request-confirmation /sign-payload-request-confirmation';

type Props = Omit<DAppOperationsConfirmationModalParams, 'type'>;

export const DAppOperationsConfirmation: FC<Props> = ({ message }) => {
  switch (message.type) {
    case BeaconMessageType.PermissionRequest:
      return <PermissionRequestConfirmation message={message} />;
    case BeaconMessageType.SignPayloadRequest:
      return <SignPayloadRequestConfirmation message={message} />;
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <DataPlaceholder text="This kind of operations isn't supported yet." />
        </ScreenContainer>
      );
  }
};
