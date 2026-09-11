import React, { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { isDefined } from 'src/utils/is-defined';

import { OperationPreviewCard } from '../../common/operation-preview-card';

import { useWcEvmBalancesChangesPreview } from './use-wc-evm-balances-changes-preview.hook';
import { WcBalancesChangesPreviewGroups } from './wc-balances-changes-preview-groups';
import { useWcTransactionPreviewStyles } from './wc-transaction-preview.styles';

interface Props {
  transaction: ParsedEvmRpcTransactionRequest;
  chainId: number;
  accountAddress: HexString;
}

export const WcTransferPreview: FC<Props> = ({ transaction, chainId, accountAddress }) => {
  const styles = useWcTransactionPreviewStyles();
  const { groups, getAsset, isLoading } = useWcEvmBalancesChangesPreview(transaction, chainId, accountAddress);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isDefined(groups) || groups.length === 0) {
    return (
      <OperationPreviewCard
        iconSeed={transaction.to}
        description={isDefined(transaction.to) ? 'Contract interaction' : 'Contract creation'}
        publicKeyHash={transaction.to}
      />
    );
  }

  return (
    <WcBalancesChangesPreviewGroups
      groups={groups}
      getAsset={getAsset}
      getDescription={group => (isDefined(group.receiver) ? 'Transfer to' : 'Balance changes')}
    />
  );
};
