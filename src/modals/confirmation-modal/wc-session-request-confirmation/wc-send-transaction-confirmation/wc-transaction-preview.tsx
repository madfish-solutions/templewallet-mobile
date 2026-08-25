import React, { FC, useMemo } from 'react';

import { EvmOperationKind, getOperationKind } from 'src/utils/evm/on-chain/transactions';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';

import { WcApprovalPreview } from './wc-approval-preview';
import { WcGenericTransactionPreview } from './wc-generic-transaction-preview';
import { WcTransferPreview } from './wc-transfer-preview';

interface Props {
  transaction: ParsedEvmRpcTransactionRequest;
  chainId: number;
  accountAddress: HexString;
}

export const WcTransactionPreview: FC<Props> = props => {
  const kind = useMemo(() => getOperationKind(props.transaction), [props.transaction]);

  switch (kind) {
    case EvmOperationKind.Approval:
      return <WcApprovalPreview {...props} />;
    case EvmOperationKind.Send:
      return <WcTransferPreview {...props} />;
    default:
      return <WcGenericTransactionPreview {...props} />;
  }
};
