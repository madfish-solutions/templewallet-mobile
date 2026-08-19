import React, { FC, useMemo } from 'react';

import { EvmOperationKind, getOperationKind } from 'src/utils/evm/on-chain/transactions';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';

import { WcApprovalPreview } from './wc-approval-preview';
import { WcGenericTransactionPreview } from './wc-generic-transaction-preview';
import { WcTransferPreview } from './wc-transfer-preview';

interface Props {
  transaction: ParsedEvmRpcTransactionRequest;
  chainId: number;
  accountAddress?: HexString;
}

export const WcTransactionPreview: FC<Props> = ({ transaction, chainId, accountAddress }) => {
  const kind = useMemo(() => getOperationKind(transaction), [transaction]);

  if (kind === EvmOperationKind.Approval) {
    return <WcApprovalPreview transaction={transaction} chainId={chainId} accountAddress={accountAddress} />;
  }

  if (kind === EvmOperationKind.Send) {
    return <WcTransferPreview transaction={transaction} chainId={chainId} accountAddress={accountAddress} />;
  }

  return <WcGenericTransactionPreview transaction={transaction} chainId={chainId} accountAddress={accountAddress} />;
};
