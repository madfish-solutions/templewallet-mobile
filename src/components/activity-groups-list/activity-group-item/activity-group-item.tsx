import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTokenMetadataGetter } from '../../../hooks/use-token-metadata-getter.hook';
import { ActivityGroup, emptyActivity } from '../../../interfaces/activity.interface';
import { useExchangeRatesSelector } from '../../../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { isDefined } from '../../../utils/is-defined';
import { isString } from '../../../utils/is-string';
import { tzktUrl } from '../../../utils/linking.util';
import { mutezToTz } from '../../../utils/tezos.util';
import { Divider } from '../../divider/divider';
import { ExternalLinkButton } from '../../icon/external-link-button/external-link-button';
import { PublicKeyHashText } from '../../public-key-hash-text/public-key-hash-text';
import { ActivityGroupAmountChange } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { ActivityGroupType } from './activity-group-type/activity-group-type';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';

export interface NonZeroAmounts {
  amounts: {
    parsedAmount: BigNumber;
    isPositive: boolean;
    symbol: string;
    exchangeRate: number;
  }[];
  dollarSums: number[];
}

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();

  const firstActivity = group[0] ?? emptyActivity;

  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useExchangeRatesSelector();

  const nonZeroAmounts = useMemo(() => {
    const amounts = [];
    let positiveAmountSum = 0;
    let negativeAmountSum = 0;

    for (const { address, id, amount } of group) {
      const slug = getTokenSlug({ address, id });
      const { decimals, symbol, name } = getTokenMetadata(slug);
      const exchangeRate: number | undefined = exchangeRates[slug];
      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: id ?? 0 }));
      }

      const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
      const isPositive = parsedAmount.isPositive();

      if (isDefined(exchangeRate)) {
        const summand = parsedAmount.toNumber() * exchangeRate;
        if (isPositive) {
          positiveAmountSum += summand;
        } else {
          negativeAmountSum += summand;
        }
      }

      if (!parsedAmount.isEqualTo(0)) {
        amounts.push({
          parsedAmount,
          isPositive,
          symbol,
          exchangeRate
        });

        if (amounts.length === 2 && amounts[0].isPositive) {
          [amounts[0], amounts[1]] = [amounts[1], amounts[0]];
        }
      }
    }

    return { amounts, dollarSums: [negativeAmountSum, positiveAmountSum].filter(sum => sum !== 0) };
  }, [group, getTokenMetadata, exchangeRates]);

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.upperContainer}>
        <ActivityGroupType group={group} />

        <View style={styles.exploreContainer}>
          <PublicKeyHashText publicKeyHash={firstActivity.hash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(firstActivity.hash)} />
        </View>
      </View>
      <Divider size={formatSize(8)} />
      <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
      <Divider size={formatSize(4)} />
      <View style={styles.lowerContainer}>
        <View style={styles.statusContainer}>
          <ActivityStatusBadge status={firstActivity.status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={firstActivity.timestamp} />
        </View>

        <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
      </View>
      <Divider size={formatSize(16)} />
    </View>
  );
};
