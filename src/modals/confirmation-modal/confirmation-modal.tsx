import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { usePreparedOpParamsSelector } from 'src/store/sapling';
import { cancelSaplingPreparationAction, clearPreparedOpParamsAction } from 'src/store/sapling/sapling-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { DAppOperationsConfirmation } from './d-app-operations-confirmation/d-app-operations-confirmation';
import { InternalOperationsConfirmation } from './internal-operations-confirmation/internal-operations-confirmation';
import { SaplingOperationsConfirmation } from './sapling-operations-confirmation/sapling-operations-confirmation';

export const ConfirmationModal: FC = () => (
  <>
    <ModalStatusBar />
    <ConfirmationModalContent />
  </>
);

const ConfirmationModalContent: FC = () => {
  const dispatch = useDispatch();
  const params = useModalParams<ModalsEnum.Confirmation>();
  const preparedOpParams = usePreparedOpParamsSelector();

  useEffect(() => {
    return () => {
      dispatch(cancelSaplingPreparationAction());
      dispatch(clearPreparedOpParamsAction());
    };
  }, [dispatch]);

  usePageAnalytic(ModalsEnum.Confirmation);

  switch (params.type) {
    case ConfirmationTypeEnum.InternalOperations: {
      const { saplingAmount, saplingType } = params;

      if (saplingAmount && saplingType) {
        const opParams = preparedOpParams ?? params.opParams;

        return (
          <SaplingOperationsConfirmation
            variant="send"
            opParams={opParams}
            amount={saplingAmount}
            saplingType={saplingType}
            modalTitle={params.modalTitle}
            testID={params.testID}
            disclaimerMessage={params.disclaimerMessage}
          />
        );
      }

      return (
        <InternalOperationsConfirmation
          opParams={params.opParams}
          modalTitle={params.modalTitle}
          testID={params.testID}
          disclaimerMessage={params.disclaimerMessage}
        />
      );
    }
    case ConfirmationTypeEnum.DAppOperations:
      return <DAppOperationsConfirmation loading={params.loading} message={params.message} />;
    case ConfirmationTypeEnum.RebalanceOperation:
      return (
        <SaplingOperationsConfirmation
          variant="rebalance"
          opParams={preparedOpParams ?? params.opParams ?? []}
          amount={params.amount}
          direction={params.direction}
        />
      );
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <DataPlaceholder text="This kind of operations isn't supported yet." />
        </ScreenContainer>
      );
  }
};
