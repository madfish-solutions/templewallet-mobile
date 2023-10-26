import { Route3Activity } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import { isEmpty } from 'lodash-es';
import React, { FC, memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useRobotIconStyles } from 'src/components/robot-icon/robot-icon.styles';
import { calculateFiatAmount, useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { useFiatToUsdRateSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEMPLE_TOKEN } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { calculateDollarValue, separateAmountsBySign } from 'src/utils/activity.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking';
import { mutezToTz } from 'src/utils/tezos.util';

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

export const Route3: FC<{ activity: Route3Activity }> = memo(({ activity }) => {
  const nonZeroAmounts = useNonZeroAmounts(activity.tokensDeltas);

  return (
    <AbstractItem
      status={activity.status}
      timestamp={activity.timestamp}
      face={<Face nonZeroAmounts={nonZeroAmounts} />}
      details={<Details hash={activity.hash} nonZeroAmounts={nonZeroAmounts} cashback={activity.cashback} />}
    />
  );
});

const Face: FC<{ nonZeroAmounts: Array<ActivityAmount> }> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const iconStyles = useRobotIconStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={iconStyles.root}>
        <Icon name={IconNameEnum.Route3} size={formatSize(36)} />
      </View>
      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationTitle}>3Route</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationSubtitle}>Swap tokens</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};

const Details: FC<{ hash: string; nonZeroAmounts: Array<ActivityAmount>; cashback?: BigNumber }> = ({
  hash,
  nonZeroAmounts,
  cashback
}) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();

  const commonStyles = useActivityCommonStyles();

  const exchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const tkeyExchangeRate = exchangeRates[toTokenSlug(TEMPLE_TOKEN.address, TEMPLE_TOKEN.id)];

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
                <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />
              </View>
            ))}
          </View>
        </View>
      )}
      {isDefined(cashback) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Cashback:</Text>
          <View>
            <View style={styles.mb8}>
              <ItemAmountChange
                isPositive
                amount={mutezToTz(cashback, TEMPLE_TOKEN.decimals)}
                symbol={TEMPLE_TOKEN.symbol}
              />
              <ActivityGroupDollarAmountChange
                dollarValue={calculateFiatAmount(
                  mutezToTz(cashback, TEMPLE_TOKEN.decimals),
                  tkeyExchangeRate,
                  fiatToUsdRate
                )}
              />
            </View>
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
                <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />
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
