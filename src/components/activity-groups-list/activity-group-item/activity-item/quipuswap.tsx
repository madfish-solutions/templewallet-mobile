import { ActivitySubtype, QuipuswapActivity } from '@temple-wallet/transactions-parser';
import { isEmpty } from 'lodash-es';
import React, { useMemo, type FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useRobotIconStyles } from 'src/components/robot-icon/robot-icon.styles';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue, getQuipuswapSubtitle, separateAmountsBySign } from 'src/utils/activity.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking';

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

export const Quipuswap: FC<{ activity: QuipuswapActivity; nonZeroAmounts: Array<ActivityAmount> }> = ({
  activity,
  nonZeroAmounts
}) => {
  return (
    <AbstractItem
      status={activity.status}
      timestamp={activity.timestamp}
      face={<Face subtype={activity.subtype} nonZeroAmounts={nonZeroAmounts} />}
      details={<Details nonZeroAmounts={nonZeroAmounts} hash={activity.hash} />}
    />
  );
};

const Face: FC<{ subtype: ActivitySubtype; nonZeroAmounts: Array<ActivityAmount> }> = ({ subtype, nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const iconStyles = useRobotIconStyles();
  const commonStyles = useActivityCommonStyles();

  const subtitle = getQuipuswapSubtitle(subtype);

  return (
    <>
      <View style={iconStyles.root}>
        <Icon name={IconNameEnum.QuipuswapActivity} size={formatSize(36)} />
      </View>
      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationTitle}>Quipuswap</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationSubtitle}>{subtitle}</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </>
  );
};

const Details: FC<{ hash: string; nonZeroAmounts: Array<ActivityAmount> }> = ({ hash, nonZeroAmounts }) => {
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const { positiveAmounts, negativeAmounts } = useMemo(() => separateAmountsBySign(nonZeroAmounts), [nonZeroAmounts]);

  return (
    <>
      {!isEmpty(positiveAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Received:</Text>
          <View>
            {positiveAmounts.map((amount, index) => (
              <View style={styles.mb8} key={index}>
                <ItemAmountChange amount={amount.parsedAmount} isPositive={amount.isPositive} symbol={amount.symbol} />
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
                <ItemAmountChange amount={amount.parsedAmount} isPositive={amount.isPositive} symbol={amount.symbol} />
                {isDefined(amount.fiatAmount) && <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />}
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText
            longPress
            style={styles.hashChip}
            publicKeyHash={hash}
            testID={ActivityGroupItemSelectors.operationHash}
          />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
