import React, { useCallback, useMemo } from 'react';

import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { useBridgeAccountAddresses } from 'src/hooks/use-bridge-account-addresses.hook';
import { buildBridgeDepositOpParams } from 'src/utils/etherlink-bridge/deposit-op-params';

import { InternalOperationsConfirmation } from '../common/internal-operations-confirmation';

import { BridgePreview } from './bridge-preview';

interface Props {
  amountMutez: string;
}

export const BridgeDepositConfirmation = ({ amountMutez }: Props) => {
  const addresses = useBridgeAccountAddresses();

  if (!addresses) {
    throw new DeadEndBoundaryError();
  }

  const { tezosAddress, evmAddress } = addresses;

  const confirmEventProperties = useMemo(() => ({ direction: 'deposit', amount: amountMutez }), [amountMutez]);
  const opParams = useMemo(() => buildBridgeDepositOpParams(amountMutez, evmAddress), [amountMutez, evmAddress]);

  const renderPreview = useCallback(
    () => (
      <BridgePreview
        direction="deposit"
        amountMutez={amountMutez}
        receiveMutez={amountMutez}
        sourceAddress={tezosAddress}
        destinationAddress={evmAddress}
      />
    ),
    [amountMutez, tezosAddress, evmAddress]
  );

  return (
    <InternalOperationsConfirmation
      opParams={opParams}
      modalTitle="Confirm Bridge"
      renderPreview={renderPreview}
      confirmEventProperties={confirmEventProperties}
      testID="BRIDGE_TRANSACTION_SENT"
    />
  );
};
