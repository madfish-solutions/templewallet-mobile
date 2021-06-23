import React, { FC } from 'react';

import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

export const InternalOperationsConfirmation: FC<Props> = ({ sender, opParams }) => {
  const { goBack, navigate } = useNavigation();

  return (
    <OperationsConfirmation
      sender={sender}
      opParams={opParams}
      onSuccessSend={() => navigate(StacksEnum.MainStack)}
      onBackButtonPress={goBack}
    />
  );
};
