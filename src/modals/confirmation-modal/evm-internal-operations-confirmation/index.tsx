import React, { FC, useMemo } from 'react';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';

import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../common/evm-transaction-fee-details';
import { EvmTransferPreview } from '../common/evm-transfer-preview';
import { useEvmConfirmAction } from '../common/hooks/use-evm-confirm-action';
import { useEvmTransactionSubmission } from '../common/hooks/use-evm-transaction-submission';
import { EvmInternalOperationsConfirmationModalParams } from '../confirmation-modal.params';

import { useEvmTransferFee } from './hooks/use-evm-transfer-fee';

type Props = Omit<EvmInternalOperationsConfirmationModalParams, 'type'>;

const renderHeaderTitle = () => <HeaderTitle title="Confirm Send" />;

export const EvmInternalOperationsConfirmation: FC<Props> = ({ accountId, asset, receiverAddress, atomicAmount }) => {
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const sourceAccount = accounts.find(account => account.id === accountId);
  const sourceAddress = sourceAccount ? getAccountAddressForEvm(sourceAccount) : undefined;
  const request = useMemo(
    () => (sourceAddress ? buildEvmTransferRequest(sourceAddress, receiverAddress, asset, atomicAmount) : undefined),
    [asset, atomicAmount, receiverAddress, sourceAddress]
  );
  const feeState = useEvmTransferFee({ sourceAddress, request, asset });
  const { isSubmitting, submit } = useEvmTransactionSubmission({
    chainId: asset.chainId,
    sourceAddress,
    request
  });
  const confirmAction = useEvmConfirmAction({ feeState, isSubmitting, submit });

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  return (
    <ConfirmationLayout
      account={sourceAccount}
      accountChainKind={TempleChainKind.EVM}
      preview={<EvmTransferPreview asset={asset} receiverAddress={receiverAddress} atomicAmount={atomicAmount} />}
      details={<EvmTransactionFeeDetails feeState={feeState} />}
      backAction={{ disabled: isSubmitting, onPress: goBack }}
      confirmAction={confirmAction}
    />
  );
};
