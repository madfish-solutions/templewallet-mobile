import { ActivitySubtype, AllowanceInteractionActivity, InteractionActivity } from '@temple-wallet/transactions-parser';
import { isEmpty } from 'lodash-es';
import React, { FC, memo } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue, separateAmountsBySign } from 'src/utils/activity.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';

import { ActivityGroupAmountChange } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import {
  useActivityCommonStyles,
  useActivityDetailsStyles,
  useActivityGroupItemStyles
} from '../activity-group-item.styles';
import { ItemAmountChange } from '../item-amount-change/item-amount-change';
import { ActivityGroupItemSelectors } from '../selectors';
import { AbstractItem } from './abstract-item';
import { ChangeAllowance } from './change-allowance';
import { ActivityItemProps } from './item.props';

export const Interaction: FC<ActivityItemProps> = memo(({ activity }) => {
  const nonZeroAmounts = useNonZeroAmounts(activity.tokensDeltas);

  switch ((activity as InteractionActivity).subtype) {
    case ActivitySubtype.ChangeAllowance:
      return <ChangeAllowance activity={activity as AllowanceInteractionActivity} />;

    default:
      return (
        <AbstractItem
          status={activity.status}
          timestamp={activity.timestamp}
          face={<Face nonZeroAmounts={nonZeroAmounts} />}
          details={<Details hash={activity.hash} nonZeroAmounts={nonZeroAmounts} />}
        />
      );
  }
});

const Face: FC<{ nonZeroAmounts: Array<ActivityAmount> }> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Interaction</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>-</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};

const Details: FC<{ hash: string; nonZeroAmounts: Array<ActivityAmount> }> = ({ hash, nonZeroAmounts }) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();

  const commonStyles = useActivityCommonStyles();

  const { positiveAmounts, negativeAmounts } = separateAmountsBySign(nonZeroAmounts);

  return (
    <>
      {!isEmpty(positiveAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Received:</Text>
          <View>
            {positiveAmounts.map((amount, index) => (
              <View style={styles.mb8} key={index}>
                <ItemAmountChange amount={amount.parsedAmount} symbol={amount.symbol} />
                {isDefined(amount.fiatAmount) && <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />}
              </View>
            ))}
          </View>
        </View>
      )}
      {!isEmpty(negativeAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Sent:</Text>
          <View>
            {negativeAmounts.map((amount, index) => (
              <View style={styles.mb8} key={index}>
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
