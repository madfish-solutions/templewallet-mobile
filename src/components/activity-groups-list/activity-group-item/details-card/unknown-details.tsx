import { isEmpty } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';

import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityDetailsStyles } from '../activity-group-item.styles';
import { ItemAmountChange } from '../item-amount-change/item-amount-change';
import { ActivityGroupItemSelectors } from '../selectors';

export const UnknownDetails: FC<{ nonZeroAmounts: Array<ActivityAmount>; hash: string }> = ({
  nonZeroAmounts,
  hash
}) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();

  const commonStyles = useActivityCommonStyles();

  const { positiveAmounts, negativeAmounts } = useMemo(() => {
    const positiveAmounts: Array<ActivityAmount> = [];
    const negativeAmounts: Array<ActivityAmount> = [];

    for (const amount of nonZeroAmounts) {
      if (amount.isPositive) {
        positiveAmounts.push(amount);
      } else {
        negativeAmounts.push(amount);
      }
    }

    return { positiveAmounts, negativeAmounts };
  }, [nonZeroAmounts]);

  return (
    <>
      {!isEmpty(positiveAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Received:</Text>
          <View>
            {positiveAmounts.map(amount => (
              <View style={styles.mb8}>
                <ItemAmountChange amount={amount.parsedAmount} symbol={amount.symbol} />
                {isDefined(amount.fiatAmount) && <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />}
              </View>
            ))}
          </View>
        </View>
      )}
      {!isEmpty(positiveAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Sent:</Text>
          <View>
            {negativeAmounts.map(amount => (
              <View style={styles.mb8}>
                <ItemAmountChange amount={amount.parsedAmount} symbol={amount.symbol} />
                {isDefined(amount.fiatAmount) && <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />}
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
