import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityStatusBadge } from 'src/components/activity-groups-list/activity-group-item/activity-status-badge/activity-status-badge';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { ActivityStatusEnum } from 'src/enums/activity-status.enum';
import { SaplingTransactionHistoryItem } from 'src/interfaces/sapling-service.interface';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatAssetAmount } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { usePrivateActivityItemStyles } from './private-activity-item.styles';

interface Props {
  transaction: SaplingTransactionHistoryItem;
}

export const PrivateActivityItem = ({ transaction }: Props) => {
  const styles = usePrivateActivityItemStyles();
  const colors = useColors();
  const tezExchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  const isIncoming = transaction.type === 'incoming';
  const iconName = isIncoming ? IconNameEnum.ArrowDown : IconNameEnum.ArrowUp;
  const iconColor = isIncoming ? colors.adding : colors.destructive;

  const amountTez = mutezToTz(new BigNumber(transaction.value), TEZ_TOKEN_METADATA.decimals);
  const formattedAmount = formatAssetAmount(amountTez);

  const dollarAmount = useMemo(() => {
    if (!tezExchangeRate) {
      return null;
    }

    const dollar = amountTez.times(tezExchangeRate);

    return isIncoming ? dollar : dollar.negated();
  }, [amountTez, tezExchangeRate, isIncoming]);

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.upperContainer}>
        <View style={styles.typeContainer}>
          <Icon name={iconName} color={iconColor} />
          <Divider size={formatSize(4)} />
          <Text style={styles.typeText}>Transfer</Text>
        </View>

        <View style={styles.addressContainer}>
          <PublicKeyHashText style={styles.addressText} publicKeyHash={transaction.paymentAddress} />
        </View>
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, conditionalStyle(isIncoming, styles.positiveAmountText)]}>
          {isIncoming ? '+' : '-'}
          {formattedAmount} TEZ
        </Text>
      </View>
      <Divider size={formatSize(4)} />
      <View style={styles.lowerContainer}>
        <View style={styles.statusContainer}>
          <ActivityStatusBadge status={ActivityStatusEnum.Applied} />
          {transaction.memo ? (
            <>
              <Divider size={formatSize(4)} />
              <Text style={styles.memoText}>Memo: {transaction.memo}</Text>
            </>
          ) : null}
        </View>

        {dollarAmount !== null && (
          <FormattedAmount
            amount={dollarAmount}
            isDollarValue
            showMinusSign={dollarAmount.isLessThan(0)}
            showPlusSign={dollarAmount.isGreaterThan(0)}
            style={[
              styles.dollarText,
              conditionalStyle(dollarAmount.isGreaterThan(0), styles.positiveAmountText, styles.negativeAmountText)
            ]}
          />
        )}
      </View>
      <Divider size={formatSize(16)} />
    </View>
  );
};
