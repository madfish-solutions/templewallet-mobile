import React, { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { EvmNetworkEssentials } from 'src/types/networks';
import { MAX_UINT_256 } from 'src/utils/evm/on-chain/common.utils';
import { Approval, getSingleApproval } from 'src/utils/evm/on-chain/transactions';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { isDefined } from 'src/utils/is-defined';

import { EvmApprovalPreview } from '../../common/evm-approval-preview';
import { UNLIMITED_AMOUNT_VALUE } from '../../common/operation-preview-asset-amounts';

import { useWcEvmOperationAsset } from './use-wc-evm-operation-asset.hook';
import { useWcTransactionPreviewStyles } from './wc-transaction-preview.styles';

interface Props {
  transaction: ParsedEvmRpcTransactionRequest;
  chainId: number;
  accountAddress: HexString;
}

const fetchApprovalDetails = (
  transaction: ParsedEvmRpcTransactionRequest,
  accountAddress: HexString,
  network: EvmNetworkEssentials
) => getSingleApproval(transaction, accountAddress, network);

export const WcApprovalPreview: FC<Props> = ({ transaction, chainId, accountAddress }) => {
  const styles = useWcTransactionPreviewStyles();
  const {
    details: approval,
    asset,
    isLoading
  } = useWcEvmOperationAsset<Approval>(transaction, chainId, accountAddress, fetchApprovalDetails);

  let amount: string | undefined;
  if (isDefined(approval)) {
    amount = approval.amount.gte(MAX_UINT_256) ? UNLIMITED_AMOUNT_VALUE : approval.amount.toFixed();
  }

  const spender = approval?.spender;

  return isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <EvmApprovalPreview spender={spender} amount={amount} asset={asset} />
  );
};
