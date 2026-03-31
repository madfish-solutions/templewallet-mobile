import React, { FC } from 'react';
import { View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useTezosToken } from 'src/utils/wallet.utils';

import { useOperationsPreviewItemStyles } from '../operations-confirmation/operations-preview/operations-preview-item/operations-preview-item.styles';

interface Props {
  amount: string;
  saplingType: 'shield' | 'unshield' | 'transfer';
}

export const SaplingSendPreview: FC<Props> = ({ amount, saplingType }) => {
  const styles = useOperationsPreviewItemStyles();
  const accountPkh = useCurrentAccountPkhSelector();
  const amountToken = useTezosToken(amount);

  const label = saplingType === 'shield' ? 'TEZ sent' : 'Shielded TEZ sent';

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.infoContainer}>
          <RobotIcon seed={accountPkh} size={formatSize(32)} />
          <Divider size={formatSize(10)} />
          <TruncatedText style={styles.description}>{label}</TruncatedText>
        </View>
      </View>
      <View>
        <AssetValueText amount={amount} asset={amountToken} style={styles.amountToken} showMinusSign />
        <Divider size={formatSize(8)} />
        <AssetValueText convertToDollar amount={amount} asset={amountToken} style={styles.amountDollar} showMinusSign />
      </View>
    </View>
  );
};
