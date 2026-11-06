import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { OperationPreviewAssetAmounts } from '../operation-preview-asset-amounts';
import { OperationPreviewCard } from '../operation-preview-card';

import { useEvmApprovalPreviewStyles } from './styles';

interface Props {
  spender?: HexString;
  amount?: string;
  asset?: AssetInterface;
}

export const EvmApprovalPreview: FC<Props> = ({ spender, amount, asset }) => {
  const styles = useEvmApprovalPreviewStyles();

  return (
    <OperationPreviewCard iconSeed={spender} description="Approve" publicKeyHash={spender}>
      {isDefined(amount) && (
        <View>
          <Divider size={formatSize(8)} />
          {isDefined(asset) ? (
            <OperationPreviewAssetAmounts
              amount={amount}
              asset={asset}
              showDollar={isDefined(asset.exchangeRate)}
              textStyle={styles.approvalAmountToken}
            />
          ) : (
            <Text style={styles.amountToken}>{amount} ???</Text>
          )}
        </View>
      )}
    </OperationPreviewCard>
  );
};
