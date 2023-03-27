import { useMemo } from 'react';
import React, { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PaymentProviderInterface } from 'src/interfaces/topup.interface';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';

import { usePaymentProviderStyles } from './payment-provider.styles';

const PaymentProvider: DropdownListItemComponent<PaymentProviderInterface> = ({ item, isSelected }) => {
  const styles = usePaymentProviderStyles();
  const colors = useColors();

  const tagsProps = useMemo(() => {
    const result: Array<{ label: string; backgroundColor: string }> = [];

    if (item.isBestPrice) {
      result.push({ label: 'Best price', backgroundColor: colors.blue });
    }
    if (!item.kycRequired) {
      result.push({ label: 'No KYC', backgroundColor: colors.accentDarkGray });
    }

    return result;
  }, [item, colors]);

  return (
    <View style={styles.root}>
      {tagsProps.length > 0 && (
        <View style={styles.tagsContainer}>
          {tagsProps.map(({ label, backgroundColor }, index) => (
            <View
              key={label}
              style={[styles.tag, { backgroundColor }, index < tagsProps.length - 1 && styles.overlapped]}
            >
              <Text style={styles.tagLabel}>{label}</Text>
            </View>
          ))}
        </View>
      )}
      {tagsProps.length > 0 && <Divider size={formatSize(19)} />}
      <View style={styles.body}>
        <View style={styles.logoContainer}>
          <Icon name={item.iconName} size={formatSize(32)} />
        </View>
        <View style={styles.providerInfoContainer}>
          <Text style={styles.infoTitle}>{item.name}</Text>
          <Text style={styles.infoSubtitle}>
            {isDefined(item.minInputAmount) && isDefined(item.maxInputAmount) && isDefined(item.inputSymbol)
              ? `${item.minInputAmount} - ${item.maxInputAmount} ${item.inputSymbol}`
              : '---'}
          </Text>
        </View>
        <View style={styles.outputInfoContainer}>
          <Text style={styles.infoTitle}>
            {isDefined(item.outputSymbol) && isDefined(item.outputAmount)
              ? `≈ ${item.outputAmount} ${item.outputSymbol}`
              : '---'}
          </Text>
          <Text style={styles.infoSubtitle}>
            {isDefined(item.inputSymbol) && isDefined(item.inputAmount)
              ? `≈ ${item.inputAmount} ${item.inputSymbol}`
              : '---'}
          </Text>
        </View>
      </View>
      {isSelected && (
        <Icon name={IconNameEnum.Check} size={formatSize(24)} style={styles.checkmark} color={colors.peach} />
      )}
    </View>
  );
};

export const renderPaymentProviderOption = (props: { item: PaymentProviderInterface; isSelected: boolean }) => (
  <PaymentProvider {...props} />
);
