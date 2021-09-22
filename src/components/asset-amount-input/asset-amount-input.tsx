import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { Label } from '../label/label';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { useAssetAmountInputStyles } from './asset-amount-input.styles';

export const AssetAmountInput = () => {
  const styles = useAssetAmountInputStyles();
  const [inputTypeIndex, setInputTypeIndex] = useState(0);

  const hasExchangeRate = true;
  const hasFrozenBalance = true;

  return (
    <>
      <View style={styles.headerContainer}>
        <Label label="Asset" />
        {hasExchangeRate && (
          <TextSegmentControl
            width={formatSize(92)}
            selectedIndex={inputTypeIndex}
            values={['TEZ', 'USD']}
            onChange={setInputTypeIndex}
          />
        )}
      </View>
      <Divider size={formatSize(8)} />

      <Text style={{ width: '100%', backgroundColor: 'red' }}>input</Text>
      <Divider size={formatSize(8)} />

      <View style={styles.footerContainer}>
        <View>{hasExchangeRate && <Text style={styles.equivalentValueText}>≈ 5.48 $</Text>}</View>
        <View style={styles.balanceContainer}>
          {hasFrozenBalance && (
            <>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceDescription}>Frozen Balance:</Text>
                <Divider size={formatSize(4)} />
                <Text style={styles.balanceValueText}>10 000 000.00 TEZ</Text>
              </View>
              <Divider size={formatSize(8)} />
            </>
          )}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceDescription}>Total Balance:</Text>
            <Divider size={formatSize(4)} />
            <Text style={styles.balanceValueText}>10 000 000.00 TEZ</Text>
          </View>
        </View>
      </View>
    </>
  );
};
