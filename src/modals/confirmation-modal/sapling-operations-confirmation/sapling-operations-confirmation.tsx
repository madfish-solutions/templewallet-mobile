import { ParamsWithKind } from '@taquito/taquito';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useIsSaplingPreparingSelector } from 'src/store/sapling';

import { InternalOperationsConfirmation } from '../internal-operations-confirmation/internal-operations-confirmation';
import { RebalanceAfterPreview } from '../rebalance-confirmation/rebalance-after-preview';
import { SaplingPreparationLoading } from '../sapling-preparation-loading/sapling-preparation-loading';
import { SaplingSendPreview } from '../sapling-send-preview/sapling-send-preview';

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }
});

interface RebalanceProps {
  variant: 'rebalance';
  opParams: ParamsWithKind[];
  amount: string;
  direction: 'shield' | 'unshield';
}

interface SendProps {
  variant: 'send';
  opParams: ParamsWithKind[];
  amount: string;
  saplingType: 'shield' | 'unshield' | 'transfer';
  modalTitle?: string;
  testID?: string;
  disclaimerMessage?: string;
}

type Props = RebalanceProps | SendProps;

export const SaplingOperationsConfirmation = (props: Props) => {
  const isPreparing = useIsSaplingPreparingSelector();
  const [isEstimationReady, setIsEstimationReady] = useState(false);

  const handleEstimationComplete = useCallback(() => setIsEstimationReady(true), []);

  const showLoader = !isEstimationReady;

  const renderPreview = useCallback(() => {
    if (props.variant === 'rebalance') {
      return <RebalanceAfterPreview amount={props.amount} direction={props.direction} />;
    }

    return <SaplingSendPreview amount={props.amount} saplingType={props.saplingType} />;
  }, [props]);

  const modalTitle = props.variant === 'rebalance' ? 'Confirm Rebalance' : props.modalTitle;

  return (
    <View style={styles.fill}>
      {showLoader && <SaplingPreparationLoading />}
      {!isPreparing && (
        <View style={showLoader ? styles.hidden : styles.fill}>
          <InternalOperationsConfirmation
            opParams={props.opParams}
            modalTitle={modalTitle}
            testID={props.variant === 'send' ? props.testID : undefined}
            disclaimerMessage={props.variant === 'send' ? props.disclaimerMessage : undefined}
            renderPreview={renderPreview}
            onEstimationComplete={handleEstimationComplete}
          />
        </View>
      )}
    </View>
  );
};
